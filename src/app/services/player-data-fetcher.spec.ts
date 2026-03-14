import { TestBed } from '@angular/core/testing';

import { PlayerDataFetcher } from './player-data-fetcher';

describe('PlayerDataFetcher', () => {
  let service: PlayerDataFetcher;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerDataFetcher);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
