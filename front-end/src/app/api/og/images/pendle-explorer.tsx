import { ColorScheme } from "./colors";
import * as FrameInterface from "@/models/frame";
import React from "react";
import { ImageResponse } from "next/og";
import { UpIcon } from "@/asset/logos/up-icon";
import { DownIcon } from "@/asset/logos/down-icon";
import { FarcasterLogo } from "@/asset/logos/farcaster-logo";
import { getTrendingTokensData } from "@/funcs/db";
import moment from "moment";
import TrendingTokensTypo from "@/asset/logos/trending-tokens-typo";
import { getPendleMarketData } from "@/funcs/db-pendle";
import { PendleDbData } from "@/models/pendle";
// import Image from 'next/image';
const colors = new ColorScheme("light");

const convertUnit = (value: number) => {
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
  } else {
    return value.toFixed(value.toString().split(".")[1].search(/[^0]+/) + 2);
  }
};

const Component = ({ markets, date }: { markets: (PendleDbData | null)[]; date: any }): JSX.Element => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 600,
        height: 600,
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
          {date}
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
          margin: "3rem 0 3rem 0",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ color: colors.primary, fontSize: "2.5rem" }}>Earn Yields</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ color: colors.primary, fontSize: "2.5rem" }}>On Arbitrum</span>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              color: colors.secondary,
              fontSize: "1.3rem",
            }}
          >
            10%+ APY opportunities with $10m+ TVL
          </span>
        </div>
      </div>
      <div
        className="table-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
          paddingBottom: 6,
          borderBottom: "1px solid #6f7979",
          fontSize: "1.2rem",
          paddingLeft: 8,
          paddingRight: 8,
        }}
      >
        <div style={{ display: "flex", color: colors.outline, width: 50 }}>No</div>
        <div style={{ display: "flex", color: colors.outline, width: 90 }}>Asset</div>
        <div
          style={{
            display: "flex",
            color: colors.outline,
            width: 250,
            justifyContent: "flex-start",
          }}
        >
          Product
        </div>
        <div
          style={{
            display: "flex",
            color: colors.outline,
            width: 100,
            justifyContent: "flex-end",
          }}
        >
          APY (TVL)
        </div>
      </div>
      {markets.map(
        (market: PendleDbData | null, idx: number) =>
          market && (
            <div
              key={market.market_address}
              style={{
                display: "flex",
                width: "100%",
                marginBottom: "1.5rem",
                paddingLeft: 8,
                paddingRight: 8,
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: 50,
                  fontSize: "2rem",
                  color: colors.primary,
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                {idx + 1}
              </div>
              <div style={{ display: "flex", width: 90, alignItems: "center" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "10000px",
                    backgroundColor: colors.tertiaryContainer,
                    width: 30,
                    height: 30,
                  }}
                >
                  <img alt={`${market.market_address}-logo`} src="https://assets.coingecko.com/coins/images/279/large/ethereum.png?1696501628" width={25} height={25} style={{ borderRadius: "50%" }} />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    fontSize: "1.3rem",
                    paddingLeft: 8,
                    width: 60,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  <span>ETH</span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  width: 250,
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  <span style={{ color: colors.onSurface, fontSize: "1.3rem" }}>{`${market.pt?.proSymbol}`}</span>
                  <span
                    style={{
                      color: colors.onSurface,
                      fontSize: "1.3rem",
                      marginLeft: "0.5rem",
                    }}
                  >
                    ({moment.utc(market.pt?.expiry).format("DD MMM YYYY")})
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    width: 264,
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  <img alt="pt-token-logo" src={`${process.env.ROOT_URL}/pendle-blue.png`} height={20} />
                  <span
                    style={{
                      color: colors.outline,
                      fontSize: "1rem",
                      marginLeft: "0.5rem",
                    }}
                  >
                    Pendle
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  width: 100,
                  justifyContent: "center",
                  alignItems: "flex-end",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: colors.onSurface,
                      fontSize: "1.3rem",
                      marginLeft: "0.5rem",
                    }}
                  >
                    {market.implied_apy ? `${(market.implied_apy * 100).toFixed(2)}%` : "-"}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      color: colors.outline,
                      fontSize: "1rem",
                      marginLeft: "0.5rem",
                    }}
                  >
                    {market.liquidity_usd ? `$${convertUnit(market.liquidity_usd)}` : "-"}
                  </span>
                </div>
              </div>
            </div>
          )
      )}
    </div>
  );
};

const PendleExplorer = async ({ frameData }: { frameData: { markets: string[] } }) => {
  try {
    // const { trendingTokens, createdAt } = await getTrendingTokensData();

    const markets: (PendleDbData | null)[] = await Promise.all(
      frameData.markets.map(async (marketAddr: string) => {
        return await getPendleMarketData({ marketAddress: marketAddr });
      })
    );

    const date = `${moment.utc(markets[0]?.updated_at).format("YYYY-MM-DD hh:mm:ss")} UTC`;

    const frameComponentHtml = React.createElement(Component, {
      markets,
      date,
    });

    return new ImageResponse(frameComponentHtml, {
      width: 600,
      height: 600,
      emoji: "fluent",
      headers: {
        // 'Content-Type': 'image/png',
        // 'Cache-Control': 'public, max-age=10',
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

export default PendleExplorer;
