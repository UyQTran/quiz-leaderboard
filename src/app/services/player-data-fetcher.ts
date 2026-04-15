import { computed, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlayerDataFetcher {
  backendUrl = "http://localhost:8080/api/stream"

  constructor() {
    this.initPlayerData()()
  }
  initPlayerData() {
    return computed(() => {
      const eventSource = new EventSource(this.backendUrl);

      eventSource.onmessage = event => {
        console.log(event.data);
      };

      eventSource.onerror = error => {
        console.error(error)
      };

      return () => eventSource.close();
    });
  }
}
