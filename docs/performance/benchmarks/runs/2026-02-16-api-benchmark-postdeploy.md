# API Benchmark Run (Post-Deploy)

## Metadata
- Date (UTC): 2026-02-16T06:19:55Z
- Target URL: `https://script.google.com/macros/s/AKfycbwdrOEkjbmkNl0gcwEtmBZFb_9nSbklnLKiB_fm2uel_igkFitO3zu8hxL9a9HhNUub/exec`
- Repeats: 5
- Timeout per call: 8s
- Raw data: `api-benchmark-live-postdeploy.json`

## Results
| Action | OK | ERR | p50 (ms) | p95 (ms) | avg (ms) | avg payload (KB) |
|---|---:|---:|---:|---:|---:|---:|
| `getOrders` | 5 | 0 | 2408.03 | 2758.14 | 2483.24 | 24.03 |
| `getBoardSnapshot` | 5 | 0 | 4304.54 | 4692.53 | 4168.25 | 15.85 |
| `getProducts` | 5 | 0 | 3265.51 | 4468.33 | 3545.04 | 3.10 |

## Delta vs Pre-Deploy
- `getOrders` p50 improved from `4288.28ms` to `2408.03ms` (`-43.85%`).
- `getOrders` p95 improved from `5559.94ms` to `2758.14ms` (`-50.39%`).
- `getBoardSnapshot` endpoint is available and returns a lighter payload than `getOrders` (`15.85KB` vs `24.03KB`, `-34.04%`).

## Notes
- This benchmark validates runtime optimization and new board APIs.
- Frontend optimization gains (no-op render skip, incremental column updates, adaptive polling) are complementary to API latency changes.
