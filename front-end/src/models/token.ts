import { Address } from 'viem';
export interface TokenInfo {
    id: number;
    name?: string;
    logo: string;
    decimal: number;
    chainDisplayName?: string;
    chainLogo: string;
    chainId: number;
    isNative: boolean;
    balance?: string;
    address?: Address;
    wrappedTokenAddress?: Address;
}
export interface Token {
    id: number;
    address?: string; // The address of the token contract.
    chain?: string; // The chain's name
    chain_logo_url?: URL; // URL of the chain's logo
    name?: string; // The token's name. null if not defined in the contract and not available from other sources.
    symbol?: string; // The token's symbol. null if not defined in the contract and not available from other sources.
    display_symbol?: null; // The token's displayed symbol. If two tokens have the same symbol, they are distinguished by display_symbol.
    optimized_symbol?: string; // For front-end display. optimized_symbol || display_symbol || symbol
    decimals: number; // The number of decimals of the token. null if not defined in the contract and not available from other sources.
    logo_url?: URL; // URL of the token's logo image. null if not available.
    protocol_id?: string; // token associated protocol's id. Empty string if not available.
    price: number; // USD price. Price of 0 means no data.
    time_at: number; // The timestamp when the current token was deployed on the blockchain.
    amount: number; // The amount of user's token.
}
