<img src=https://forsider.solsort.com/icon.png width=96 height=96 align=right>

# Generiske forsider

Værktøj til generering af forsider til biblioteksmaterialer, samt upload af disse.

- Issue-tracking via <http://platform.dandigbib.org/projects/generiske-forsider>
- Kildekode ligger online på <https://github.com/solsort/forsider/>.
- En meget ufærdige demo-udgave af applikationen under udvikling, kan ses online på <https://forsider.solsort.com/>. Kun lavet så den virker i allernyeste udgave af Chrome, - da den i praksis køres some en NW.js applikation. Upload og gem er ikke mulig i webbrowser, men kun i den releasede applikation (eller hvis den startes med [NW.js](https://nwjs.io)).

# Roadmap

- Upload til forsideservice
    - Gennemløb af resultater + upload-mock
    - **Blokeret** Mangler adgang til moreinfoupdate.
- Komplet UI
    - Autogenerer forsider i preview
    - Autovælg forsidebillede baseret på søgeresultat
    - Visning af status for upload
    - UI til start af upload, upload, herunder start/slut-resultatside
    - Opdater UI, - de 10 søgeresultater ser rodede ud.
- Misc
    - **Blokeret** Korrekt søgebase. Mangler `client_id` / `client_secret` til app og/eller adgang til opensearch og moreinfo.
    - **Blokeret** Søgning på manifest-niveau, samt antal hits. Er vist ikke understøttet i den åbne platform, - så kan ikke udvikle dette uden adgang til opensearch/moreinfo.
    - **Blokeret** Søgning timer ud for sene søgeresultater, i.e. side 100.
    - Mål font-størrelse of skalér derefter
- Separate felter for titel/forfatter
- Gem/synkroniser info om uploadede billeder
    - Vil nok bruge PouchDB/CouchDB i stedet for filer, da det er en bedre måde at synkroniserer på.
- Dokumentation
    - Yderligere udvikler dokumentation for videreudvikling
    - Gennemgå og refaktorer hvor det giver mening


# Changelog
## Sprint 2 (in progress)

- visning af søgeresultater udover de første ti
- roadmap
- fremdrift på bladre i søgeresultater
- titler beskæres ikke midt i ord
- font-valg
- drop årstal i forfatternavn
- indstillinger knyttet til billede i stedet for globale 
- drop at skrive forfatter hvis mere end to
- søgning som ikke/lokalt bibliotek
- kodeoprydning (app-state, udtræk moduler til separate filer, webpack, etc.)
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
- `search.results` current search results
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
    - `resultScroll` - scroll position in result, useful to know if we should fetch more result.
    - `currentResult`
    - `previewHtml`
    - `previewUrl`
    - `searchError`
    - `searching`

# Noter

## misc

- Forsider uploades via <https://moreinfoupdate.addi.dk/1.0/>. Eksempel på brug af denne kan ses på <https://github.com/DBCDK/dbc-ufo/tree/master/src/services/moreinfoUpdate>
- Bygges som en [NW.js](https://nwjs.io) applikation, da direkte kommunikation med addi.dk-services ikke er mulig fra ren webapp.
- Gamle Backlog og sprint-status kan ses på <https://github.com/solsort/forsider/milestones/>.
- List fonts on windows: `powershell '[void] [System.Reflection.Assembly]::LoadWithPartialName(\"System.Drawing\") ; (New-Object System.Drawing.Text.InstalledFontCollection).Families'` (linux: `fc-list`)


