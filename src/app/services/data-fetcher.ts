import { computed, effect, Injectable, signal, WritableSignal } from '@angular/core';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { PlayerDataModel } from '../models/player-data-model';
import { RankingDataModel } from '../models/ranking-data-model';
import { TierDataModel } from '../models/tier-data-model';


@Injectable({
  providedIn: 'root',
})
export class DataFetcher {
  backendUrl = "http://localhost:8080/api/stream"
  playerBuffer: WritableSignal<PlayerDataModel>
  rankingBuffer: WritableSignal<RankingDataModel>
  tierBuffer: WritableSignal<TierDataModel>

  constructor() {
    this.playerBuffer = signal({playerList: []})
    this.rankingBuffer = signal({rankingList: []})
    this.tierBuffer = signal({tierList: []})
    this.initStream()
  }
  initStream() {
    const mapPlayerData = (playerData: PlayerDataModel) => {
      this.playerBuffer.set(playerData);
    }
    const mapRankingData = (rankingData: RankingDataModel) => {
      const updatedRankingBuffer = rankingData.rankingList
        .reduce((acc, ranking) => {
          const existingRankingIndex = acc.findIndex((accRanking) => accRanking.rankingId === ranking.rankingId)
          if (existingRankingIndex >= 0)
            acc[existingRankingIndex] = ranking
          else acc.push(ranking)
          return acc
        }, this.rankingBuffer().rankingList)
      this.rankingBuffer.set({rankingList: updatedRankingBuffer});
    }
    const mapTierData = (tierData: TierDataModel) => {
      this.tierBuffer.set(tierData);
    }
    effect(() => {
      return fetchEventSource(this.backendUrl, {
        onmessage(ev) {
          switch (ev.event) {
            case 'Player':
              mapPlayerData(JSON.parse(ev.data))
              break;
            case 'Ranking':
              mapRankingData(JSON.parse(ev.data))
              break;
            case 'Tier':
              mapTierData(JSON.parse(ev.data))
              break;
          }
        }
      });
    });
  }
}
