# TerraPath — 3D Terrain Route & Construction Planner

An open-source geometry and route-planning lab by **Ankit Kumar Panda**. Explore shortest surface paths on a cone, compare routes across a terrain mesh, and estimate the material required for a uniform construction layer.

**MIT licensed · No API keys · No runtime dependencies · Desktop and mobile browsers**

## Run in two steps

1. Install Node.js 20 or newer if it is not already installed.
2. Extract this project, then double-click `start-windows.bat` on Windows. Open **http://127.0.0.1:8000**.

Or, from the extracted project folder on Windows, Linux or macOS:

```sh
node server.mjs
```

Leave the terminal running; press Ctrl+C to stop. No `npm install` is required. If port 8000 is occupied, choose another port, for example in PowerShell:

```powershell
$env:PORT = '8001'
node server.mjs
```

Opening `dist/index.html` directly as a file is unsupported because browsers restrict JavaScript module loading from file URLs. Use the local server.

## What works in v1

- **Cone lab:** editable radius, slant height, B's offset and angular separation; exact surface distance and uphill/downhill section lengths.
- **3D and unfolded views:** orbit, zoom, reset camera, visualize the highest point and the straight path in the cone sector.
- **Terrain planner:** synthetic central ridge, twin hills or flat plane; import a rectangular JSON height map.
- **Three route objectives:** shortest distance, reduced climbing, and lowest maximum grade.
- **Grade constraint:** remove edges exceeding an editable maximum absolute grade; explain when no route remains.
- **Endpoints:** enter grid coordinates or select the terrain Map view and click A, then B. Coordinate fields work with keyboard and touch.
- **Elevation profile and CSV export:** cumulative surface distance, x, y, elevation, all in metres.
- **Material estimate:** route length, strip width, layer depth, waste and editable INR material rate.
- **Local processing:** no accounts, analytics, external scripts or terrain uploads to a server.

Use arrow keys on the focused 3D canvas to orbit and + / − to zoom. Drag to orbit with a mouse or touch. Use the Map view to place terrain endpoints.

## The original cone question has missing information

A cone with radius 20 and slant height 60 unfolds into a sector of angle:

```text
2π × radius / slant = 2π/3 = 120°
```

Interpreting “B is 10 units from the base” as 10 units **along the generator** gives an apex-to-B distance of 50. The angular separation between A's generator and B's generator is still needed. Saying the track first rises and then descends only constrains this angle; it does not determine it.

For a concrete demonstration, TerraPath defaults to **opposite generators, θ = 180°**, so the unfolded endpoint separation is α = 60°. In that example:

```text
Total route = √(60² + 50² − 2 × 60 × 50 × cos 60°)
            = 10√31 ≈ 55.6776 m
Downhill    = 100/√31 ≈ 17.9605 m
Uphill      ≈ 37.7171 m
```

These are example values under the stated angle assumption, not a uniquely determined answer to the incomplete question. All cone dimensions in the app use metres.

### Geometry implementation

Let `L` be slant height, `R` base radius, `d` the offset along the generator, and `b = L − d`. Wrap the physical endpoint separation to the shorter angular separation `θ ∈ [−π, π]`. The unfolded angle is `α = θR/L`.

In the developed plane:

```text
A = (L, 0)
B = (b cos α, b sin α)
D = |B − A|
t = clamp(−A·(B − A) / D², 0, 1)
uphill = tD
downhill = (1 − t)D
```

The point nearest the sector origin has the greatest elevation. For each sampled point with plane polar coordinates `(ρ, β)`, map back to the cone using:

```text
x = (R/L)ρ cos(βL/R)
y = (R/L)ρ sin(βL/R)
z = √(L² − R²)(1 − ρ/L)
```

The total distance and turning point are analytic. The plotted curve is sampled for display and CSV export. Grade at a cone endpoint is derived from the radial component of its unit tangent; maximum absolute grade occurs at an endpoint of this straight developed path. A coincident start and end produces zero distance and zero grade.

### Terrain routing implementation

Each grid cell is divided using the same `(i,j)` to `(i+1,j+1)` diagonal that is drawn in the visualization. The graph uses six neighbouring vertices: north, south, east, west, northeast and southwest in local grid coordinates. Every route segment lies on an edge of the rendered triangle mesh.

For each directed edge:

```text
run = horizontal distance
rise = destination elevation − source elevation
length = √(run² + rise²)
grade = |rise| / run × 100
```

Edges above the maximum grade are excluded. A binary min-heap drives these searches:

| Objective | Minimized quantity |
|---|---|
| Shortest distance | Sum of 3D edge lengths |
| Reduce climbing | Sum of 3D lengths + 8 × total elevation gain |
| Lowest maximum grade | Largest absolute edge grade on the route |

The climbing multiplier 8 is a transparent heuristic, not a fuel or energy model. Change it in `dist/engine.js` to experiment. Minimax routing does not break equal-grade ties by distance, so its route can be longer. An empty feasible graph is reported instead of silently relaxing the constraint.

These routes are optimal for the chosen graph and objective. They approximate continuous-surface routing and depend on grid resolution and orientation. They are not GPS navigation routes.

