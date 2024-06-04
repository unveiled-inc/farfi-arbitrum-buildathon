import { ColorScheme } from "./colors";
import * as FrameInterface from "@/models/frame";
import React from "react";
import { ImageResponse } from "next/og";
import { CoinLogo } from "@/asset/logos/coin-logo";
import ArrowDownward from "@/asset/logos/arrow-downward";
import { dbClient, getTokenInfo, getUserFarcasterInfo } from "@/funcs/db";
import { getPendleMarketData } from "@/funcs/db-pendle";
import { checksumAddress, formatUnits } from "viem";
import { PendleDbData } from "@/models/pendle";
import moment from "moment";

const colors = new ColorScheme("light");

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
    return value.toFixed(Number(value).toString().split(".")[1].search(/[^0]+/) + 4);
  }
};

const Component = ({ frameData, pendleMarketData }: { frameData: any; pendleMarketData: PendleDbData | null }) => {
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
        padding: "1.5rem",
      }}
    >
      <div
        className="pendle-detail-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "0.5rem",
          color: colors.outline,
          alignItems: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1rem",
          }}
        >
          {`${moment.utc().format("YYYY-MM-DD hh:mm:ss")}
          UTC`}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1rem",
          }}
        >
          /farfi
        </div>
      </div>
      <div
        style={{
          display: "flex",
          fontSize: "2.5rem",
          marginTop: "2.5rem",
          marginBottom: "2.5rem",
          color: colors.primary,
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
            backgroundColor: colors.surfaceContainerLowest,
            borderRadius: "0.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              className="image-wrapper"
              style={{
                display: "flex",
                backgroundColor: colors.tertiaryContainer,
                borderRadius: "50%",
              }}
            >
              <img alt="eth-token-logo" src="https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501628" width={36} height={36} style={{ borderRadius: "50%" }} />
            </div>
            <div
              style={{
                display: "flex",
                fontSize: "1.3rem",
                marginLeft: "1rem",
              }}
            >
              ETH
            </div>
          </div>
          <div style={{ display: "flex", fontSize: "1.3rem", color: colors.error }}>{`- ${formatMarketCap(Number(frameData.pendleInfo.amount))}`}</div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          paddingTop: "2rem",
          paddingBottom: "0.5rem",
        }}
      >
        <ArrowDownward width="24" height="24" fill={colors.secondary} />
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
            backgroundColor: colors.surfaceContainerLowest,
            borderRadius: "0.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {pendleMarketData?.pt?.proIcon && pendleMarketData?.pt?.proIcon.startsWith("http") ? (
              <div
                className="image-wrapper"
                style={{
                  display: "flex",
                  backgroundColor: colors.onSecondary,
                  borderRadius: "50%",
                }}
              >
                <img
                  alt="target-token-logo"
                  src={pendleMarketData?.pt?.proIcon === "https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/fa1d293f-572b-4c42-806d-cc8951d81002.svg" ? `${process.env.ROOT_URL}/rseth-pro-logo.png` : pendleMarketData?.pt?.proIcon}
                  width={36}
                  height={36}
                  style={{ borderRadius: "50%" }}
                />
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
              {pendleMarketData?.pt?.symbol}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "1.3rem",
              color: colors.surfaceTint,
            }}
          >
            {`+ ${formatMarketCap(Number(formatUnits(frameData.pendleInfo.netPtToAccount, pendleMarketData?.pt?.decimals as number)))}`}
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "1.1rem",
          width: "100%",
          marginTop: "2rem",
          color: colors.primary,
        }}
      >
        <span>You can sell the purchased PT at any time on Pendle.</span>
        <span>Enjoy the yield on Arbitrum!</span>
      </div>
    </div>
  );
};

const PendleDepositResult = async ({ frameData }: { frameData: any }) => {
  try {
    const P_getPendleMarketData = getPendleMarketData({
      marketAddress: checksumAddress(frameData.pendleInfo.market),
    });

    const [pendleMarketData] = await Promise.all([P_getPendleMarketData]);

    console.log(pendleMarketData?.pt?.proIcon);

    const frameComponentHtml = React.createElement(Component, {
      frameData,
      pendleMarketData,
    });

    return new ImageResponse(frameComponentHtml, {
      width: 600,
      height: 600,
      emoji: "fluent",
      headers: {
        // 'Content-Type': 'image/png',
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
        // 'Content-Type': 'image/png',
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  }
};

export default PendleDepositResult;
