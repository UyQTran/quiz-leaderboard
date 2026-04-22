import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class DataFetcher {
  backendUrl = "http://localhost:8080/api/stream"

  constructor() {
    this.initStream()
  }
  initStream() {
  }
}
