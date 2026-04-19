import { computed, Injectable, signal, WritableSignal } from '@angular/core';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { PlayerDataModel } from '../models/player-data-model';
import { RankingDataModel } from '../models/ranking-data-model';


@Injectable({
  providedIn: 'root',
})
export class DataFetcher {
  backendUrl = "http://localhost:8080/api/stream"
  playerDataBuffer: WritableSignal<PlayerDataModel>
  rankingDataBuffer: WritableSignal<RankingDataModel>

  constructor() {
    this.playerDataBuffer = signal({playerList: []})
    this.rankingDataBuffer = signal({rankingList: []})
    this.initStream()()
  }
  initStream() {
    const mapPlayerData = (playerData: PlayerDataModel) => {
      this.playerDataBuffer.set(playerData);
    }
    const mapRankingData = (rankingData: RankingDataModel) => {
      this.rankingDataBuffer.set(rankingData);
      console.log(rankingData)
    }
    return computed(() => {
      return fetchEventSource(this.backendUrl, {
        onmessage(ev) {
          switch (ev.event) {
            case 'Player':
              mapPlayerData(JSON.parse(ev.data))
              break;
            case 'Ranking':
              mapRankingData(JSON.parse(ev.data))
              break;
          }
        }
      });
    });
  }
}
