export interface EncodeParams {
    recipeId: number;
    chain: string;
    address: string;
    amount: string;
}
export interface TokenChange {
    name?: string;
    network?: string;
    logo: string;
    decimal: number;
    balanceDiffer?: string;
}
export interface PositionChange {
    name: string;
    network: string;
    logo: string;
    healthFactorBefore?: string;
    healthFactorAfter?: string;
    supply?: TokenChange[];
    borrow?: TokenChange[];
}

export interface ChangesType {
    tokenChanges?: TokenChange[];
    positionChanges?: PositionChange[];
}
