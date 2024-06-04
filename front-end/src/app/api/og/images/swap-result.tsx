import { ColorScheme } from "./colors";
import * as FrameInterface from "@/models/frame";
import React from "react";
import { ImageResponse } from "next/og";
import { CoinLogo } from "@/asset/logos/coin-logo";
import ArrowDownward from "@/asset/logos/arrow-downward";
import { dbClient, getTokenInfo, getUserFarcasterInfo } from "@/funcs/db";

const colors = new ColorScheme("dark");

const formatMarketCap = (value: number) => {
  if (value >= 1e12) {
    return `${(value / 1e12).toFixed(1)} T`;
  } else if (value >= 1e9) {
    return `${(value / 1e9).toFixed(1)} B`;
  } else if (value >= 1e6) {
    return `${(value / 1e6).toFixed(1)} M`;
  } else if (value >= 1e3) {
    return `${(value / 1e3).toFixed(1)} K`;
  } else if (value >= 1) {
    return value.toFixed(2);
  } else if (value < 0.000000001) {
    return "0";
  } else {
    return value.toFixed(Number(value).toString().split(".")[1].search(/[^0]+/) + 2);
  }
};

const Component = ({ frameData, userInfo, targetTokenInfo }: { frameData: any; userInfo: any; targetTokenInfo: any }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 600,
        height: 600,
        fontSize: "1.3rem",
        backgroundColor: colors.surface,
        color: colors.onSurface,
        padding: "2rem",
      }}
    >
      <div
        style={{
          marginBottom: "1.5rem",
          display: "flex",
          fontSize: "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          <img alt="profile" src={userInfo.pfp_url} width={72} height={72} style={{ borderRadius: "50%" }} />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            paddingLeft: "0.75rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              marginLeft: "0.3rem",
              marginBottom: "0.2rem",
              lineHeight: "1.3rem",
            }}
          >
            <span
              style={{
                color: colors.outline,
              }}
            >
              @
            </span>
            {userInfo.fname}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "0.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: "0.9rem",
                color: colors.outline,
                paddingLeft: "0.3rem",
              }}
            >
              <div style={{ display: "flex" }}>
                <span style={{ color: colors.onSurface }}>{userInfo.following_count}</span>
                <span style={{ marginLeft: "0.2rem" }}>Following</span>
              </div>
              <div style={{ display: "flex", marginLeft: "0.5rem" }}>
                <span style={{ color: colors.onSurface }}>{userInfo.follower_count}</span>
                <span style={{ marginLeft: "0.2rem" }}>Followers</span>
              </div>
            </div>
            <div
              style={{
                fontSize: "1rem",
                color: colors.outline,
                paddingRight: 8,
              }}
            >
              check out /farfi
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: "2rem",
          marginTop: "2rem",
          marginBottom: "2rem",
        }}
      >
        Successfully Traded 👍
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: colors.outline,
            marginBottom: "0.3rem",
            fontSize: "1.3rem",
            paddingLeft: "0.5rem",
          }}
        >
          From
        </div>
        <div
          style={{
            display: "flex",
            padding: "1.5rem 2rem 1.5rem 2rem",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: colors.surfaceContainer,
            borderRadius: "0.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {frameData.swap.tokenIn.address.toLowerCase() === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE".toLowerCase() ? (
              <div
                className="image-wrapper"
                style={{
                  display: "flex",
                  backgroundColor: colors.onSecondary,
                  borderRadius: "50%",
                }}
              >
                <img alt={frameData.swap.tokenIn.address} src="https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501628" width={36} height={36} style={{ borderRadius: "50%" }} />
              </div>
            ) : targetTokenInfo.logo && targetTokenInfo.logo.startsWith("http") ? (
              <div
                className="image-wrapper"
                style={{
                  display: "flex",
                  backgroundColor: colors.onSecondary,
                  borderRadius: "50%",
                }}
              >
                <img alt={frameData.swap.tokenIn.address} src={targetTokenInfo.logo} width={36} height={36} style={{ borderRadius: "50%" }} />
              </div>
            ) : (
              <CoinLogo width="36" height="36" stroke={colors.outline} />
            )}
            <div
              style={{
                display: "flex",
                fontSize: "1.3rem",
                marginLeft: "1rem",
              }}
            >
              {frameData.swap.tokenIn.symbol}
            </div>
          </div>
          <div style={{ display: "flex", fontSize: "1.3rem", color: colors.error }}>{`- ${formatMarketCap(Number(frameData.swap.tokenIn.amount))}`}</div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          paddingTop: "1.5rem",
          paddingBottom: "0.5rem",
        }}
      >
        <ArrowDownward width="24" height="24" fill={colors.outline} />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: colors.outline,
            marginBottom: "0.3rem",
            fontSize: "1.3rem",
            paddingLeft: "0.5rem",
          }}
        >
          To
        </div>
        <div
          style={{
            display: "flex",
            padding: "1.5rem 2rem 1.5rem 2rem",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: colors.surfaceContainer,
            borderRadius: "0.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {frameData.swap.tokenOut.address.toLowerCase() === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE".toLowerCase() ? (
              <div
                className="image-wrapper"
                style={{
                  display: "flex",
                  backgroundColor: colors.onSecondary,
                  borderRadius: "50%",
                }}
              >
                <img alt={frameData.swap.tokenOut.address} src="https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501628" width={36} height={36} style={{ borderRadius: "50%" }} />
              </div>
            ) : targetTokenInfo.logo && targetTokenInfo.logo.startsWith("http") ? (
              <div
                className="image-wrapper"
                style={{
                  display: "flex",
                  backgroundColor: colors.onSecondary,
                  borderRadius: "50%",
                }}
              >
                <img alt={frameData.swap.tokenOut.address} src={targetTokenInfo.logo} width={36} height={36} style={{ borderRadius: "50%" }} />
              </div>
            ) : (
              <CoinLogo width="36" height="36" stroke={colors.outline} />
            )}
            <div
              style={{
                display: "flex",
                fontSize: "1.3rem",
                marginLeft: "1rem",
              }}
            >
              {frameData.swap.tokenOut.symbol}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "1.3rem",
              color: colors.primaryFixed,
            }}
          >
            {`+ ${formatMarketCap(Number(frameData.swap.tokenOut.amount))}`}
          </div>
        </div>
      </div>
    </div>
  );
};

