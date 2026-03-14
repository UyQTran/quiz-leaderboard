import { Routes } from '@angular/router';
import { Leaderboard } from './components/leaderboard/leaderboard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: Leaderboard }
];
