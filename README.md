<img src=https://forsider.solsort.com/icon.png width=96 height=96 align=right>

# Generiske forsider

Værktøj til generering af forsider til biblioteksmaterialer, samt upload af disse.

- Issue-tracking via <http://platform.dandigbib.org/projects/generiske-forsider>
- Kildekode ligger online på <https://github.com/solsort/forsider/>.
- En meget ufærdige demo-udgave af applikationen under udvikling, kan ses online på <https://forsider.solsort.com/>. Kun lavet så den virker i allernyeste udgave af Chrome, - da den i praksis køres some en NW.js applikation. Upload og gem er ikke mulig i webbrowser, men kun i den releasede applikation (eller hvis den startes med [NW.js](https://nwjs.io)).

# Changelog

Status for sprint 3, og senere, kan ses i roadmap i issue-trackeren: http://platform.dandigbib.org/projects/generiske-forsider/roadmap

## Sprint 2

- visning af søgeresultater udover de første ti
- opdater UI for upload.
- roadmap
- titler beskæres ikke midt i ord
- font-valg
- drop årstal i forfatternavn
- indstillinger knyttet til billede i stedet for globale 
- drop at skrive forfatter hvis mere end to
- søgning som ikke/lokalt bibliotek
- kodeoprydning (app-state, udtræk moduler til separate filer, webpack, prettier code, etc.)
- mulighed for at slette billeder
- html2canvas billedgenerering
- preview-størrelse matcher størrelse på hjemmeside

## Sprint 1

- Første ufærdige udgave af app
  - CQL-søgning mod openplatform 
    - Visning af første 10 søgeresultater 
    - valg af søgeresultat for forside-rendering
  - "Upload" af billeder, og valg af nuværende billede til forsidegenerering
  - Konfiguration af rendering
    - baggrundsfarve, inklusiv transparens
    - font-skala
    - afstand fra toppen
    - maksimal tekstlængde
    - default-titel
    - fontvalg, med completion på et par predefinerede fonte
  - rendering af forside
    - kombinerer baggrundsbillede og titel+forfatter
    - live opdatering ved ændring af konfigurationen
    - renderes til billede/canvas via "html", hvilket giver styling/design-fleksibilitet
  - non-funktionelt ui til download / upload
  - Simple konfiguration af hvorledes metadata skal renderes
  - Rendering af metadate ovenpå billede ()
  - Opdateret wireframe/design
  - Både implementeret oprindelig wireframe, samt forslag til forbedringer.
- Infrastruktur
  - Bygge-script/indpakning som windows-applikation, lægges online på <https://public-html.solsort.com/generiske-forsider-win32.zip>
  - Deployment af demo til <https://forsider.solsort.com>
  - Github-repositorie, README, package.json med bygge-setup etc.
  - Ikon
  - Applikationsvalg: React-app, Material Design

# Application state

Overblik over applikationstilstanden

- `images[]`
    - `id` - id for image (120bit cryptograph hash of data url, - thus collision free with very high probability)
    - `name` - original file name
    - `url` - data url containing the image
- `search` 
    - `results`
    - `query`
    - `searching`
    - `error`
    - `page`
- `options[image-id]`
    - `background` - `{r,g,b,a}`
    - `font`
    - `fontScale`
    - `maxLen`
    - `yPos` 0-100
- `download`
    - `overwrite`
    - `overwriteOwn`
    - `singlePage`
    - `downloading`
    - `dirname`
- `currentImage`
- `query` search query which yields results
- `ui`
    - `currentResult`
    - `previewHtml`
    - `previewUrl`

