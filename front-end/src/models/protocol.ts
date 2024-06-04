import { Address } from 'viem';
import { PortfolioItem } from './portfolio-item';

export interface ProtocolInfo {
    id: string; // The protocol's id.
    chainId: number; // The chain's id.
    name?: string; // The protocol's name. null if not defined in the contract and not available from other sources.
    displayName: string;
    logo_url?: string; // URL of the protocol's logo image. null if not available.
    site_url?: string; // prioritize websites that can be interacted with, not official websites.
    decimals: number;
    ui_pool_data_provider: string;
    pool_address_provider: string;
    chain_display_name: string;
    chain_logo: string;
}

export interface Protocol {
    id: string; // The protocol's id.
    chainId: number; // The chain's id.
    chainDisplayName: string;
    name?: string; // The protocol's name. null if not defined in the contract and not available from other sources.
    displayName: string;
    logo_url?: string; // URL of the protocol's logo image. null if not available.
    site_url?: string; // prioritize websites that can be interacted with, not official websites.
    portfolio_item_list: PortfolioItem[]; // Array of PortfolioItem
}

export interface UserReserveData {
    underlyingAsset: Address;
    scaledATokenBalance: BigInt;
    usageAsCollateralEnabledOnUser: Boolean;
    stableBorrowRate: BigInt;
    scaledVariableDebt: BigInt;
    principalStableDebt: BigInt;
    stableBorrowLastUpdateTimestamp: BigInt;
}
