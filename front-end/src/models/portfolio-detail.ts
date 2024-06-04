import { Token } from './token';
export interface PortfolioDetail {
    supply_token_list: Token[]; // Array of Asset object
    reward_token_list: Token[]; // Array of Asset object
    borrow_token_list: Token[]; // Array of Asset object
}
