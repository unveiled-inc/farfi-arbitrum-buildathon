import { Address } from 'viem';

export interface ReserveData {
    underlyingAsset: Address;
    name: string;
    symbol: string;
    decimals: bigint;
    liquidityIndex: bigint;
}
