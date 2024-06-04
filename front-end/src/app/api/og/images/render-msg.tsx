import { ColorScheme } from './colors';
import * as FrameInterface from '@/models/frame';
import React from 'react';
import { ImageResponse } from 'next/og';
import { getUserFarcasterInfo } from '@/funcs/db';
import * as farfi from '../../../../../public/farfi.png';

const colorScheme = new ColorScheme('dark');

export const Component = ({
  frameData,
}: {
  frameData: FrameInterface.RenderMsgParams;
}) => {
  const messageWithBreaks = frameData.msg.split('||').map((line, index) => (
    <React.Fragment key={index}>
      {line.trim() === '' ? (
        <>
          <div
            style={{
              display: 'flex',
              // marginBottom: '0.5rem',
              color: 'transparent',
            }}
          >
            {'.'}
          </div>
        </>
      ) : (
        <>
          {line}
          <br />
        </>
      )}
    </React.Fragment>
  ));
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 600,
        height: 600,
        backgroundColor: colorScheme.surface,
        color: colorScheme.onSurface,
        padding: '16px 16px 16px 0px',
      }}
    >
      {frameData.fid ? (
        <div style={{ display: 'flex' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: '100px',
              paddingRight: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                width: 64,
                height: 64,
                borderRadius: '50%',
                overflowX: 'hidden',
                marginBottom: '1rem',
                // marginTop: '0.5rem',
              }}
            >
              <img
                alt="pfp_url"
                src={
                  frameData.fid === 499155
                    ? 'https://farfi.1tx.network/farfi.png'
                    : frameData.pfp_url
                }
                width="100%"
                height="100%"
                style={{ borderRadius: '50%' }}
              />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'column',
              width: 450,
            }}
          >
            <div style={{ display: 'flex', marginBottom: '0.3rem' }}>
              <div
                style={{
                  display: 'flex',
                  wordBreak: 'break-word',
                  flexWrap: 'wrap',
                }}
              >
                <span
                  style={{
                    color: colorScheme.outline,
                  }}
                >
                  @
                </span>
                {frameData.username}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                wordBreak: 'break-word',
                flexWrap: 'wrap',
                width: '100%',
                backgroundColor: colorScheme.surfaceContainerHigh,
                padding: '1rem 1.5rem 1rem 1.5rem',
                borderRadius: '0 16px 16px 16px',
                fontSize: '1.1rem',
                lineHeight: '1.5rem',
              }}
            >
              {messageWithBreaks}
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            fontSize: '1.5rem',
            // width: '100%',
            justifyContent: 'center',
            borderBottom: '1px solid',
          }}
        >
          {frameData.msg}
        </div>
      )}
    </div>
  );
};

const RenderMsg = async ({
  frameData,
}: {
  frameData: FrameInterface.RenderMsgParams;
}) => {
  let dataForRendering = frameData;
  if (frameData.fetchNeeded) {
    const { userInfo } = await getUserFarcasterInfo(frameData.fid || 499155);

    if (userInfo === null) {
      return new ImageResponse(<div>Invalid User FID</div>, {
        width: 600,
        height: 600,
        emoji: 'fluent',
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      });
    }

    Object.assign(dataForRendering, {
      pfp_url: userInfo.pfp_url,
      username: userInfo.fname,
      display_name: userInfo.display_name,
      follower_count: userInfo.follower_count,
    });
  }
  const frameComponentHtml = React.createElement(Component, {
    frameData: dataForRendering,
  });

  try {
    return new ImageResponse(frameComponentHtml, {
      width: 600,
      height: 600,
      emoji: 'fluent',
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch (err) {
    console.error(err);
    return new ImageResponse(<div>Error</div>, {
      width: 600,
      height: 600,
      emoji: 'fluent',
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  }
};

export default RenderMsg;
