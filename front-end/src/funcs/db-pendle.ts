import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool } from '@neondatabase/serverless';
import { PendleData, TokenDetails, PendleDbData } from '@/models/pendle';
import { dbClient } from './db';

const needToFetch = (data: Date, dataType: string) => {
  const s = 1000;
  const m = 60 * s;
  const h = 60 * m;

  const interval: { [key: string]: number } = {
    pendleMarketData: 2 * m,
  };

  if (!interval[dataType]) {
    return new Error('invalid dataType');
  }

  return data < new Date(Date.now() - interval[dataType]);
};

export const getTop3MarketData = async (
  take: number,
): Promise<(PendleDbData | null)[]> => {
  const prisma = await dbClient();
  const marketList = await prisma.pendleMarket.findMany({
    where: {
      chain_id: 42161,
      whitelisted: true,
    },
  });

  const P_top3MarketData = marketList.map(async (market) => {
    return await getPendleMarketData({
      chainId: 42161,
      marketAddress: market.market_address,
    });
  });

  const top3MarketData = await Promise.all(P_top3MarketData);

  return top3MarketData
    .sort((a, b) => {
      if (!a?.implied_apy || !b?.implied_apy) return 0;
      return b.implied_apy - a.implied_apy;
    })
    .slice(0, take);
};

export const getPendleMarketData = async ({
  chainId = 42161,
  marketAddress,
}: {
  chainId?: number;
  marketAddress: string;
}): Promise<PendleDbData | null> => {
  const prisma = await dbClient();

  const pendleMarket = await prisma.pendleMarket.findUnique({
    where: {
      chain_id_market_address: {
        chain_id: chainId,
        market_address: marketAddress,
      },
    },
  });

  if (
    pendleMarket === null ||
    (pendleMarket && needToFetch(pendleMarket.updated_at, 'pendleMarketData'))
  ) {
    const response = await fetch(
      `https://api-v2.pendle.finance/core/v1/${chainId}/markets/${marketAddress}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
    );
    const res = await response.json();
    if (res.error) {
      console.error(res.message);
      if (pendleMarket === null) return null;
      return {
        ...pendleMarket,
        pt: (pendleMarket.pt as TokenDetails) || null,
        yt: (pendleMarket.yt as TokenDetails) || null,
        sy: (pendleMarket.sy as TokenDetails) || null,
        lp: (pendleMarket.lp as TokenDetails) || null,
        underlying_asset:
          (pendleMarket.underlying_asset as TokenDetails) || null,
        accounting_asset:
          (pendleMarket.accounting_asset as TokenDetails) || null,
        trading_volume_usd: Number(pendleMarket.trading_volume_usd) || null,
        liquidity_usd: Number(pendleMarket.liquidity_usd) || null,
        implied_apy: Number(pendleMarket.implied_apy) || null,
      };
    } else {
      const pendleData: PendleData = res;
      const updatedPendleMarket = await prisma.pendleMarket.upsert({
        where: {
          chain_id_market_address: {
            chain_id: chainId,
            market_address: marketAddress,
          },
        },
        update: {
          expiry: pendleData?.expiry,
          pt: pendleData.pt,
          yt: pendleData.yt,
          sy: pendleData.sy,
          lp: pendleData.lp,
          description: `Forgo your ${pendleData.proSymbol} yields and points for fixed yields. Each PT will be redeemable for 1 ${pendleData.accountingAsset.proSymbol} worth of ${pendleData.underlyingAsset?.symbol} on ${pendleData.protocol} at maturity.
          Fixed yield is achieved at maturity, however, you can exit anytime at its current market price.`,
          underlying_asset: pendleData.underlyingAsset,
          accounting_asset: pendleData.accountingAsset,
          trading_volume_usd: pendleData.tradingVolume?.usd,
          liquidity_usd: pendleData.liquidity?.usd,
          implied_apy: pendleData.impliedApy,
        },
        create: {
          chain_id: chainId,
          market_address: marketAddress,
          expiry: pendleData?.expiry,
          pt: pendleData.pt,
          yt: pendleData.yt,
          sy: pendleData.sy,
          lp: pendleData.lp,
          description: `Forgo your ${pendleData.proSymbol} yields and points for fixed yields. Each PT will be redeemable for 1 ${pendleData.accountingAsset.proSymbol} worth of ${pendleData.underlyingAsset?.symbol} on ${pendleData.protocol} at maturity.
          Fixed yield is achieved at maturity, however, you can exit anytime at its current market price.`,
          underlying_asset: pendleData.underlyingAsset,
          accounting_asset: pendleData.accountingAsset,
          trading_volume_usd: pendleData.tradingVolume?.usd,
          liquidity_usd: pendleData.liquidity?.usd,
          implied_apy: pendleData.impliedApy,
        },
      });

      return {
        ...updatedPendleMarket,
        pt: pendleData.pt,
        yt: pendleData.yt,
        sy: pendleData.sy,
        lp: pendleData.lp,
        underlying_asset: pendleData.underlyingAsset,
        accounting_asset: pendleData.accountingAsset,
        trading_volume_usd: pendleData.tradingVolume?.usd || null,
        liquidity_usd: pendleData.liquidity?.usd || null,
        implied_apy: pendleData.impliedApy || null,
      };
    }
  } else {
    return {
      ...pendleMarket,
      pt: (pendleMarket.pt as TokenDetails) || null,
      yt: (pendleMarket.yt as TokenDetails) || null,
      sy: (pendleMarket.sy as TokenDetails) || null,
      lp: (pendleMarket.lp as TokenDetails) || null,
      underlying_asset: (pendleMarket.underlying_asset as TokenDetails) || null,
      accounting_asset: (pendleMarket.accounting_asset as TokenDetails) || null,
      trading_volume_usd: Number(pendleMarket.trading_volume_usd) || null,
      liquidity_usd: Number(pendleMarket.liquidity_usd) || null,
      implied_apy: Number(pendleMarket.implied_apy) || null,
    };
  }
};
