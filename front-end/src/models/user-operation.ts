import { Hex } from 'viem';
export interface UserOperationType {
    target?: string;
    value?: bigint;
    data?: Hex;
}
