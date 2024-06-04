import { NextRequest, NextResponse } from "next/server";
import { decodeBase64, encodeToBase64 } from "@/funcs/base64";
import { decodeData } from "@/funcs/neynar-decode";
import { createPublicClient, http, encodeFunctionData, parseUnits, formatEther, type Address } from "viem";
import { warpcastTxChains, zeroExApiEndpoint } from "@/const/frame-chains";
import { getTokenInfo } from "@/funcs/db";
import { publicClient } from "@/funcs/provider";
import { FrameSignaturePacket } from "@/models/frame";
import { pendleForwarderAbi } from "./abi/pendleForwarder";

export const dynamic = "force-dynamic";

// const publicClient = createPublicClient({
//   chain: base,
//   transport: http(),
// });

const zeroExBaseProxyAddr: Address = "0xdef1c0ded9bec7f1a1670819833240f027b25eff";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const reqData: FrameSignaturePacket = await req.json();
  const state = reqData.untrustedData.state ? await JSON.parse(reqData.untrustedData.state) : undefined;
  const userAddress = reqData.untrustedData.address;
  const chainId = Number(state.chainId);
  const client = publicClient(chainId);

  if (!client) {
    return new NextResponse("Invalid chain", { status: 404 });
  }

  let txData;

  if (state?.method === "swap") {
    // Check if inputText is a numeric string
    if ((isNaN(Number(state.amount)) || Number(state.amount) === 0) && (isNaN(Number(reqData.untrustedData.inputText)) || Number(reqData.untrustedData.inputText) === 0)) {
      return NextResponse.json({ message: "The token value is invalid" }, { status: 400 });
    }

    const tokenInfo = await getTokenInfo(chainId, state.address);

    if (tokenInfo === null || !tokenInfo?.decimals) {
      return new NextResponse("Invalid token", { status: 404 });
    }

    const amount = parseUnits(state.amount || reqData.untrustedData.inputText, tokenInfo.decimals);
    if (state.buttons[Number(reqData.untrustedData.buttonIndex) - 1] === "buy") {
      const res = await fetch(
        `${zeroExApiEndpoint[`${chainId}`]}swap/v1/quote?sellToken=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&buyToken=${state.address}&buyAmount=${amount.toString()}&feeRecipient=0x77bbFD2d630A9123Ae5da78a7Af8856983223c8A&buyTokenPercentageFee=0.01`,
        {
          method: "GET",
          cache: "no-store",
          headers: {
            accept: "application/json",
            "0x-api-key": process.env.ZEROEX_API_KEY as string,
          },
        }
      );
      const txInfo = await res.json();

      txData = {
        chainId: warpcastTxChains[`${chainId}`],
        method: "eth_sendTransaction",
        params: {
          to: txInfo.to,
          data: txInfo.data,
          value: txInfo.value,
        },
      };
    } else if (state.buttons[Number(reqData.untrustedData.buttonIndex) - 1] === "sell") {
      const allowance = await client.readContract({
        address: state.address,
        abi: [
          {
            constant: true,
            inputs: [
              {
                name: "_owner",
                type: "address",
              },
              {
                name: "_spender",
                type: "address",
              },
            ],
            name: "allowance",
            outputs: [
              {
                name: "remaining",
                type: "uint256",
              },
            ],
            payable: false,
            stateMutability: "view",
            type: "function",
          },
        ],
        functionName: "allowance",
        args: [userAddress as Address, zeroExBaseProxyAddr],
      });

      if (BigInt(allowance) >= BigInt(amount)) {
        const res = await fetch(
          `${zeroExApiEndpoint[`${chainId}`]}swap/v1/quote?buyToken=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee&sellToken=${state.address}&sellAmount=${amount.toString()}&feeRecipient=0x77bbFD2d630A9123Ae5da78a7Af8856983223c8A&buyTokenPercentageFee=0.01`,
          {
            method: "GET",
            cache: "no-store",
            headers: {
              accept: "application/json",
              "0x-api-key": process.env.ZEROEX_API_KEY as string,
            },
          }
        );
        const txInfo = await res.json();
        txData = {
          chainId: warpcastTxChains[`${chainId}`],
          method: "eth_sendTransaction",
          params: {
            to: txInfo.to,
            data: txInfo.data,
            value: txInfo.value,
          },
        };
      } else {
        const calldata = encodeFunctionData({
          abi: [
            {
              inputs: [
                {
                  internalType: "address",
                  name: "spender",
                  type: "address",
                },
                {
                  internalType: "uint256",
                  name: "value",
                  type: "uint256",
                },
              ],
              name: "approve",
              outputs: [
                {
                  internalType: "bool",
                  name: "",
                  type: "bool",
                },
              ],
              stateMutability: "nonpayable",
              type: "function",
            },
          ],
          functionName: "approve",
          //   args:[zeroExBaseProxyAddr, BigInt()]
          args: [zeroExBaseProxyAddr, BigInt("115792089237316195423570985008687907853269984665640564039457584007913129639935")], // Maximum uint256 value
        });
        txData = {
          chainId: warpcastTxChains[`${chainId}`],
          method: "eth_sendTransaction",
          attribution: false,
          params: {
            to: state.address,
            data: calldata,
          },
        };
      }
    }
    return NextResponse.json(txData, { status: 200 });
  } else if (state.method === "pendle-deposit") {
    const pendleForwarderAddr = "0x8715A1c69618c2605e6226b0FdA018a1c92DE372";

    if (isNaN(Number(reqData.untrustedData?.inputText)) || Number(reqData.untrustedData?.inputText) === 0) {
      return NextResponse.json({ message: "The token amount is invalid" }, { status: 400 });
    }

    if (Number(reqData.untrustedData?.inputText) < 0.00001) {
      return NextResponse.json(
        {
          message: `The token amount is too low. It must be at least 0.00001 ETH.`,
        },
        { status: 400 }
      );
    }

    const feeData = await client.readContract({
      address: pendleForwarderAddr,
      abi: pendleForwarderAbi,
      functionName: "fee",
      args: [],
    });
    const fee = Number(formatEther(feeData));
    const value = reqData.untrustedData.inputText;

    const swapValue = parseUnits((Number(value) * (1 - fee)).toString(), 18);
    const res = await fetch(
      `https://api-v2.pendle.finance/sdk/api/v1/swapExactTokenForPt?chainId=${chainId}&receiverAddr=${userAddress}&marketAddr=${state.address}&tokenInAddr=0x0000000000000000000000000000000000000000&amountTokenIn=${swapValue}&slippage=0.005`,
      {
        method: "GET",
        cache: "no-store",
        headers: {
          accept: "application/json",
        },
      }
    );
    const txInfo = await res.json();

    if (!txInfo.transaction?.to || !txInfo.transaction?.data) {
      return NextResponse.json(
        {
          message: txInfo.message,
        },
        { status: 400 }
      );
    }

    const calldata = encodeFunctionData({
      abi: pendleForwarderAbi,
      functionName: "forwardPendle",
      args: [txInfo.transaction.to, txInfo.transaction.data, state.address, BigInt(reqData.untrustedData.fid), BigInt(reqData.untrustedData.castId.fid)],
    });

    txData = {
      chainId: warpcastTxChains[`${chainId}`],
      method: "eth_sendTransaction",
      attribution: false,
      params: {
        to: pendleForwarderAddr,
        data: calldata,
        value: parseUnits(value as string, 18).toString(),
      },
    };

    return NextResponse.json(txData, { status: 200 });
  }

  return new NextResponse("Invalid Method", { status: 400 });
}
