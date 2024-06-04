import { PortfolioStats } from './portfolio-stats';
import { PortfolioDetail } from './portfolio-detail';
import { Token } from './token';

// See below doc for more details:
// https://docs.cloud.debank.com/en/readme/api-models/portfolioitemobject
export interface PortfolioItem {
    stats: PortfolioStats; // PortfolioStat object that shows total values in USD
    name: string; // See PortfolioItemObject.name in this doc for available options
    detail_types: string[]; // See this doc for available options
    detail: PortfolioDetail; // PortfolioDetail object
}
