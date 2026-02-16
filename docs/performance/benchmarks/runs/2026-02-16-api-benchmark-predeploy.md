# API Benchmark Run (Pre-Deploy)

## Metadata
- Date (UTC): 2026-02-16T06:06:13Z
- Target URL: `https://script.google.com/macros/s/AKfycbwdrOEkjbmkNl0gcwEtmBZFb_9nSbklnLKiB_fm2uel_igkFitO3zu8hxL9a9HhNUub/exec`
- Repeats: 5
- Timeout per call: 5s
- Raw data: `api-benchmark-live-predeploy.json`

## Results
| Action | OK | ERR | p50 (ms) | p95 (ms) | avg (ms) | avg payload (KB) |
|---|---:|---:|---:|---:|---:|---:|
| `getOrders` | 4 | 1 | 4288.28 | 5559.94 | 4253.66 | 18.33 |
| `getBoardSnapshot` | 5 | 0 | 4164.88 | 5118.84 | 4179.27 | 0.07 |
| `getProducts` | 5 | 0 | 3817.24 | 4835.60 | 3997.22 | 3.10 |

## Notes
- `getBoardSnapshot` is not available in the currently deployed version yet and returns:
  - `{"status":"error","message":"Unknown GET action: getBoardSnapshot"}`
- This run is treated as a **pre-deploy baseline** for Milestone 2.
- Post-deploy benchmark is required after shipping the optimization branch.
