# Loading UX Baseline Timing Matrix (Ticket #51)

## Metadata
- Date (UTC): 2026-02-17T05:08:24.717770+00:00
- Target URL: `https://script.google.com/macros/s/AKfycbwdrOEkjbmkNl0gcwEtmBZFb_9nSbklnLKiB_fm2uel_igkFitO3zu8hxL9a9HhNUub/exec`
- Repeats: 3
- Timeout per call: 5s
- Threshold: `25ms` (loader activation cutoff)
- Raw evidence: `2026-02-17-loading-ux-baseline.json`

## Reproducible Command Trace
```bash
cd /Users/gabrielperez/AndroidStudioProjects/ai/wt-51-loading-baseline
tools/performance/benchmark_loading_ux.py \
  --api-base "https://script.google.com/macros/s/AKfycbwdrOEkjbmkNl0gcwEtmBZFb_9nSbklnLKiB_fm2uel_igkFitO3zu8hxL9a9HhNUub/exec" \
  --repeats 3 \
  --timeout 5 \
  --out-json docs/performance/benchmarks/runs/2026-02-17-loading-ux-baseline.json
```

## Timing Matrix (UI + API Paths)
| Operation | API path sampled | p50 (ms) | p95 (ms) | >25ms | Recommended loader |
|---|---|---:|---:|:---:|---|
| Initial app boot (config + products + first board fetch) | `getBoardSnapshot` | 2824.66 | 4227.13 | YES | Global |
| Board refresh (manual/auto poll) | `getBoardDelta` | 2717.51 | 3299.21 | YES | Section |
| Fallback board refresh (no delta) | `getOrders` | 2483.13 | 3357.89 | YES | Section |
| Open order for edit | `getOrderDetails` | 2694.2 | 3597.78 | YES | Section |
| Products menu load/search source | `getProducts` | 2594.87 | 3076.93 | YES | Section |
| Client flag bootstrap | `getClientConfig` | 1904.54 | 1937.92 | YES | Global |

## Endpoint Evidence
| Action | OK | ERR | p50 (ms) | p95 (ms) | avg (ms) | avg payload (KB) |
|---|---:|---:|---:|---:|---:|---:|
| `getOrders` | 2 | 1 | 2483.13 | 3357.89 | 2920.51 | 18.86 |
| `getBoardSnapshot` | 3 | 0 | 2824.66 | 4227.13 | 3262.91 | 11.8 |
| `getProducts` | 3 | 0 | 2594.87 | 3076.93 | 2624.38 | 3.1 |
| `getClientConfig` | 3 | 0 | 1904.54 | 1937.92 | 1910.45 | 0.17 |
| `getOrderDetails` | 3 | 0 | 2694.2 | 3597.78 | 2970.86 | 0.6 |
| `getBoardDelta` | 3 | 0 | 2717.51 | 3299.21 | 2840.42 | 0.1 |

## Interpretation
- All critical read paths are above the 25ms threshold at p50 and p95, so loader infra is required across global and section flows.
- `getBoardDelta` is lighter than full refresh payload and should remain the default board polling path; fallback to `getOrders` must keep section-level loader behavior.
- Startup should use global busy semantics; task-scoped actions should use section or button loaders to avoid blocking unrelated UI.

## Loader Recommendation Map
| Loader type | Operations |
|---|---|
| Global | Initial app boot (`getClientConfig`, first products/board load) |
| Section | Board refresh (`getBoardDelta`/`getOrders` fallback), open-order edit (`getOrderDetails`), products fetch (`getProducts`) |
| Button | Write actions (`createOrder`, `updateOrderDetails`, `updateOrderStatus`) should use button-scoped busy indicators with non-flicker threshold handling |
