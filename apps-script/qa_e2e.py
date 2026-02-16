#!/usr/bin/env python3
"""QA E2E for Bakery Apps Script MVP.

Runs API + UI checks against a Web App URL (/exec).
"""

import argparse
import asyncio
import json
import re
import subprocess
import sys
import time
import urllib.parse
import urllib.request
from datetime import datetime

from playwright.async_api import async_playwright, TimeoutError as PWTimeoutError


def now_tag():
    return datetime.utcnow().strftime("%Y%m%d%H%M%S")


class QaRunner:
    def __init__(self, api_base, local_dir, port):
        self.api_base = api_base
        self.local_dir = local_dir
        self.port = port
        self.local_url = (
            f"http://127.0.0.1:{port}/Index.html?apiBase="
            + urllib.parse.quote(api_base, safe="")
        )
        self.results = []
        self.errors = []

    def record(self, name, ok, detail=""):
        self.results.append({"name": name, "ok": ok, "detail": detail})
        status = "PASS" if ok else "FAIL"
        print(f"[{status}] {name} {detail}")
        if not ok:
            self.errors.append({"name": name, "detail": detail})

    def http_get_json(self, action):
        url = f"{self.api_base}?action={urllib.parse.quote(action)}"
        with urllib.request.urlopen(url, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))

    def http_post_json(self, payload):
        req = urllib.request.Request(
            self.api_base,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))

    async def run_ui_checks(self, ui_customer):
        server = subprocess.Popen(
            [sys.executable, "-m", "http.server", str(self.port), "--directory", self.local_dir],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        await asyncio.sleep(1.0)

        try:
            async with async_playwright() as pw:
                browser = await pw.chromium.launch(headless=True)
                page = await browser.new_page(viewport={"width": 1280, "height": 900})
                await page.goto(self.local_url, wait_until="domcontentloaded", timeout=45000)
                await page.wait_for_selector("#btnOpenMenuScreen", timeout=20000)

                tabs = [t.strip() for t in await page.locator(".tab-btn").all_text_contents()]
                has_capture = any("Capture" in t for t in tabs)
                has_kanban = any("Kanban" in t for t in tabs)
                has_dashboard = any("Dashboard" in t for t in tabs)
                has_expenses = any("Expenses" in t for t in tabs)
                self.record(
                    "UI tabs only Capture/Kanban",
                    has_capture and has_kanban and (not has_dashboard) and (not has_expenses),
                    f"tabs={tabs}",
                )

                await page.click("#btnOpenMenuScreen")
                await page.wait_for_selector("#menuModal.active", timeout=10000)
                await page.wait_for_timeout(1000)
                # Initial load may take a few seconds on Apps Script endpoints.
                for _ in range(8):
                    pre_count = await page.locator("#menuFamilies .product-btn").count()
                    if pre_count > 0:
                        break
                    await page.wait_for_timeout(700)
                await page.fill("#menuSearch", "semita")
                await page.wait_for_timeout(700)

                count = await page.locator("#menuFamilies .product-btn").count()
                self.record("UI popup product search", count > 0, f"count={count}")
                if count > 0:
                    await page.locator("#menuFamilies .product-btn").first.click()

                await page.click("#btnCloseMenuModal")
                await page.fill("#orderCustomer", ui_customer)

                current_date = await page.input_value("#orderDate")
                if not current_date:
                    await page.fill("#orderDate", datetime.now().strftime("%Y-%m-%d"))

                await page.click("#btnSaveOrder")
                await page.wait_for_timeout(3500)

                await page.click('.tab-btn[data-screen="board"]')
                await page.wait_for_selector("#kanbanBoard .kanban-column", timeout=15000)
                await page.wait_for_timeout(1200)

                ticket_count = await page.locator(f'.ticket:has-text("{ui_customer}")').count()
                self.record("UI created order appears in Kanban", ticket_count > 0, f"tickets={ticket_count}")

                density_class = await page.get_attribute("#kanbanBoard", "class")
                self.record(
                    "UI adaptive density class present",
                    bool(density_class and any(k in density_class for k in ["density-wide", "density-compact", "density-ultra"])),
                    f"class={density_class}",
                )

                await browser.close()
        except PWTimeoutError as exc:
            self.record("UI smoke", False, f"timeout={exc}")
        except Exception as exc:
            self.record("UI smoke", False, f"error={type(exc).__name__}: {exc}")
        finally:
            server.terminate()
            try:
                server.wait(timeout=2)
            except Exception:
                server.kill()

    def run(self):
        tag = now_tag()
        customer_a = f"QA-API-A-{tag}"
        customer_b = f"QA-API-B-{tag}"
        customer_ui = f"QA-UI-{tag}"

        products = self.http_get_json("getProducts")
        self.record("API getProducts", isinstance(products, list) and len(products) > 0, f"count={len(products) if isinstance(products, list) else 'n/a'}")

        items = [{"id": "P006", "name": "Semita Alta (1/4 Regular)", "price": 10, "quantity": 1}]
        create_payload = {
            "delivery_date": datetime.now().strftime("%Y-%m-%d"),
            "type": "Pickup",
            "items_json": items,
            "status": "Pending",
            "payment_status": "Unpaid",
        }

        resp_a = self.http_post_json({"action": "createOrder", "customer_name": customer_a, "channel": "Phone", **create_payload})
        resp_b = self.http_post_json({"action": "createOrder", "customer_name": customer_b, "channel": "Facebook", **create_payload})
        self.record("API createOrder A", resp_a.get("status") == "success", str(resp_a))
        self.record("API createOrder B", resp_b.get("status") == "success", str(resp_b))

        folio_pat = re.compile(r"^ORD-[0-3][0-9][A-Z]{3}-\d{3}$")
        folio_a = resp_a.get("order_number", "")
        folio_b = resp_b.get("order_number", "")
        cap_a = resp_a.get("captured_at", "")
        cap_b = resp_b.get("captured_at", "")

        self.record("Folio format A", bool(folio_pat.match(folio_a)), f"folio={folio_a}")
        self.record("Folio format B", bool(folio_pat.match(folio_b)), f"folio={folio_b}")
        self.record("captured_at generated A", bool(cap_a), f"captured_at={cap_a}")
        self.record("captured_at generated B", bool(cap_b), f"captured_at={cap_b}")

        try:
            seq_a = int(folio_a.split("-")[-1])
            seq_b = int(folio_b.split("-")[-1])
            same_prefix = "-".join(folio_a.split("-")[:-1]) == "-".join(folio_b.split("-")[:-1])
            self.record("Folio sequence increments", same_prefix and seq_b == seq_a + 1, f"{folio_a} -> {folio_b}")
        except Exception as exc:
            self.record("Folio sequence increments", False, str(exc))

        orders = self.http_get_json("getOrders")
        self.record("API getOrders", isinstance(orders, list) and len(orders) > 0, f"count={len(orders) if isinstance(orders, list) else 'n/a'}")

        fifo_ok = True
        prev = None
        for order in orders:
            ts = order.get("captured_at") or order.get("updated_at") or order.get("delivery_at") or order.get("delivery_date")
            try:
                cur = datetime.fromisoformat((ts or "").replace("Z", "+00:00"))
            except Exception:
                fifo_ok = False
                break
            if prev and cur < prev:
                fifo_ok = False
                break
            prev = cur
        self.record("FIFO order by captured_at ascending", fifo_ok)

        by_customer = {o.get("customer_name"): o for o in orders}
        order_a = by_customer.get(customer_a)
        order_b = by_customer.get(customer_b)
        self.record("Created order A retrievable", order_a is not None)
        self.record("Created order B retrievable", order_b is not None)

        if order_a and order_b:
            id_a = order_a.get("order_id", "")
            id_b = order_b.get("order_id", "")
            v_a = order_a.get("sync_version", 1)
            v_b = order_b.get("sync_version", 1)

            bad_delivered = self.http_post_json({"action": "updateOrderStatus", "order_id": id_a, "status": "Delivered", "base_sync_version": v_a})
            self.record("Rule: Delivered only from Baked", bad_delivered.get("status") == "error", str(bad_delivered))

            st1 = self.http_post_json({"action": "updateOrderStatus", "order_id": id_a, "status": "Working", "base_sync_version": v_a})
            self.record("Transition Pending->Working", st1.get("status") == "success", str(st1))
            v1 = st1.get("sync_version", v_a + 1)

            st2 = self.http_post_json({"action": "updateOrderStatus", "order_id": id_a, "status": "Baked", "base_sync_version": v1})
            self.record("Transition Working->Baked", st2.get("status") == "success", str(st2))
            v2 = st2.get("sync_version", v1 + 1)

            st3 = self.http_post_json({"action": "updateOrderStatus", "order_id": id_a, "status": "Delivered", "base_sync_version": v2})
            self.record("Transition Baked->Delivered", st3.get("status") == "success", str(st3))
            v3 = st3.get("sync_version", v2 + 1)

            lock_edit = self.http_post_json({"action": "updateOrderDetails", "order_id": id_a, "base_sync_version": v3, "customer_name": customer_a + "-EDIT"})
            self.record("Rule: Delivered not editable", lock_edit.get("status") == "error", str(lock_edit))

            lock_status = self.http_post_json({"action": "updateOrderStatus", "order_id": id_a, "status": "Cancelled", "base_sync_version": v3})
            self.record("Rule: Delivered status locked", lock_status.get("status") == "error", str(lock_status))

            to_cancelled = self.http_post_json({"action": "updateOrderStatus", "order_id": id_b, "status": "Cancelled", "base_sync_version": v_b})
            self.record("Transition -> Cancelled", to_cancelled.get("status") == "success", str(to_cancelled))

            fail_reactivate = self.http_post_json({"action": "updateOrderStatus", "order_id": id_b, "status": "Pending", "base_sync_version": to_cancelled.get("sync_version", v_b + 1)})
            self.record("Rule: Cancelled revert requires confirm", fail_reactivate.get("status") == "error", str(fail_reactivate))

            ok_reactivate = self.http_post_json({"action": "updateOrderStatus", "order_id": id_b, "status": "Pending", "confirm_reactivate": True, "base_sync_version": to_cancelled.get("sync_version", v_b + 1)})
            self.record("Cancelled revert with confirm", ok_reactivate.get("status") == "success", str(ok_reactivate))

        asyncio.run(self.run_ui_checks(customer_ui))

        passed = sum(1 for r in self.results if r["ok"])
        failed = len(self.results) - passed
        print("\n=== QA SUMMARY ===")
        print(f"Passed: {passed}")
        print(f"Failed: {failed}")
        if failed:
            for err in self.errors:
                print(f" - {err['name']}: {err['detail']}")
        return 0 if failed == 0 else 2


def parse_args():
    parser = argparse.ArgumentParser(description="Run Bakery MVP QA E2E")
    parser.add_argument("--api-base", required=True, help="Apps Script /exec URL")
    parser.add_argument("--local-dir", default=".", help="Directory containing Index.html")
    parser.add_argument("--port", default=4173, type=int, help="Local http.server port")
    return parser.parse_args()


def main():
    args = parse_args()
    runner = QaRunner(args.api_base, args.local_dir, args.port)
    return runner.run()


if __name__ == "__main__":
    sys.exit(main())
