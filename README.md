# Punny Place Planner Way

A mid-90s style browser game where you name streets so their intersections create silly / punny jokes.

**Live:** https://jmm5101.github.io/Punny-Place-Planner-Way/

## Version
**v5.1**

## Features

- Game title displayed as dual green street signs: **[Punny Place]** / **[Planner Way]**
- Version number shown in the header
- 16:9 map aspect ratio that scales cleanly to any screen
- Green grass + black asphalt roads with double yellow center lines
- Streets curve (except pure grid)
- Continuous streets share one name; the name appears as a small green street sign beside the roadway (never on a node)
- Nodes appear **only** at true intersections
- Cul-de-sacs are solid asphalt bulbs — **no islands**
- Click a street → name it + choose type (Alley/ALY … Way/WAY)
- Click a yellow intersection node → photo-style dual street-sign popup with reverse order
- Three levels:
  - **Level 1 – Cul-De-Sac**: Hierarchical sequential T-branching. Main Street has a single T-intersection with 1st Street (the only access point in/out of the entire neighborhood). Then:
    - 1st Street: T (Main) — T (2nd) — Cul-de-Sac
    - 2nd Street: T (1st) — T (3rd) — Cul-de-Sac
    - … continuing …
    - 8th Street: T (7th) — T (9th) — Cul-de-Sac
    - 9th Street: T (8th) — Cul-de-Sac
    
    All traffic from any street or cul-de-sac must ascend the hierarchy (9→8→…→1) to reach Main Street.
  - **Level 2 – Da Burbs**: Well-connected network with ~50 % of streets ending in cul-de-sacs.
  - **Level 3 – Lots & Blocks**: Clean rectangular grid (streets extend off the map). No cul-de-sacs.

## Deploy

Pages is set to **Deploy from a branch → main / (root)**.  
All future updates are pushed automatically; no manual GitHub steps required after the initial setup.
