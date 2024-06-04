import * as FrameInterface from "@/models/frame";
import { ReactElement } from "react";
import { decodeBase64, encodeToBase64 } from "@/funcs/base64";
import { parseSwap } from "@0x/0x-parser";
import { publicClient, getChain } from "@/funcs/provider";
import { dbClient, getTokenInfo } from "@/funcs/db";
import zeroExAbi from "./abi/zeroExAbi.json";
import { decodeEventLog } from "viem";

const SwapResult = async ({ reqRawData, baseUrl }: { reqRawData: string; baseUrl: string }): Promise<ReactElement> => {
  const reqData = decodeBase64(reqRawData);
  const fid = reqData.untrustedData.fid;
  const transactionHash = reqData.untrustedData.transactionId;
  const castId = reqData.untrustedData.castId;
  const state = reqData.untrustedData.state ? await JSON.parse(reqData.untrustedData.state) : undefined;
  const currentTimestamp = Date.now();
  const chainId = Number(state?.chainId);

  const prisma = await dbClient();

  const client = publicClient(chainId);
  const chain = getChain(chainId);

  if (!client || !chain) {
    return (
      <html>
        <head></head>
        <body>Invalid chain</body>
      </html>
    );
  }

  const waitStart = performance.now();
  const tx = await client.waitForTransactionReceipt({
    hash: transactionHash,
  });
  const waitEnd = performance.now();
  console.log(`    - WaitTxn ${waitEnd - waitStart} msec`);

  if (tx?.status === "success") {
    if (tx.to?.toLowerCase() === "0xdef1c0ded9bec7f1a1670819833240f027b25eff") {
      const parseSwapStart = performance.now();
      const swap = await parseSwap({
        transactionHash,
        exchangeProxyAbi: zeroExAbi as any,
        rpcUrl: chain.rpcUrls.default.http[0] as string,
      });

      if (!swap) {
        throw new Error(`Transaction Fail - Check your latest tx`);
      }

      const parseSwapEnd = performance.now();
      console.log(`    - ParseSwap ${parseSwapEnd - parseSwapStart} msec`);

      const log = await prisma.swapLog.findUnique({
        where: {
          chain_id_hash: {
            chain_id: chainId,
            hash: transactionHash,
          },
        },
      });

      if (log === null) {
        await prisma.swapLog.create({
          data: {
            chain_id: chainId,
            hash: transactionHash,
            token_address: swap.tokenOut?.address?.toLowerCase() === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE".toLowerCase() ? swap.tokenIn.address.toLowerCase() : swap.tokenOut.address.toLowerCase(),
            referrer_fid: castId.fid,
            user_fid: fid,
          },
        });
        console.log(`${chainId}:${transactionHash} - ${fid}(ref. ${castId.fid})`);
      }

      const imageData = encodeToBase64({
        fid,
        swap,
        chainId,
        transactionHash,
      });

      return (
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content={`${baseUrl}/api/og?name=swapresult&image=${imageData}`} />
            <meta property="fc:frame:image:aspect_ratio" content="1:1" />
            <meta property="fc:frame:button:1" content="Trending" />
            <meta property="fc:frame:button:1:action" content="post" />
            <meta property="fc:frame:button:1:target" content={`${baseUrl}/frame/trending?version=${currentTimestamp}`} />
            <meta property="fc:frame:button:2" content="My Assets" />
            <meta property="fc:frame:button:2:action" content="post" />
            <meta property="fc:frame:button:2:target" content={`${baseUrl}/api/frame?name=myassets`} />
            <meta property="fc:frame:button:3" content="Share" />
            <meta property="fc:frame:button:3:action" content="link" />
            <meta property="fc:frame:button:3:target" content={`https://warpcast.com/~/compose?embeds[]=${baseUrl}/frame/swapresult/${chainId}/${transactionHash}`} />
            <meta property="fc:frame:button:4" content="Tx result" />
            <meta property="fc:frame:button:4:action" content="link" />
            <meta property="fc:frame:button:4:target" content={`${chain.blockExplorers?.default.url}/tx/${transactionHash}`} />
          </head>
          <body></body>
        </html>
      );
    } else if (tx.to?.toLowerCase() === "0x8715a1c69618c2605e6226b0fda018a1c92de372") {
      // const response = await fetch(
      //   `https://api-v2.pendle.finance/core/v3/42161/transactions?market=${state.address}&skip=0&limit=5&user=${tx.from}`,
      // );
      // const pendleInfoData = await response.json();
      // console.log(pendleInfoData);
      // const pendleInfo = pendleInfoData.results.filter((log: any) => {
      //   return log.txHash.toLowerCase() === tx.transactionHash.toLowerCase();
      // })[0];
      const log = tx.logs.filter((log: any) => log.address.toLowerCase() === "0x888888888889758f76e7103c6cbf23abbf58f946")[0];

      // console.log(reqData);

      const targetLog = decodeEventLog({
        abi: [
          {
            type: "event",
            name: "SwapPtAndToken",
            inputs: [
              { indexed: true, name: "caller", type: "address" },
              { indexed: true, name: "market", type: "address" },
              { indexed: true, name: "token", type: "address" },
              { indexed: false, name: "receiver", type: "address" },
              { indexed: false, name: "netPtToAccount", type: "int256" },
              { indexed: false, name: "netTokenToAccount", type: "int256" },
              { indexed: false, name: "netSyInterm", type: "uint256" },
            ],
          },
        ],
        data: log.data,
        topics: log.topics,
      });

      // console.log(targetLog);

      const imageData = encodeToBase64({
        fid,
        pendleInfo: {
          market: targetLog.args.market,
          netPtToAccount: targetLog.args.netPtToAccount.toString(),
          amount: reqData.untrustedData.inputText,
        },
        chainId,
        transactionHash,
      });
      return (
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content={`${baseUrl}/api/og?name=pendledepositresult&image=${imageData}`} />
            <meta property="fc:frame:image:aspect_ratio" content="1:1" />
            <meta property="fc:frame:button:1" content="Home" />
            <meta property="fc:frame:button:1:action" content="post" />
            <meta property="fc:frame:button:1:target" content={`${baseUrl}/api/frame?name=pendlemain`} />
            <meta property="fc:frame:button:2" content="Tx Result" />
            <meta property="fc:frame:button:2:action" content="link" />
            <meta property="fc:frame:button:2:target" content={`${chain.blockExplorers?.default.url}/tx/${transactionHash}`} />
            <meta property="fc:frame:button:3" content="Pendle" />
            <meta property="fc:frame:button:3:action" content="link" />
            <meta property="fc:frame:button:3:target" content={`https://app.pendle.finance/trade/markets`} />
          </head>
          <body></body>
        </html>
      );
    } else {
      const imageData = encodeToBase64({
        fid: 499155,
        msg: "Token approval is now complete!||Click ‘Continue’ to finalize the sell transaction.|| ||*If you are curious about why ‘token approval’ was needed, ask in the /farfi channel.",
        fetchNeeded: true,
      });
      return (
        <html>
          <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content={`${baseUrl}/api/og?name=rendermsg&image=${imageData}`} />
            <meta
              property="fc:frame:state"
              content={JSON.stringify({
                address: tx.to,
                chainId: 8453,
                method: "swap",
                amount: reqData.untrustedData.inputText,
                buttons: ["cancel", "/farfi", "sell"],
              })}
            />
            <meta property="fc:frame:image:aspect_ratio" content="1:1" />
            <meta property="fc:frame:button:1" content="Cancel" />
            <meta property="fc:frame:button:1:action" content="post" />
            <meta property="fc:frame:button:1:target" content={`${baseUrl}/api/frame?name=swap`} />
            <meta property="fc:frame:button:2" content="/farfi" />
            <meta property="fc:frame:button:2:action" content="link" />
            <meta property="fc:frame:button:2:target" content={`https://warpcast.com/~/channel/farfi`} />
            <meta property="fc:frame:button:3" content="Continue" />
            <meta property="fc:frame:button:3:action" content="tx" />
            <meta property="fc:frame:button:3:target" content={`${baseUrl}/api/frametxdata`} />
            <meta property="fc:frame:button:3:post_url" content={`${baseUrl}/api/frame?name=swapresult`} />
          </head>
          <body></body>
        </html>
      );
    }
  } else {
    throw new Error(`Transaction Fail - Check your latest tx`);
  }
};

export default SwapResult;
