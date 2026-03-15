export type TierId = string;
export type TierName = string;

export interface TierDataModel {
  tierList: Tier[]
}

export interface Tier {
  tierId: TierId;
  tierName: TierName;
  tierThreshold: TierThreshold;
}

export interface TierThreshold {
  topRankings?: number;
  minimumPoints?: number;
}
