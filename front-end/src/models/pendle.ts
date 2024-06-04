export interface PriceDetails {
  usd: number;
  acc: number;
}

export interface TokenDetails {
  [key: string]: any;
  id: string;
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  expiry?: string;
  accentColor?: string;
  price: PriceDetails;
  priceUpdatedAt: string;
  baseType: string;
  types: string[];
  protocol?: string;
  underlyingPool?: string;
  simpleName?: string;
  simpleSymbol?: string;
  simpleIcon?: string;
  proName?: string;
  proSymbol?: string;
  proIcon?: string;
  zappable?: boolean;
}

export interface Asset {
  id: string;
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  expiry?: string;
  accentColor?: string;
  price: PriceDetails;
  priceUpdatedAt: string;
}

export interface ApyBreakdown {
  asset: Asset;
  absoluteApy: number;
  relativeApy: number;
}

export interface DailyPoolReward {
  asset: Asset;
  amount: number;
}

export interface ExtendedInfo {
  floatingPt: number;
  floatingSy: number;
}

export interface PendleData {
  id: string;
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  expiry?: string;
  pt: TokenDetails;
  yt: TokenDetails;
  sy: TokenDetails;
  lp: TokenDetails;
  accountingAsset: TokenDetails;
  underlyingAsset: TokenDetails;
  basePricingAsset: TokenDetails;
  rewardTokens: TokenDetails[];
  inputTokens: TokenDetails[];
  outputTokens: TokenDetails[];
  protocol?: string;
  underlyingPool?: string;
  simpleName?: string;
  simpleSymbol?: string;
  simpleIcon?: string;
  proName?: string;
  proSymbol?: string;
  proIcon?: string;
  farmName?: string;
  farmSymbol?: string;
  farmSimpleName?: string;
  farmSimpleSymbol?: string;
  farmSimpleIcon?: string;
  farmProName?: string;
  farmProSymbol?: string;
  farmProIcon?: string;
  assetRepresentation: string;
  isWhitelistedPro: boolean;
  isWhitelistedSimple: boolean;
  votable: boolean;
  isActive: boolean;
  isWhitelistedLimitOrder: boolean;
  accentColor?: string;
  totalPt?: number;
  totalSy?: number;
  totalLp?: number;
  totalActiveSupply?: number;
  liquidity?: PriceDetails;
  tradingVolume?: PriceDetails;
  underlyingInterestApy?: number;
  underlyingRewardApy?: number;
  underlyingRewardApyBreakdown?: ApyBreakdown[];
  underlyingApy?: number;
  impliedApy?: number;
  ytFloatingApy?: number;
  ptDiscount?: number;
  swapFeeApy?: number;
  pendleApy?: number;
  arbApy?: number;
  aggregatedApy?: number;
  maxBoostedApy?: number;
  lpRewardApy?: number;
  voterApy?: number;
  estimatedDailyPoolRewards?: DailyPoolReward[];
  dataUpdatedAt?: string;
  liquidityChange24h?: number;
  tradingVolumeChange24h?: number;
  underlyingInterestApyChange24h?: number;
  underlyingRewardApyChange24h?: number;
  underlyingApyChange24h?: number;
  impliedApyChange24h?: number;
  ytFloatingApyChange24h?: number;
  ge24h?: number;
  ptDiscountChange24h?: number;
  swapFeeApyChange24h?: number;
  pendleApyChange24h?: number;
  arbApyChange24h?: number;
  aggregatedApyChange24h?: number;
  maxBoostedApyChange24h?: number;
  lpRewardApyChange24h?: number;
  voterApyChange24h?: number;
  categoryIds: string[];
  timestamp: string;
  scalarRoot: number;
  initialAnchor: number;
}

export interface PendleDbData {
  id: number;
  chain_id: number;
  market_address: string;
  description: string | null;
  whitelisted: boolean;
  expiry: Date | null;
  pt: TokenDetails | null;
  yt: TokenDetails | null;
  sy: TokenDetails | null;
  lp: TokenDetails | null;
  underlying_asset: TokenDetails | null;
  accounting_asset: TokenDetails | null;
  trading_volume_usd: number | null;
  liquidity_usd: number | null;
  implied_apy: number | null;
  created_at: Date;
  updated_at: Date;
}
