#!/usr/bin/env python3
"""Benchmark read-path latency for Loading UX threshold planning."""

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
    sorted_values = sorted(values)
    idx = max(0, min(len(sorted_values) - 1, int(round((pct / 100.0) * (len(sorted_values) - 1)))))
    return sorted_values[idx]


def call_get(api_base, action, params=None, timeout=8):
    query = {"action": action}
    for key, value in (params or {}).items():
        if value is None or value == "":
            continue
        query[key] = str(value)
    url = f"{api_base}?{urllib.parse.urlencode(query)}"
    start = time.perf_counter()
    with urllib.request.urlopen(url, timeout=timeout) as response:
        payload = response.read()
    elapsed_ms = (time.perf_counter() - start) * 1000.0
    return elapsed_ms, payload


def benchmark_get(api_base, action, repeats, timeout, params=None):
    times = []
    sizes = []
    ok = 0
    err = 0
    sample = ""

    for _ in range(repeats):
        try:
            elapsed_ms, payload = call_get(api_base, action, params=params, timeout=timeout)
            times.append(elapsed_ms)
            sizes.append(len(payload) / 1024.0)
            if not sample:
                sample = payload[:220].decode("utf-8", errors="replace")
            ok += 1
        except Exception:
            err += 1

    return {
        "action": action,
        "params": params or {},
        "ok": ok,
        "err": err,
        "p50_ms": round(percentile(times, 50), 2) if times else None,
        "p95_ms": round(percentile(times, 95), 2) if times else None,
        "avg_ms": round(statistics.mean(times), 2) if times else None,
        "avg_kb": round(statistics.mean(sizes), 2) if sizes else None,
        "sample": sample,
    }


def decode_json(payload):
    return json.loads(payload.decode("utf-8", errors="replace"))


def resolve_context(api_base, timeout):
    context = {
        "sample_order_id": "",
        "board_rev": "",
        "since_updated_at": "",
    }

    _, orders_payload = call_get(api_base, "getOrders", timeout=timeout)
    orders = decode_json(orders_payload)
    if isinstance(orders, list) and orders:
        first = orders[0] if isinstance(orders[0], dict) else {}
        context["sample_order_id"] = str(first.get("order_id") or "")

    _, snapshot_payload = call_get(api_base, "getBoardSnapshot", timeout=timeout)
    snapshot = decode_json(snapshot_payload)
    if isinstance(snapshot, dict):
        context["board_rev"] = str(snapshot.get("board_rev") or "")
        items = snapshot.get("items") if isinstance(snapshot.get("items"), list) else []
        stamps = []
        for item in items:
            if not isinstance(item, dict):
                continue
            stamp = item.get("updated_at") or item.get("captured_at") or ""
            if stamp:
                stamps.append(stamp)
        if stamps:
            context["since_updated_at"] = max(stamps)

    return context


def main():
    parser = argparse.ArgumentParser(description="Benchmark read-only Loading UX critical paths")
    parser.add_argument("--api-base", required=True)
    parser.add_argument("--repeats", type=int, default=3)
    parser.add_argument("--timeout", type=int, default=8)
    parser.add_argument("--out-json", default="")
    args = parser.parse_args()

    context = resolve_context(args.api_base, args.timeout)
    actions = [
        ("getOrders", None),
        ("getBoardSnapshot", None),
        ("getProducts", None),
        ("getClientConfig", None),
    ]

    if context["sample_order_id"]:
        actions.append(("getOrderDetails", {"order_id": context["sample_order_id"]}))

    if context["board_rev"]:
        delta_params = {"since_rev": context["board_rev"]}
        if context["since_updated_at"]:
            delta_params["since_updated_at"] = context["since_updated_at"]
        actions.append(("getBoardDelta", delta_params))

    results = {
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "api_base": args.api_base,
        "repeats": args.repeats,
        "timeout_s": args.timeout,
        "resolved_context": context,
        "actions": [],
    }

    for action, params in actions:
        results["actions"].append(benchmark_get(args.api_base, action, args.repeats, args.timeout, params=params))

    print(json.dumps(results, indent=2))

    if args.out_json:
        with open(args.out_json, "w", encoding="utf-8") as file_obj:
            json.dump(results, file_obj, indent=2)


if __name__ == "__main__":
    main()
