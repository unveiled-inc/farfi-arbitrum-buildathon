import { ColorScheme } from "./colors";
import * as FrameInterface from "@/models/frame";
import React from "react";
import { ImageResponse } from "next/og";
import { getPendleMarketData } from "@/funcs/db-pendle";
import { getUserFarcasterInfo } from "@/funcs/db";
const colors = new ColorScheme("light");

const Component = ({ userInfo }: { userInfo: FrameInterface.UserInfo }): JSX.Element => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 600,
        height: 600,
        backgroundColor: colors.surface,
        color: colors.onSurface,
        padding: "2rem",
      }}
    >
      <div
        style={{
          marginBottom: "2rem",
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
          <img alt="profile" src={userInfo.pfp_url || ""} width={72} height={72} style={{ borderRadius: "50%" }} />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            paddingLeft: "0.75rem",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginLeft: "0rem",
              marginBottom: "0.2rem",
            }}
          >
            <div style={{ display: "flex", lineHeight: "1.3rem" }}>
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
                fontSize: "1rem",
                color: colors.outline,
                paddingRight: 8,
              }}
            >
              /farfi
            </div>
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
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          flex: "1 1 auto",
          borderRadius: "1.5rem",
          padding: "2rem",
          backgroundColor: colors.surfaceContainerLowest,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img alt="arbitrum-logo" src={`${process.env.ROOT_URL}/arbitrum-logo.png`} width={64} />
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "1.75rem",
            color: colors.primary,
            marginTop: "1rem",
          }}
        >
          My Arbitrum Score
        </div>
        <div
          style={{
            display: "flex",
            fontSize: "4rem",
            color: colors.outline,
            flex: "1 1 auto",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <span style={{ opacity: 0 }}>0</span>
          <span
            style={{
              fontSize: "3rem",
              color: colors.surfaceContainerLow,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: "50",
            }}
          >
            Coming soon..
          </span>
        </div>
        <div style={{ display: "flex", fontSize: "1.2rem", color: colors.outline }}>{`My Rank: - / -`}</div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          flexDirection: "column",
          paddingTop: "2rem",
        }}
      >
        <span style={{ color: colors.primary, fontSize: "2.25rem" }}>Rank up and win up to 10 ETH</span>
        <span
          style={{
            color: colors.secondary,
            fontSize: "1.3rem",
          }}
        >
          TBA in /farfi channel.
        </span>
      </div>
    </div>
  );
};

const PendleEvent = async ({ frameData }: { frameData: { fid: number } }) => {
  try {
    const fid = Number(frameData.fid);
    const { userInfo } = await getUserFarcasterInfo(fid);

    if (userInfo === null) {
      throw new Error("Invalid fid");
    }

    const frameComponentHtml = React.createElement(Component, { userInfo });

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

export default PendleEvent;