### Construction model

```text
area = surface route length × width
net volume = area × layer depth
order volume = net volume × (1 + waste/100)
material cost = order volume × material rate per m³
```

This is a uniform thin-layer strip approximation measured on the surface. Defaults are editable example assumptions, not quoted market prices. It is not an excavation or roadworks quantity survey. It excludes cut/fill, compaction, labour, drainage, retaining structures, land and taxes. Vehicle dynamics, railway curve radius, braking and engineering standards are not modeled.

## Import your own height map

Select **Terrain planner → Import height map** and choose `examples/heightmap.json`, or supply:

```json
{
  "cellSize": 10,
  "heights": [
    [0, 0, 0],
    [0, 5, 0],
    [0, 0, 0]
  ]
}
```

Rows are local y, columns are local x, starting at 0. `cellSize` and elevations are metres. Grid dimensions must be 2–100 rows and 2–100 columns. All rows must have equal length. File size limit is 2 MB. Values must be finite numbers. Elevations must be within ±1,000,000 metres, and cell size must be greater than zero and at most 1,000,000 metres. Imported maps remain in the current browser tab's memory and are cleared on reload. Latitude/longitude, GeoTIFF and direct DEM providers are future work.

## Project structure — where to make changes

| File | Purpose |
|---|---|
| `dist/index.html` | App structure, input labels and educational explanation |
| `dist/style.css` | Colors, spacing, typography and mobile layout |
| `dist/app.js` | Input handling, Canvas 3D projection, SVG elevation profile, import/export |
| `dist/engine.js` | Pure geometry, terrain graph search and cost formulas |
| `dist/icon.svg` | Project icon |
| `server.mjs` | Small local HTTP server using Node's built-in modules |
| `start-windows.bat` | Windows launcher |
| `tests/engine.test.mjs` | Numerical and routing regression tests |
| `scripts/package.mjs` | Rebuild downloadable source ZIP without dependencies |
| `examples/heightmap.json` | Small custom-terrain example |
| `.github/workflows/test.yml` | Run tests on GitHub pushes and pull requests |

The browser implementation uses plain JavaScript ES modules, Canvas 2D for projected 3D rendering, and SVG for the profile. This keeps the first release easy to run without installing a Python or frontend dependency stack. Python/NumPy and GIS tools can be added for larger datasets later. There is no machine-learning model in this release.

## Test and package

```sh
node --test tests/engine.test.mjs
node scripts/package.mjs
```

Equivalent npm commands: `npm test` and `npm run package`. Tests cover analytic cone answers, same-generator and zero-length routes, angular wrapping, invalid inputs, flat terrain, infeasible grades, minimax routing, ascent penalties, mesh edges and material calculations.

## Use on your phone

The hosted app works in a mobile browser. To use the local copy over your home Wi-Fi, run this in PowerShell from the project folder:

```powershell
$env:HOST = '0.0.0.0'
node server.mjs
```

Find your computer's LAN IPv4 address with `ipconfig`, then open `http://YOUR-LAN-IP:8000` on a phone on the same Wi-Fi. If Windows asks, allow the server on your private network. This is a browser app, not an Android APK. The server is intended for local development.

## Publish as an open-source GitHub project

Suggested repository name: **terrapath-3d-route-planner**

Suggested description:

> Open-source 3D terrain route planner with cone geodesics, slope-constrained pathfinding, elevation profiles and construction material estimates.

Suggested topics: `terrain`, `pathfinding`, `geodesic`, `dijkstra`, `3d-visualization`, `construction`, `transportation`, `javascript`, `open-source`, `geometry`.

Create an empty **public** GitHub repository with that name. From the extracted project folder:

```sh
git init
git add .
git commit -m "Initial release: TerraPath geometry and terrain planner"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/terrapath-3d-route-planner.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your actual account. The MIT license is already included. No GitHub repository is created by extracting or running this package. To host publicly on a static host, run `node scripts/package.mjs` and publish the `dist` directory; no backend is required.

## Roadmap

- Georeferenced DEM / GeoTIFF import and map coordinates.
- Continuous mesh geodesics and adaptive resolution.
- Explicit turn-radius and rail/road alignment constraints.
- Calibrated energy models with declared vehicle parameters.
- Cut/fill estimation using proposed design elevations and cross sections.
- Route comparison overlays and reproducible project export.

Contributions are welcome; see [CONTRIBUTING.md](CONTRIBUTING.md). Please distinguish geometric experiments from validated engineering calculations.

## References

- [University of Cambridge Underground Mathematics — cone development](https://undergroundmathematics.org/circles/cones/appendix).
- [Cornell CS 2112 — Dijkstra's single-source shortest-path algorithm](https://www.cs.cornell.edu/courses/cs2112/2015fa/lectures/lecture.html?id=ssp).
- [NetworkX documentation — weighted shortest paths](https://networkx.org/documentation/stable/reference/algorithms/shortest_paths.html), for further exploration; NetworkX is not a dependency of this JavaScript release.

## License

[MIT](LICENSE). Copyright © 2026 Ankit Kumar Panda.
