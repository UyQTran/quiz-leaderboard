import { Injectable, signal, WritableSignal } from '@angular/core';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { PlayerDataModel } from '../models/player-data-model';
import { RankingDataModel } from '../models/ranking-data-model';


@Injectable({
  providedIn: 'root',
})
export class DataFetcher {
  backendUrl = "http://localhost:8080/api/stream"
  playerBuffer: WritableSignal<PlayerDataModel>
  rankingBuffer: WritableSignal<RankingDataModel>

  constructor() {
    this.playerBuffer = signal({playerList: []})
    this.rankingBuffer = signal({rankingList: []})
    this.initStream()
  }
  initStream() {
    const mapPlayerData = (playerData: PlayerDataModel) => {
      this.playerBuffer.set(playerData);
    }
    const mapRankingData = (rankingData: RankingDataModel) => {
      this.rankingBuffer.set(rankingData);
    }
    fetchEventSource(this.backendUrl, {
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
  }
}
