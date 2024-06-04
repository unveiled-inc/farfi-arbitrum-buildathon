import { ColorScheme } from "./colors";
import * as FrameInterface from "@/models/frame";
import React from "react";
import { ImageResponse } from "next/og";
import { getPendleMarketData } from "@/funcs/db-pendle";
const colors = new ColorScheme("light");

const Component = (): JSX.Element => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 600,
        height: 600,
        backgroundColor: colors.surface,
        color: colors.onSurface,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "2rem",
          width: "100%",
          flex: "1 1 auto",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              flexDirection: "column",
            }}
          >
            <span style={{ color: colors.primary, fontSize: "2.5rem" }}>Earn Fixed Yields</span>
            <span style={{ color: colors.primary, fontSize: "2.5rem" }}>On ETH</span>
            <span
              style={{
                color: colors.secondary,
                fontSize: "1.3rem",
              }}
            >
              in a single transaction
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-end",
              height: "100%",
            }}
          >
            <img alt="arbitrum-logo" src={`${process.env.ROOT_URL}/arbitrum-logo.png`} width={58} />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <span
            style={{
              color: colors.secondary,
              fontSize: "1.3rem",
            }}
          >
            Opportunities with
          </span>
          <span style={{ color: colors.primary, fontSize: "2.5rem" }}>10%+ APY</span>
          <span style={{ color: colors.primary, fontSize: "2.5rem" }}>$10M+ TVL</span>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",

          backgroundColor: colors.secondaryContainer,
          position: "relative",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span
          style={{
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            top: 0,
            left: "50%",
            transform: "translate(-50%, -50%)",
            height: "2.5rem",
            backgroundColor: colors.secondaryFixedDim,
            width: "2.5rem",
            borderRadius: "10000px",
          }}
        >
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              height: "1.25rem",
              width: "0.175rem",
              borderRadius: "10000px",
              backgroundColor: colors.onSecondary,
            }}
          ></span>
          <span
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              height: "0.175rem",
              width: "1.25rem",
              borderRadius: "10000px",
              backgroundColor: colors.onSecondary,
            }}
          ></span>
        </span>
        <span
          style={{
            fontSize: "1.75rem",
            color: colors.onSecondaryFixed,
            padding: "2.5rem",
          }}
        >
          👇 Check event and win up to 10 ETH
        </span>
      </div>
    </div>
  );
};

const PendleMain = async () => {
  try {
    const frameComponentHtml = React.createElement(Component, {});

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

export default PendleMain;
