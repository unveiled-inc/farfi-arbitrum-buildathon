import { ColorScheme } from './colors';
import * as FrameInterface from '@/models/frame';
import React from 'react';
import { ImageResponse } from 'next/og';
import { getPendleMarketData } from '@/funcs/db-pendle';
import { PendleDbData } from '@/models/pendle';
const colors = new ColorScheme('light');
import moment from 'moment';
import RenderMsg from './render-msg';
import PendleLogo from '@/asset/logos/pendle-logo';

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
    return value.toFixed(value.toString().split('.')[1].search(/[^0]+/) + 2);
  }
};

const Component = ({
  pendleData,
}: {
  pendleData: PendleDbData;
}): JSX.Element => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: 600,
        height: 600,
        backgroundColor: colors.surface,
        color: colors.onSurface,
        padding: '1.5rem',
      }}
    >
      <div
        className="pendle-detail-header"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '0.5rem',
          color: colors.outline,
          fontSize: '1rem',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {`${moment.utc(pendleData.updated_at).format('YYYY-MM-DD hh:mm:ss')}
          UTC`}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          /farfi
        </div>
      </div>
      <div
        className="pendle-detail-title"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginTop: '2rem',
          marginBottom: '0.5rem',
        }}
      >
        <span style={{ color: colors.primary, fontSize: '2.5rem' }}>
          {`${pendleData.pt?.proSymbol}`}
        </span>
        <span
          style={{
            marginLeft: '0.5rem',
            marginRight: '0.5rem',
            color: colors.primary,
            fontSize: '2rem',
          }}
        >
          &#183;
        </span>
        <span style={{ color: colors.tertiary, fontSize: '2.5rem' }}>
          {moment.utc(pendleData.pt?.expiry).format('DD MMM YYYY')}
        </span>
      </div>
      <div
        className="pendle-description"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            color: colors.outline,
            fontSize: '1.2rem',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              marginRight: '0.75rem',
              alignItems: 'center',
            }}
          >
            <img
              alt="pendle-logo"
              src={`${process.env.ROOT_URL}/pendle-blue.png`}
              height="2.5rem"
              style={{ height: '2.5rem' }}
            />
            <span>Pendle on</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              alt="arbitrum-logo"
              src={`${process.env.ROOT_URL}/arbitrum-logo.png`}
              height="1.75rem"
              style={{ height: '1.75rem' }}
            />
            <span style={{ marginLeft: '0.5rem' }}>Arbitrum</span>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            color: colors.secondary,
            fontSize: '1rem',
            lineHeight: '1.2rem',
          }}
        >
          {pendleData.description}
        </div>
      </div>
      <div
        className="pendle-info-box"
        style={{
          display: 'flex',
          padding: '1.5rem',
          backgroundColor: colors.surfaceContainerLowest,
          borderRadius: '0.75rem',
          flexDirection: 'column',
          marginTop: '1.5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              flex: '1 1 auto',
            }}
          >
            <span
              style={{
                color: colors.outline,
                fontSize: '1rem',
                marginBottom: '0.5rem',
              }}
            >
              Underlying asset
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '0.2rem',
              }}
            >
              <span
                style={{
                  marginRight: '0.5rem',
                  width: '1.75rem',
                  height: '1.75rem',
                }}
              >
                <img
                  alt="token-logo"
                  src={
                    pendleData.underlying_asset?.proIcon ===
                    'https://storage.googleapis.com/prod-pendle-bucket-a/images/uploads/fac8e166-0562-45a2-b151-9d7b9d24f995.svg'
                      ? `${process.env.ROOT_URL}/rseth-logo.png`
                      : pendleData.underlying_asset?.proIcon
                  }
                  style={{ width: '1.75rem' }}
                />
              </span>
              <span style={{ color: colors.onSurface, fontSize: '1.2rem' }}>
                {pendleData.underlying_asset?.symbol}
              </span>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              flex: '1 1 auto',
            }}
          >
            <span
              style={{
                color: colors.outline,
                fontSize: '1rem',
                marginBottom: '0.5rem',
              }}
            >
              Maturity
            </span>
            <span style={{ color: colors.onSurface, fontSize: '1.2rem' }}>
              {moment.utc(pendleData.pt?.expiry).format('DD MMM YYYY')}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              flex: '1 1 auto',
            }}
          >
            <span
              style={{
                color: colors.outline,
                fontSize: '1rem',
                marginBottom: '0.5rem',
              }}
            >
              Liquidity
            </span>
            <span style={{ color: colors.onSurface, fontSize: '1.2rem' }}>
              {pendleData.liquidity_usd
                ? `$${convertUnit(pendleData.liquidity_usd)}`
                : '-'}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              flex: '1 1 auto',
            }}
          >
            <span
              style={{
                color: colors.outline,
                fontSize: '1rem',
                marginBottom: '0.5rem',
              }}
            >
              Fixed APY
            </span>
            <span style={{ color: colors.primary, fontSize: '1.3rem' }}>
              {pendleData.implied_apy
                ? `${(pendleData.implied_apy * 100).toFixed(2)}%`
                : '-'}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              flex: '1 1 auto',
            }}
          >
            <span
              style={{
                color: colors.outline,
                fontSize: '1rem',
                marginBottom: '0.5rem',
              }}
            >
              Price
            </span>
            <span style={{ color: colors.primary, fontSize: '1.3rem' }}>
              {`${pendleData.pt?.price.acc.toFixed(4)} ${pendleData.accounting_asset?.symbol}`}
            </span>
          </div>
        </div>
      </div>
      <div
        className="pendle-footer"
        style={{
          display: 'flex',
          fontSize: '0.9rem',
          color: colors.outline,
          marginTop: '1.5rem',
          paddingLeft: '0.5rem',
          paddingRight: '0.5rem',
        }}
      >
        Pendle’s fees and 0.1% fees are incurred, and slippage may occur during
        the transaction. Max slippage is set to 0.5%.
      </div>
    </div>
  );
};

const PendlePt = async ({
  frameData,
}: {
  frameData: { chainId?: number; marketAddress: string };
}) => {
  const chainId = frameData.chainId || 42161;
  const marketAddress = frameData.marketAddress;
  try {
    const pendleData = await getPendleMarketData({
      chainId,
      marketAddress,
    });

    if (pendleData === null) {
      return await RenderMsg({
        frameData: {
          fid: 499155,
          fetchNeeded: true,
          msg: `"${marketAddress}" || Sorry. This market is not yet supported.|| ||Click the '/farfi' button below and join our channel. Tell us about the token you're interested in`,
        },
      });
    }

    const frameComponentHtml = React.createElement(Component, {
      pendleData,
    });

    return new ImageResponse(frameComponentHtml, {
      width: 600,
      height: 600,
      emoji: 'fluent',
      headers: {
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
        // 'Content-Type': 'image/png',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  }
};

export default PendlePt;
