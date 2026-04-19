import { Component, computed, inject } from '@angular/core'
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
} from '@angular/material/table'
import { DataFetcher } from '../../services/data-fetcher'
import { MatIconModule } from '@angular/material/icon';

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
    MatIconModule,
  ],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.scss',
})
export class Leaderboard {
  playerData = inject(DataFetcher);
  displayedColumns: string[] = ['name', 'points', 'tier'];
  dataSource = computed(() => {
    return this.playerData
      .playerBuffer()
      .playerList.map((player) => {
        const ranking = this.playerData
          .rankingBuffer()
          .rankingList.find((ranking) => ranking.playerId === player.playerId);
        if (!ranking) {
          return { name: player.playerName, points: 0 };
        }
        return { name: player.playerName, points: ranking.points };
      })
      .sort((a, b) => b.points - a.points)
      .map((row, index) => {
        let rowTier = 'none'
        this.playerData.tierBuffer().tierList.forEach((tier) => {
          const minimumPoints = tier.tierThreshold.minimumPoints
          if (minimumPoints && minimumPoints <= row.points)
            rowTier = tier.tierName

          const topRankings = tier.tierThreshold.topRankings
          if (topRankings && topRankings > index)
            rowTier = tier.tierName
        })
        return {...row, tier: rowTier}
      });
  });
}
