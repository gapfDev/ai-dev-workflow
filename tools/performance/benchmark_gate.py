#!/usr/bin/env python3
"""Simple benchmark gate evaluator for performance runs."""

import argparse
import json
import sys


def find_action(actions, name):
    for action in actions:
        if action.get("action") == name:
            return action
    return None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, help="Benchmark JSON file")
    parser.add_argument("--max-getorders-p95", type=float, default=5000.0)
    parser.add_argument("--max-getorders-p50", type=float, default=4000.0)
    args = parser.parse_args()

    with open(args.input, "r", encoding="utf-8") as f:
      data = json.load(f)

    actions = data.get("actions", [])
    get_orders = find_action(actions, "getOrders")
    if not get_orders:
        print("FAIL: missing getOrders action in benchmark")
        sys.exit(1)

    failures = []
    p50 = get_orders.get("p50_ms")
    p95 = get_orders.get("p95_ms")
    if p50 is None or p95 is None:
        failures.append("missing p50/p95 values for getOrders")
    else:
        if p50 > args.max_getorders_p50:
            failures.append(f"getOrders p50 {p50}ms exceeds {args.max_getorders_p50}ms")
        if p95 > args.max_getorders_p95:
            failures.append(f"getOrders p95 {p95}ms exceeds {args.max_getorders_p95}ms")

    if failures:
        print("FAIL")
        for failure in failures:
            print("- " + failure)
        sys.exit(1)

    print("PASS")
    print(f"- getOrders p50={p50}ms")
    print(f"- getOrders p95={p95}ms")


if __name__ == "__main__":
    main()
