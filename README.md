# Punny Place Planner Way

A mid-90s pixel-style browser game where you name streets so their intersections create silly / punny jokes.

**Live (after enabling Pages):** https://jmm5101.github.io/Punny-Place-Planner-Way/

## Features (v1.1)

- **Green grass background** + **black asphalt streets** with **double yellow center lines**
- Streets can **curve** (except pure grid)
- **Continuous streets** share one name – name once, it appears along the whole road
- Street names display on the map after naming
- Click any street → name it + choose type from the full list (Alley/ALY … Way/WAY)
- Click an **intersection node** → photo-style dual street-sign popup (green blades on gray pole against blue sky)
- **↔ Reverse** button to swap which name is on top
- **Cul-de-sacs** are bulbous, have **no nodes**, and never show street signs
- Three levels:
  - **Level 1 – Federated Tree**: hierarchical branching, each segment depends on the previous, ends in cul-de-sacs
  - **Level 2 – Suburban**: ~30 nodes, many curved streets and bulbous cul-de-sacs
  - **Level 3 – Urban Grid**: clean 10×10 grid (100 nodes), straight streets

## How to run / deploy

1. Open `index.html` in any modern browser, **or**
2. Push to GitHub and enable **Pages**:
   - Repo → **Settings** → **Pages**
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
   - Save → wait ~1 minute → site is live

## Font

Uses **Overpass** (Google Fonts).

## Controls

- Click black road → name the continuous street
- Click yellow intersection circle → view / reverse the street-sign graphic
- Switch levels with the top tabs
