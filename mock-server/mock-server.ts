import express, {Request, Response} from 'express';
import cors from 'cors';
import playerDataFixture from './fixtures/mock-player-data.json';
import rankingDataFixture from './fixtures/mock-ranking-data.json';
import tierDataFixture from './fixtures/mock-tier-data.json';
import { PlayerDataModel } from '../src/app/models/player-data-model';
import { RankingDataModel } from '../src/app/models/ranking-data-model';
import { TierDataModel } from './tier-data-model';

const mockPlayerData = playerDataFixture as PlayerDataModel;
const mockRankingData = rankingDataFixture as RankingDataModel;
const mockTierData = tierDataFixture as TierDataModel;

type DataModel =
  PlayerDataModel |
  RankingDataModel |
  TierDataModel;

const mockServer = express();

mockServer.use(cors());
mockServer.use(express.json());

function createSseEmitter(res: Response): (event: DataModel, eventType: string) => void {
  return function emit(event: DataModel, eventType: string): void {
    res.write(`event: ${eventType}\ndata: ${JSON.stringify(event)}`);
    res.write(`\n\n`);
  };
}

function setupSseHeaders(res: Response): void {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });
  res.write('retry: 10000\n\n');
}

mockServer.get('/api/stream', (req: Request, res: Response): void => {
  setupSseHeaders(res);
  const emit = createSseEmitter(res);
  emit(mockPlayerData, 'Player');
  emit(mockRankingData, 'Ranking');
  emit(mockTierData, 'Tier');
});

const mockServerPort = 8080;

mockServer.listen(mockServerPort, '0.0.0.0', () => {
  console.log(`Mock Server is listening on port ${mockServerPort}`);
});
