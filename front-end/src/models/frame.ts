import { ImageResponse } from 'next/og';

export interface FrameComponents {
  [key: string]: (data: any) => Promise<JSX.Element>;
}
export interface ImageComponent {
  [key: string]: (data: any) => Promise<ImageResponse>;
}

export interface FrameComponentProps {
  frameRawData: string;
  frameRawImage: string;
}

export interface FrameSignaturePacket {
  untrustedData: {
    fid: number;
    url: string;
    messageHash: string;
    timestamp: number;
    network: number;
    buttonIndex?: number;
    inputText?: string;
    state?: any;
    transactionId?: string;
    address?: string;
    castId: {
      fid: number;
      hash: string;
    };
  };
  trustedData: {
    messageBytes: string;
  };
}

export interface RenderMsgParams {
  pfp_url?: string;
  username?: string;
  display_name?: string;
  fid?: number;
  time?: string;
  follower_count?: number;
  msg: string;
  fetchNeeded?: boolean;
}

export interface TokenListByMarketData {
  id: string | null;
  symbol: string | null;
  name: string | null;
  image: string | null;
  current_price: number | null;
  market_cap: number | null;
  market_cap_rank: number | null;
  fully_diluted_valuation: number | null;
  total_volume: number | null;
  high_24h: number | null;
  low_24h: number | null;
  price_change_24h: number | null;
  price_change_percentage_24h: number | null;
  market_cap_change_24h: number | null;
  market_cap_change_percentage_24h: number | null;
  circulating_supply: number | null;
  total_supply: number | null;
  max_supply: number | null;
  ath: number | null;
  ath_change_percentage: number | null;
  ath_date: string | null; // date-time
  atl: number | null;
  atl_change_percentage: number | null;
  atl_date: string | null; // date-time
  roi: string | null;
  last_updated: string | null; // date-time
  price_change_percentage_1h_in_currency?: number | null;
  sparkline_in_7d?: {
    price: number[] | null;
  } | null;
}

export interface Balance {
  amount: string;
  tokenInfo?: TokenListByMarketData;
}

export interface UserPortfolio {
  [key: string]: Balance;
}

export interface SwapFrameData {
  fid?: string;
  tokenAddress: string;
  address?: string; // deprecated
  chainId: number;
}

export interface TokenParams {
  chain_id: number;
  token_address: string;
}

export interface UserInfo {
  fid: number;
  fname: string;
  display_name: string;
  pfp_url: string;
  follower_count: number;
  following_count: number;
}

export interface RoutescanTokenBalanceData {
  chainId: string;
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDecimals: number;
  tokenQuantity: string;
  tokenValueInUsd: string;
  updatedAtBlock: number;
}

export interface TokensBalanceData {
  chain_id: number;
  token_address: string;
  amount: number;
}

export interface TokenBalanceData {
  wallet_address: string;
  chain_id: number;
  tokens: TokensBalanceData[];
}
