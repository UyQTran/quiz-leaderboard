import { Component, inject } from '@angular/core';
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
import { PlayerDataFetcher } from '../../services/player-data-fetcher';

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
  playerData = inject(PlayerDataFetcher);
  displayedColumns: string[] = ['name', 'points'];
  dataSource = [
    {name: 'Player 1', points: 100},
    {name: 'Player 2', points: 50},
    {name: 'Player 3', points: 40},
  ];
}