const SwapResult = async ({ frameData }: { frameData: any }) => {
  let fid: any;
  try {
    if (frameData.fid) {
      fid = Number(frameData.fid);
    } else {
      const prisma = await dbClient();
      const swapLog = await prisma.swapLog.findUnique({
        where: {
          chain_id_hash: {
            chain_id: frameData.chainId,
            hash: frameData.transactionHash,
          },
        },
      });
      fid = swapLog?.user_fid || 499155;
    }
    //{ userInfo }
    const P_getUserFarcasterInfo = getUserFarcasterInfo(Number(fid));
    const P_targetTokenInfo = getTokenInfo(
      Number(frameData.chainId),
      frameData.swap.tokenOut.address.toLowerCase() === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE".toLowerCase() ? frameData.swap.tokenIn.address.toLowerCase() : frameData.swap.tokenOut.address.toLowerCase()
    );

    const [{ userInfo }, targetTokenInfo] = await Promise.all([P_getUserFarcasterInfo, P_targetTokenInfo]);

    const frameComponentHtml = React.createElement(Component, {
      frameData,
      userInfo,
      targetTokenInfo,
    });

    return new ImageResponse(frameComponentHtml, {
      width: 600,
      height: 600,
      emoji: "fluent",
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (err) {
    console.error(err);
    return new ImageResponse(<div>Error</div>, {
      width: 600,
      height: 600,
      emoji: "fluent",
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  }
};

export default SwapResult;
