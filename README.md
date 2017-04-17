<img src=https://forsider.solsort.com/icon.png width=96 height=96 align=right>

# Generering af forsider

Værktøj til generering af forsider til biblioteksmaterialer, samt upload af disse.

- Issue-tracking via <http://platform.dandigbib.org/projects/generiske-forsider>
- Kildekode ligger online på <https://github.com/solsort/forsider/>.
- En meget ufærdige demo-udgave af applikationen under udvikling, kan ses online på <https://forsider.solsort.com/>. Kun lavet så den virker i allernyeste udgave af Chrome, - da den i praksis køres some en NW.js applikation. Upload og gem er ikke mulig i webbrowser, men kun i den releasede applikation (eller hvis den startes med [NW.js](https://nwjs.io)).

# Changelog
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
- `results[][10]` search results, paged in sets of 10.
- `options[image-id]`
    - `background` - `{r,g,b,a}`
    - `font`
    - `fontScale`
    - `maxLen`
    - `yPos` 0-100
- `currentImage`
- `query` search query which yields results
- `ui`
    - `backgroundDialog` true/false
    - `currentResult`
    - `previewHtml`
    - `previewUrl`
    - `searchError`
    - `searching`

# Noter

## møde agenda


- demo / status, og retrospektive.  Jeg har kodet derudaf, og den første ufærdige udgave af applikationen er oppe at køre.
- udformning af tasks/issues / "backlog grooming".  Jeg foreslår at vi sætter os ned, og får lavet overblik over tasks til backloggen.  Det er lettere at danne nu, da vi har applikationen.  I først omgang kan vi lave dem på papir - og så kan vi lægge dem indi issue-trackeren senere, når vi får ordenlig adgang dertil.
- + brainstorm - ønskede indstillinger ved placering af titel/forfatter
- sprint-planlægning.  Vi må få prioriteret rækkefølgen af tasks, hvilket også giver et estimat af hvad vi kan nå i løbet af næste sprint.
- praktisk (status på adgang til den moreinfoupdate, kontrakt-underskrivelse, faktura for første sprint, status på platform.dandigbib.dk, etc.)
- diverse (ikke projekt-relateret er jeg bland andet nysgerrig om i hørt noget om den nye DDB mobilapp...)


## misc

- Forsider uploades via <https://moreinfoupdate.addi.dk/1.0/>. Eksempel på brug af denne kan ses på <https://github.com/DBCDK/dbc-ufo/tree/master/src/services/moreinfoUpdate>
- Bygges som en [NW.js](https://nwjs.io) applikation, da direkte kommunikation med addi.dk-services ikke er mulig fra ren webapp.
- Gamle Backlog og sprint-status kan ses på <https://github.com/solsort/forsider/milestones/>.
- List fonts on windows: `powershell '[void] [System.Reflection.Assembly]::LoadWithPartialName(\"System.Drawing\") ; (New-Object System.Drawing.Text.InstalledFontCollection).Families'` (linux: `fc-list`)


