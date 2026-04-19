import { Component, computed, inject } from '@angular/core';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import { DataFetcher } from '../../services/data-fetcher';

@Component({
  selector: 'app-leaderboard',
  imports: [
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatColumnDef,
    MatTable,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderRow,
    MatRow,
  ],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.scss',
})
export class Leaderboard {
  playerData = inject(DataFetcher);
  displayedColumns: string[] = ['name', 'points'];
  dataSource = computed(() => {
    console.log(this.playerData.playerDataBuffer().playerList)
    console.log(this.playerData.rankingDataBuffer().rankingList)
    return this.playerData.playerDataBuffer().playerList.map((player) => {
      const ranking = this.playerData.rankingDataBuffer().rankingList.find((ranking) => ranking.playerId === player.playerId)
      if (!ranking) {
        return {name: player.playerName, points: 0}
      }
      return {name: player.playerName, points: ranking.points}
    })
  })
}
