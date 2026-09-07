[README.md](https://github.com/user-attachments/files/31913904/README.md)
# TerraPath — 3D Terrain Route & Construction Planner

An open-source geometry and route-planning lab by **Ankit Kumar Panda**. Explore shortest surface paths on a cone, compare routes across a terrain mesh, and estimate the material required for a uniform construction layer.

**MIT licensed · No API keys · No runtime dependencies · Desktop and mobile browsers**

## Why TerraPath is needed

When two locations sit on uneven ground, their distance on a flat map does not describe the whole journey. A short route may cross a steep ridge; a longer route may avoid part of the climb. For construction, a change in route length also changes the quantity of material needed for a surface layer.

TerraPath makes these relationships visible. It helps you answer practical early-stage questions:

- How far would a route travel along the modeled surface?
- How much of that route goes uphill or downhill?
- What changes if I prioritize distance, reduce climbing, or minimize the steepest section?
- Does any route on this grid meet my chosen gradient limit?
- How much material would a uniform layer along a candidate route require?

Its value is in **learning, comparing preliminary options, and explaining a decision**. You can see the route, inspect its elevation profile, change the assumptions, and export the coordinates for further work. The source is available so students and developers can inspect the mathematics and extend the model.

**Version 1 is an exploratory planning tool.** Its outputs describe the supplied surface and the implemented route objective. A route that satisfies the app's grade limit still needs checks for the actual site, intended users or vehicles, obstacles, and construction requirements.

## Who should use it, and where?

| User | Practical setting | What to use in TerraPath | Useful result |
|---|---|---|---|
| Mathematics teachers and students | Classroom demonstrations, geometry assignments, science exhibitions | Cone lab, angular separation control, unfolded view | Explain why a straight line on an unfolded cone becomes a curved surface route, and locate the uphill/downhill transition. |
| Civil engineering students | Coursework on hillside paths, campus access, or preliminary alignments | Terrain planner, height-map import, elevation profile | Compare candidate routes and explain distance-versus-gradient trade-offs in a project report. |
| Transportation researchers and student teams | Small terrain-routing experiments | Route objectives, grade limit, CSV export | Study how the selected objective changes distance, climbing, and maximum edge grade. |
| Landscape and site-planning teams | Initial discussions about a garden, park, campus, or hillside walking path | Imported terrain, endpoint selection, shortest-distance and lowest-maximum-grade modes | Identify candidate surface routes worth investigating on site. Accessibility and detailed path design require additional checks. |
| Construction estimators and small project teams | A preliminary material budget for a proposed path or surface strip | Route length, width, layer depth, waste, and material rate | Calculate an assumption-based material quantity and compare the material component of alternative routes. |
| Developers and open-source contributors | Portfolio projects, algorithm lessons, GIS prototypes | Pure functions in `dist/engine.js`, sample data, numerical tests | Build on a working geometry and pathfinding implementation with visible inputs and outputs. |

These are intended applications of the prototype, not claims of completed field deployments or validated engineering use.

## Which mode should I choose?

| Your question | Choose | How to interpret the answer |
|---|---|---|
| “How does the shortest route behave on a cone?” | **Cone lab** | An exact geodesic for the ideal cone dimensions and endpoint positions you provide. |
| “Which route covers the least distance on this terrain grid?” | **Terrain planner → Shortest distance** | The minimum total 3D length along permitted mesh edges. |
| “Can I trade some distance for less climbing?” | **Terrain planner → Reduce climbing** | A compromise that minimizes distance + 8 × elevation gain. It does not guarantee the least possible ascent or calculate fuel consumption. |
| “Which route has the gentlest worst section?” | **Terrain planner → Lowest maximum grade** | The smallest achievable maximum edge grade. Equal-grade routes are not ranked by distance, so inspect the resulting length and shape. |
| “Can the modeled route stay below a limit I specify?” | Set **Maximum permitted grade** | Every retained edge must meet that absolute uphill/downhill grade limit. The app does not select a suitable limit for a vehicle or certify a route. |
| “How much surface material might this candidate need?” | **Material estimate** | A uniform-layer quantity and material-only cost based on your editable assumptions. |

## Practical walkthrough: compare paths across a hillside

**Example situation:** a team is considering a path between an entrance and a storage area on uneven ground. Before detailed design, they want to understand whether a shorter route involves more climbing and how route length affects a preliminary material budget.

1. **Start with a model.** Open **Terrain planner** and choose **Central ridge** to learn the workflow. For a particular site, import a prepared height map representing that site. Synthetic terrain is a demonstration, not a measurement of the property.
2. **Place the endpoints.** Switch to **Map** and click the entrance as A, then the storage area as B. You can also enter their grid column and row. These are local grid positions, not street addresses or GPS coordinates.
3. **Calculate a distance baseline.** Choose **Shortest distance**. Record surface distance, elevation gain, uphill/downhill lengths, and maximum grade. Remember that the current grade limit already constrains this search.
4. **Compare another objective.** Keep the terrain, endpoints, and grade limit unchanged; select **Reduce climbing**, then **Lowest maximum grade**. Record each result separately. The interface shows one route at a time.
5. **Investigate the grade limit.** Enter a limit appropriate to your study assumptions and recalculate. If the app reports no route, it means no connected route on this mesh meets that limit. It does not prove that a real alignment is impossible: another resolution, route corridor, or designed earthworks could change the problem.
6. **Estimate a material layer.** Enter the proposed width, layer depth, waste percentage, and a rate you supply. Compare quantities for each candidate using the same material assumptions.
7. **Export and review.** Download each route CSV and rename it to identify the objective. Keep a separate note of the terrain file, endpoints, grade limit, and material inputs: the CSV contains route coordinates and distance, not all those settings.

The useful outcome is a set of preliminary alternatives and an explanation of their trade-offs. Before selecting an actual construction alignment, a site-specific review must address the conditions that this version does not model.

### What do the uphill and grade numbers mean?

**Uphill distance** measures how much route length lies on ascending sections. **Elevation gain** measures the total vertical rise across those sections. They are different quantities. A long, gentle climb can have a large uphill distance and a modest elevation gain.

**Grade percentage** is vertical change divided by horizontal run, multiplied by 100. For example, a segment that rises 2 m over a horizontal run of 20 m has a 10% grade. This explains the number; it is not a recommended design limit. The app applies its maximum grade constraint to both ascending and descending terrain edges.

## Practical example: estimate material for a path

Suppose a candidate route is **100 m long**, with an assumed **2 m width**, **0.10 m layer depth**, **5% waste**, and **₹1,800/m³ material rate**. These are illustrative inputs, not a measured TerraPath route or a current supplier quotation.

| Quantity | Calculation | Result |
|---|---|---|
| Surface strip area | 100 × 2 | 200 m² |
| Net layer volume | 200 × 0.10 | 20 m³ |
| Order volume including waste | 20 × 1.05 | 21 m³ |
| Material-only cost | 21 × ₹1,800 | ₹37,800 |

If another candidate is **120 m long**, the same assumptions give **25.2 m³** and **₹45,360**. That is **4.2 m³** and **₹7,560** more material. The longer route may have a different climbing or grade profile; compare the route results before drawing a conclusion.

This example shows why route length matters to quantities. It does not establish which route has the lowest total construction cost. Excavation, structures, labour, transport, compaction, drainage, and other site costs can change the comparison.

## Using data from a real site

To move beyond the demonstration terrain, prepare a rectangular, regularly spaced elevation grid outside TerraPath. A survey or GIS workflow can supply such a grid; the current app accepts only its JSON representation.

1. Express elevations and horizontal spacing in **metres**, using one consistent local coordinate system and elevation reference.
2. Supply the same spacing in both grid directions as `cellSize`. For 51 columns at 10 m spacing, the horizontal extent is `(51 − 1) × 10 = 500 m`; 51 rows span another 500 m.
3. Store elevations as `heights[row][column]`. Make sure the intended start and end locations correspond to the grid positions you select.
4. Import the JSON and check its orientation, extent, and elevation pattern before interpreting routes.

Raw latitude/longitude degrees are not metre coordinates. GeoTIFF conversion, coordinate reprojection, resampling, and missing-elevation handling must happen outside the app. There is no building, water, boundary, or exclusion-zone layer in v1, so the search can cross such features if they are not represented by its limited terrain/grade model. Do not insert arbitrary elevations to simulate barriers and then treat the result as surveyed ground.

## Where the current version fits

| Suitable now | Requires further development or specialist review |
|---|---|
| Teaching cone geometry and terrain pathfinding | Operational navigation or turn-by-turn directions |
| Comparing routes on small synthetic or prepared height grids | Full GIS analysis with georeferencing, obstacles, land boundaries, and network connections |
| Exploring distance, climbing, and maximum-grade objectives | Calibrated travel time, fuel, battery, braking, or vehicle performance predictions |
| Preliminary quantities for a uniform surface layer | Detailed road estimates, earthwork cut/fill, retaining structures, drainage, and bills of quantities |
| Discussing candidate walking-path or access-route concepts | Accessibility approval, public-road design, railway alignment, or construction-ready drawings |
| Extending the algorithm as an open-source project | Pipeline hydraulics, cable routing rules, conveyor design, or other specialist engineering calculations |

Use TerraPath when you need a transparent, interactive starting point for understanding terrain routes. Its scope is strongest when the surface, endpoint positions, objective, and limitations are clearly recorded alongside the result.

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
