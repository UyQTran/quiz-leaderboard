import { TestBed } from '@angular/core/testing';

import { RankingDataFetcher } from './ranking-data-fetcher';

describe('RankingData', () => {
  let service: RankingDataFetcher;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RankingDataFetcher);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
