# Angular + SSE Kurs

I dette GitHub repoet finner du en rekke oppgaver som tar deg gjennom grunnleggende 
ferdigheter i Angular og SSE på klientsiden. Hver oppgave har en egen start-branch, med navn start-X
og disse inneholder hovedsakelig endringer i mock-server.ts.
Det finnes i tilleg tilsvarende løsningsforslag med navn solution-X. Når du har løst en 
oppgave kan du sjekke ut start-branchen.

Start med å laste ned Node: https://nodejs.org/en

For å starte applikasjonen, trenger då bare å kjøre disse tre kommandoene

Laste ned biblioteker
```
npm install
```
Starte webapp
```
npm start
```
Starte mock-server. Denne må du kjøre på nytt mellom hver oppgave.
```
npm run mocks:start
```

## Rikas Rangering

Rika er leder i selskapet StepWeb og liker å holde fredagsquiz for sine ansatte. I fredagsquizene
får deltakerne poeng basert på hvor bra de var på å svare på quizen. Disse poengene blir summert i
den totale poengsummen som hver ansatt har fra tidligere fredagsquizer. Om de ansatte prøver å jukse
i fredagsquizene hennes, kan de få minuspoeng. Slik at totale poengsummen hver ansatt har kan gå både 
opp og ned. Hun trenger derfor et rangeringssystem slik at hun kan få oversikt over hvem som 
har mest total poengsum.

## Datamodell
I Rikas Rangering har vi allerede definert en del filer i prosjektet. Tar du en titt i models-mappen,
kan du se to model-filer player-data-model.ts og ranking-data-model.ts. En Ranking er data om en 
rangering med den totale poengsummen til en deltaker og spiller IDen. En Player er data om en spiller
og inneholder sin egen id og navnet på spilleren. Dette forholdet er alltid 1-1 så en Ranking tilhører
alltid en Player og en Player eier alltid en Ranking.

## Oppgave 1 - Dataintegrasjon

### Hente Data
For å hente data fra mock-serveren, bruker vi et klientbibliotek fra Microsoft.
Dette biblioteket tilbyr en funksjon med navn fetchEventSource som krever minst to parametere: en URL
til backend og callback funksjoner som skal kjøres når det skjer visse ting i funksjonen. I dette kurset
skal vi kun bry oss om i det tilfellet vi får en ny event-melding fra SSE strømmen vår.

Funksjonkallet ser noe som slik ut:
``` typescript
fetchEventSource(this.backendUrl, {
  onmessage(ev) {
    console.log('Just got data: ', ev)
  }
});
```
Her sender vi en URL til endepunktet til mock-server og at vi skal logge ut i konsollen når vi får en event-melding.

Legg denne kodesnutten inn data-fetcher.ts i initStream-funksjonen og se hva som skjer i konsollen til nettleseren!
Om du navigerer deg til Network tabben i nettlseren, refresher og filtrerer på "stream" kan du se selve HTTP-kallet
mot backend. Denne har ikke noe playload-tab som et tradisjonelt HTTP REST kall, men istedet har den en 
EventStream-tab. Det er nemlig her du kan se sanntidsdataene som blir sendt fra backend. På grunn av HTTP begrensninger,
er det lurt å utnytte samme SSE strøm til forskjellig type data. Det er derfor det er en mulighet for å sette Type
som metadata i strømmen slik at frontend kun trenger å lytte til én strøm og reagere forskjellig utifra hva slags type
data den får inn.

### Singals
Nå som vi kan få strømmen sanntidsdata mellom backend og frontend, kan vi videre strømme dataene videre til
presentasjonslaget. Angular tilbyr lagring av data asynkront med Singals. Disse er data som kan endres og lyttes på.

Her er et eksempel for å opprette en WritableSignal for PlayerDataModel i data-fetcher.ts
``` typescript
playerBuffer: WritableSignal<PlayerDataModel>
constructor() {
  this.playerBuffer = signal({playerList: []})
}
```
Her må vi declarere variablen først med Typescript slik at Angular skjønner at signal-pekeren skal være
av typen leselig eller skrivbar signal. Gjør det samme for RankingDataModel.

Om du vil sette verdier i signal-objektene kan det gjøres slik
``` typescript
this.playerBuffer.set(playerData);
```

Du kan teste om setting av data i signal-variablen fungerer ved å legge følgende inn rett etter at du setter
dataene
``` typescript
console.log(this.playerBuffer());
```

Fordi fetchEventSource har et eget scope, blir vi nødt til å definere funksjoner i initStream som håndterer
strømdataene våre. Definer derfor noen funksjoner som tar imot XXXDataModel som parameter og setter disse inn
i signal-objektene. Så kan vi lage en enkel switch-case for å håndtere hver type data som kommer inn i strømmen
ved å bruke `ev.event` som switch. Casene blir da "Player" og "Ranking".

Nå har vi definert en Angular-service som henter data fra backend. Disse kan nå hentes av
Angular-komponent. I leaderboard.ts kan vi injisere data-fetcher-servicen vår ved å legge til følgende i klassen
``` typescript
dataFetcher = inject(DataFetcher);
```

Rikas Rangering bruker Material som designsystem og i dette tilfellet ser vi at tabellen i leaderboard-komponenten 
krever data i følgende format
``` typescript
{
  name: string
  points: number
}
```

