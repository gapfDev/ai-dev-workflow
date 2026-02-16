#!/usr/bin/env python3
"""Lightweight API benchmark for Bakery Ops board endpoints."""

import argparse
import json
import statistics
import time
import urllib.parse
import urllib.request
from datetime import datetime, timezone


def percentile(values, pct):
    if not values:
        return None
    idx = max(0, min(len(values) - 1, int(round((pct / 100.0) * (len(values) - 1)))))
    return sorted(values)[idx]


def call_api(api_base, action, timeout=8):
    url = f"{api_base}?action={urllib.parse.quote(action)}"
    start = time.perf_counter()
    with urllib.request.urlopen(url, timeout=timeout) as resp:
        payload = resp.read()
    elapsed_ms = (time.perf_counter() - start) * 1000.0
    return elapsed_ms, payload


def benchmark_action(api_base, action, repeats, timeout):
    times = []
    sizes = []
    ok = 0
    err = 0
    sample = None
    for _ in range(repeats):
        try:
            elapsed_ms, payload = call_api(api_base, action, timeout=timeout)
            times.append(elapsed_ms)
            sizes.append(len(payload) / 1024.0)
            if sample is None:
                sample = payload.decode("utf-8", errors="replace")
            ok += 1
        except Exception:
            err += 1

    return {
        "action": action,
        "repeats": repeats,
        "ok": ok,
        "err": err,
        "p50_ms": round(percentile(times, 50), 2) if times else None,
        "p95_ms": round(percentile(times, 95), 2) if times else None,
        "avg_ms": round(statistics.mean(times), 2) if times else None,
        "avg_kb": round(statistics.mean(sizes), 2) if sizes else None,
        "sample": sample[:400] if sample else "",
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--api-base", required=True)
    parser.add_argument("--repeats", type=int, default=5)
    parser.add_argument("--timeout", type=int, default=8)
    parser.add_argument("--out-json", default="")
    args = parser.parse_args()

    results = {
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "api_base": args.api_base,
        "repeats": args.repeats,
        "actions": [
            benchmark_action(args.api_base, "getOrders", args.repeats, args.timeout),
            benchmark_action(args.api_base, "getBoardSnapshot", args.repeats, args.timeout),
            benchmark_action(args.api_base, "getProducts", args.repeats, args.timeout),
        ],
    }

    print(json.dumps(results, indent=2))

    if args.out_json:
        with open(args.out_json, "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2)


if __name__ == "__main__":
    main()
