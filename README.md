# ITEC 116 Activity 6: Enterprise E-Commerce & BI Integration Pipeline

A real-world gadget e-commerce storefront with an end-to-end enterprise data pipeline and interactive live presentation dashboard.

---

## 🎨 Visual Design
Styled in the modern **Neo-Brutalist / Memphis Graphic Design** aesthetic:
- **Left Black Brand Block & White Navbar:** `GADGETSTYLE.`, Navigation links (`Home`, `Products`, `Categories`, `Activity Demo`), and live Cart drawer.
- **Split Hero Layout:** Outlined wireframe display typography (`ONLINE` / `SHOPPING` / `EASIER THAN EVER`), decorative geometric accents (striped triangles, wireframe clusters, diagonal hatched circles, dot matrix), and a pastel sky-blue gadget showcase panel with auto-rotating hardware slides.
- **Hardware Catalog:** Highlighting real gadget images (`moon-cherry-keyboard.jpg`, `mouse.jpg`, `mouse2.jpg`, `usb-c_hub.jpg`, `cyberpunk-deskmat.jpg`).
- **Activity Demo Monitor:** Live 4-node pipeline cockpit built specifically for lab presentations and instructor grading.

---

## 🚀 How to Run the Demo

### 1. Start the PHP Ingestion Server (Node B)
Open a terminal in the project root:
```powershell
php -S 127.0.0.1:5000 -t node_b_ingestion/
```
*(If already running on port 5000, you are good to go!)*

### 2. Launch the Storefront UI (Node A)
Simply double-click or open `node_a_storefront/index.html` in Google Chrome, Microsoft Edge, or any modern web browser.

---

## 📋 Demonstration Flow for Presentation / Rubric

1. **Customer Shopping (Node A):**
   - Browse the gadget catalog, filter by categories (`Keyboards`, `Mice`, `Hubs & Docks`, `Desk Mats`), or use the search bar.
   - Adjust quantities (`-` / `+`) and click **Add to Cart**.
   - Open the **Cart Drawer**, pick a Customer Profile (Juan Dela Cruz, Maria Clara, Jose Rizal), fulfillment warehouse, and payment method (GCash, Maya, Credit Card).
   - Click **Place Order & Ingest**.

2. **Ingestion to Staging (Node B):**
   - The storefront emits the exact **Schema version 1.1** JSON payload to `http://127.0.0.1:5000/server.php` with `Authorization: Bearer itec116_secret_token`.
   - The payload is validated and stored in `staging_orders` in SQLite `data/warehouse.db`.

3. **Activity Demo Cockpit:**
   - Click **Activity Demo** in the top navigation.
   - View the live **Emitted JSON Payload** with syntax highlighting.
   - Inspect the **SQLite Warehouse Inspector** showing the newly staged records.

4. **ETL Pipeline Execution (Node C):**
   - In the demo deck, click **🔄 Run ETL Pipeline Now**.
   - The backend cleans ISO-8601 timestamps, maps status codes, and populates the Star Schema tables (`Fact_Sales`, `Dim_Customer`, `Dim_Product`, `Dim_Time`).

5. **QA Reconciliation Audit (Node D):**
   - Click **🛡️ Run QA Reconciliation Audit**.
   - The audit verifies:
     - **100% Row Match** between Node B and Node C (Zero Data Loss).
     - **Total Revenue Reconciliation** in Philippine Pesos (₱).
     - **Technical Security & Validation Checks** (Bearer auth, ISO-8601 formatting, Status dimension mapping).

6. **Batch Stream Testing:**
   - Click **🚀 Generate 5 Orders (Batch Stream)** to demonstrate pipeline resilience with concurrent order generation.

7. **Visual BI Analytics Dashboard (Track E / ui_bi_dashboard):**
   - Open `ui_bi_dashboard/BI_dashboard.html` or click the **BI Analytics 📊** button in the storefront header.
   - Real-time Chart.js visual analytics querying `Fact_Sales` and Dimension tables from SQLite `data/warehouse.db`:
     - **Gross Revenue & Profit Margin KPIs**
     - **Sales Distribution by Warehouse Hub** (Manila vs Dasmariñas vs Cebu)
     - **Hourly Sales Trend Chart** (`Dim_Time`)
     - **Customer Spend & Profit Leaderboard** (`Dim_Customer`)
     - **Product Catalog Price vs Base Cost Spread** (`Dim_Product`)
     - **Live Star Schema Transaction Ledger Table**