Vi må derfor samle dataene fra begge signal-variablene våre slik at vi får en liste som følger dette formatet. Her
kan vi bruke en Angular-funksjon som heter `computed`. Funksjonen `computed` tar imot en funksjon kan lytte på ulike
signal-variabler og utføre handlinger på disse. Til slutt kan funksjonen vi sender inn i `computed` returnere verider 
basert signal-variabler den lytter som gjør at `computed` returnerer en strøm av verdiene. Strømmen til `computed` blir
oppdatert og får en ny verdi hver gang en av signal-variablene får en ny verdi.

Lag et `computed` kall for `dataSource` variablen i leaderboard.ts og lytt på `dataFetcher.playerBuffer()` og 
`dataFetcher.rankingBuffer()` slik at tabellen får dataene i riktig format. Her kreves det at du mapper over den ene eller
den andre strømmen for å kunne slå sammen dataene og slik at du får dataene i det formatet beskrevet over. Du må derfor 
slå opp og nullhåndtere for de ulike strømmene. Etter at du har laget `computed` kall, må du nå kalle på `dataSource()`
med paranteser i `leaderboard.html` for å tilføre dataene til tabellen fordi `dataSource()` er nå en strøm av data.

Til slutt kan du sortere elementene i tabellisten etter poengsum. Etter dette skal tabellen i webappen være oppdatert 
med data fra backend.

## Oppgave 2 - Oppdatere Data
Plottwist: De ansatte i StepWeb er egentlig AI-agenter som lever inne i en datamaskin. Eierne ønsker nå å øke hastigheten
til datamaskinen med x604,800 for å øke effektiviteten. Dette betyr at hver uke for en StepWeb ansatt er like mye som ett 
sekund for oss utenfor datamaskinen. Med andre ord så skjer fredagsquiz nå hvert sekund. Vi må nå skrive logikk som
håndterer hyppige oppdateringer av data i Rika Rangering.

Du kan nå sjekke ut `start-2` branchen og starte mock-serveren på nytt. 

Om du sjekker EventStream, kan du se nye resultater for fredagsquiz komme inn hvert sekund. Men som du også kan se så vil 
ikke dataene i tabellen oppdatere seg rikitg og vi vil se mye 0 poeng fordi vi ikke beholder de gamle dataene når vi får
inn nye.

I mapRankingData-funksjonen i data-fetcher.ts kan du nå lage en reduce funksjon som løkker gjennom hver nytt Ranking-element
og sjekker om Ranking-elementet finnes fra før eller ikke basert på IDen. Om Ranking-elementet ikke finnes fra før, kan du
pushe det nye elemetet inn i den gamle listen. Om Ranking-elementet finnes fra før av, kan du overskrive poengsummen til det
eksisterende Ranking-elementet. 

Etter dette skal dataene oppdatere seg i tabellen uten å overskrive de gamle dataene.

## Oppgave 3 - Medaljer
Rika ønsker å belønne de flinkeste quizdeltakerne ved å markere dem med ulike medaljer i Rikas Rangering. Kravene hennes er
som følge: de tre beste får gullmedalje, alle som har over 100 poeng får sølvmedalje og alle over 30 poeng får bronsemedalje.
Alle skal kun vise den beste medaljen de har til en enhver tid.

Du kan nå sjekke ut start-3 branchen og starte mock-serveren på nytt.

Fra backend får du nå en ny type strøm, Tier, med følgende format. Du kan også ta en titt i EventStream for å se de faktiske 
dataene.
``` typescript
{
  tierList: [
    {
      tierId: string,
      tierName: string,
      tierThreshold: {
        minimumPoints?: number
        topRankings?: number
      }
    }
  ]
}
```

Lag en ny Typescript-model tilsvarende de andre modellene. Så kan du legge til den nye strømmen i data-fetcher.ts. Det er ikke
noe spesiell logikk som kreves her.

Når du har lagret disse dataene, kan du oppdatere leaderboard-komponenten med en ny kolonne. Dette gjør du både i 
`displayedColumns` variabelen.

I HTML-filen til leaderboard, må du også legge til en ny kolonne. Dette kan gjøre på flere måter. Her er et eksempel med ikon
fra Material
```
@let tier = element.tier;
<mat-icon
  aria-hidden="false"
  aria-label="Tier"
  fontIcon="stars"
  [class.gold-tier]="tier === 'gold'"
  [class.silver-tier]="tier === 'silver'"
  [class.bronze-tier]="tier === 'bronze'"
  [class.no-tier]="tier === 'none'"
></mat-icon>
```
Linjen med @let er en Javascript linje som akspeterer både funksjoner og uttrykk. Når du definerer et HTML attributt i enten
parantes eller klammeparantes blir dette også oversatt av Angular som Javascript. I dette tilfellet toggler vi av eller på
CSS klasser basert på bolske uttrykk.

Til slutt må du utvide `computed`-signalet ved å kombinere den eksisterende koden med data fra `tierBuffer`. Dette må gjøres
etter sorteringen med en ny `map` slik at graderingen for gullmedaljen blir riktig. Legg så inn sølv og bronsemedaljene i 
riktige tabellradelementer.
