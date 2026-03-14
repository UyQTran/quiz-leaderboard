export type PlayerId = string;
export type PlayerName = string;

export interface PlayerDataModel {
  playerList: Player[];
}

export interface Player {
  playerId: PlayerId;
  playerName: PlayerName;
}
