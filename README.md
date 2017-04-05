<img src=https://forsider.solsort.com/icon.png width=96 height=96 align=right>

# Generering af forsider

Værktøj til generering af forsider til biblioteksmaterialer, samt upload af disse.

- Issue-tracking via <http://platform.dandigbib.org/projects/generiske-forsider>
- Kildekode ligger online på <https://github.com/solsort/forsider/>.
- En meget ufærdige demo-udgave af applikationen under udvikling, kan ses online på <https://forsider.solsort.com/>. Upload og gem virker ikke der, men kun i den releasede applikation (eller hvis den startes med [NW.js](https://nwjs.io)).

# TODO Midlertidig task-liste 

Indtil vi får fuld adgang til redmine er her midlertidig taskliste:

- omform rendering fra inline canvas, til async funktion der returnerer billede
- døde link til nuværende forsider i nodewebkit (billed url er `//moreinfo...` og protokol er `file://..`
- forfatter i visningen
- bekræft om ny wireframe er ok, og slet i så fald gammel
- rendering af preview i søgeresultater
- visning af søgeresultater udover de første ti
- find/autocomplete på installerede fonte i stedet for predefineret liste
- mulighed for at fjerne uploaded billeder
- font-indstillinger knyttet til det valgte billede, i stedet for at være globale
- eksempel-upload til moreinfo-update
- adgang til moreinfo-update
- mål font-størrelse og skalér derefter
- EPIC: konfiguration af rendering (herunder afklaring)
- EPIC: upload til moreinfo-update
- EPIC: gem data til disk? pouchdb med sync?

# Changelog

## Sprint 1

- Første ufærdige udgave af app
  - CQL-søgning mod openplatform + visning af resultater
  - "Upload" af billeder
  - Simple konfiguration af hvorledes metadata skal renderes
  - Rendering af metadate ovenpå billede
  - Opdateret wireframe/design
- Indpakning som windows-applikation


# Noter

- Forsider uploades via <https://moreinfoupdate.addi.dk/1.0/>. Eksempel på brug af denne kan ses på <https://github.com/DBCDK/dbc-ufo/tree/master/src/services/moreinfoUpdate>
- Bygges som en [NW.js](https://nwjs.io) applikation, da direkte kommunikation med addi.dk-services ikke er mulig fra ren webapp.
- Gamle Backlog og sprint-status kan ses på <https://github.com/solsort/forsider/milestones/>.
- List fonts on windows: `powershell '[void] [System.Reflection.Assembly]::LoadWithPartialName(\"System.Drawing\") ; (New-Object System.Drawing.Text.InstalledFontCollection).Families'` (linux: `fc-list`)


