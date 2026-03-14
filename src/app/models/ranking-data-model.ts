import { PlayerId } from './player-data-model';

export type RankingId = string;
export type Points = number;
export type Placement = number;

export interface RankingDataModel {
  rankingList: Ranking[]
}

export interface Ranking {
  rankingId: RankingId;
  playerId: PlayerId;
  points: Points;
  placement: Placement;
}
