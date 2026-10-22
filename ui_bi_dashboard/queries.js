/**
 * ITEC 116 Activity 6: Visual BI Analytics Engine (queries.js)
 * Theme: Neo-Brutalist Graphic Visualizations & Star Schema OLAP
 */

const BI_API_ENDPOINT = 'http://127.0.0.1:5000/server.php?action=bi_analytics';

// Chart instances
let warehouseChartInstance = null;
let timeTrendChartInstance = null;
let customerChartInstance = null;
let productChartInstance = null;

// Intersection Observer for card summoning
let summonObserver = null;

document.addEventListener('DOMContentLoaded', () => {
    // Initial icon render
    if (window.lucide) {
        lucide.createIcons();
    }

    // Initialize summoning scroll animation
    initSummonObserver();

    // Initial data fetch
    fetchBIAnalytics();
    
    // Auto refresh every 10 seconds for live presentation demos
    setInterval(() => {
        fetchBIAnalytics(true);
    }, 10000);
});

/**
 * Initialize scroll reveal summoning animation with staggered delays
 */
function initSummonObserver() {
    if ('IntersectionObserver' in window) {
        summonObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('summoned');
                } else {
                    // Reset when scrolled away to summon dynamically upon revisit
                    entry.target.classList.remove('summoned');
                }
            });
        }, {
            threshold: 0.05,
            rootMargin: '0px 0px -20px 0px'
        });
    }

    // Stagger metric cards
    const metricCards = document.querySelectorAll('.metrics-row .summon-card');
    metricCards.forEach((card, idx) => {
        card.style.setProperty('--summon-delay', `${idx * 75}ms`);
        if (summonObserver) summonObserver.observe(card);
    });

    // Stagger main & secondary chart cards
    const chartCards = document.querySelectorAll('.charts-grid-main .summon-card, .charts-grid-secondary .summon-card');
    chartCards.forEach((card, idx) => {
        card.style.setProperty('--summon-delay', `${(idx % 2) * 90}ms`);
        if (summonObserver) summonObserver.observe(card);
    });

    // Header and ledger
    const header = document.querySelector('.bi-header.summon-card');
    if (header && summonObserver) summonObserver.observe(header);

    const ledger = document.querySelector('.ledger-card.summon-card');
    if (ledger && summonObserver) summonObserver.observe(ledger);
}

async function fetchBIAnalytics(isSilent = false) {
    const refreshBtn = document.getElementById('btn-refresh');
    if (refreshBtn && !isSilent) {
        refreshBtn.innerHTML = `<i data-lucide="loader-2"></i><span>Refreshing...</span>`;
        if (window.lucide) lucide.createIcons();
        refreshBtn.disabled = true;
    }

    try {
        const response = await fetch(BI_API_ENDPOINT);
        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}`);
        }

        const data = await response.json();
        if (data.status === 'success') {
            updateKPICards(data.kpis);
            renderWarehouseChart(data.by_warehouse);
            renderTimeTrendChart(data.by_time);
            renderCustomerChart(data.by_customer);
            renderProductChart(data.products_dim);
            renderLedgerTable(data.recent_sales);

            const lastUpdatedEl = document.getElementById('last-updated');
            if (lastUpdatedEl) {
                lastUpdatedEl.innerText = `Synced: ${new Date().toLocaleTimeString()}`;
            }
        }
    } catch (err) {
        console.error("BI Query Error:", err);
        const lastUpdatedEl = document.getElementById('last-updated');
        if (lastUpdatedEl) {
            lastUpdatedEl.innerText = `Ingestion Server Offline (Port 5000)`;
            lastUpdatedEl.style.color = '#dc2626';
        }
    } finally {
        if (refreshBtn && !isSilent) {
            refreshBtn.innerHTML = `<i data-lucide="refresh-cw"></i><span>Refresh Data</span>`;
            if (window.lucide) lucide.createIcons();
            refreshBtn.disabled = false;
        }
    }
}

// 1. Update Executive KPI Cards
function updateKPICards(kpis) {
    if (!kpis) return;

    const rev = parseFloat(kpis.total_revenue || 0);
    const margin = parseFloat(kpis.total_net_margin || 0);
    const orders = parseInt(kpis.total_orders || 0);
    const aov = parseFloat(kpis.avg_order_value || 0);
    const marginRate = parseFloat(kpis.margin_rate || 0);
    const items = parseInt(kpis.total_items_sold || 0);

    const revEl = document.getElementById('metric-revenue');
    if (revEl) revEl.innerText = `₱${rev.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    const marginEl = document.getElementById('metric-margin');
    if (marginEl) marginEl.innerText = `₱${margin.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    const marginSubEl = document.getElementById('metric-margin-sub');
    if (marginSubEl) {
        marginSubEl.innerHTML = `
            <span class="trend-pill trend-green">${marginRate}% Margin</span>
            <span>Net operational profit</span>
        `;
    }

    const ordersEl = document.getElementById('metric-orders');
    if (ordersEl) ordersEl.innerText = orders;

    const ordersSubEl = document.getElementById('metric-orders-sub');
    if (ordersSubEl) {
        ordersSubEl.innerHTML = `
            <span class="trend-pill trend-amber">${items} Units</span>
            <span>Across 3 fulfillment hubs</span>
        `;
    }

    const aovEl = document.getElementById('metric-aov');
    if (aovEl) aovEl.innerText = `₱${aov.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
}

// 2. Chart: Sales by Fulfillment Warehouse (Dim_Warehouse ✕ Fact_Sales)
function renderWarehouseChart(warehouseData) {
    const ctx = document.getElementById('chart-warehouse')?.getContext('2d');
    if (!ctx || !warehouseData) return;

    // Filter out null locations
    const cleanData = warehouseData.filter(w => w.warehouse_location && w.revenue > 0);
    const labels = cleanData.map(w => w.warehouse_location.replace(/\s*\(.*?\)/, ''));
    const revenues = cleanData.map(w => w.revenue);

    const colors = ['#93d2e3', '#06d6a0', '#ffd166', '#c4b5fd'];

    if (warehouseChartInstance) {
        warehouseChartInstance.data.labels = labels;
        warehouseChartInstance.data.datasets[0].data = revenues;
        warehouseChartInstance.update();
        return;
    }

    warehouseChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: revenues,
                backgroundColor: colors,
                borderColor: '#121212',
                borderWidth: 2.5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#1e293b',
                        font: { family: 'Space Grotesk', size: 12, weight: '700' },
                        padding: 14
                    }
                },
                tooltip: {
                    callbacks: {
                        label: (ctx) => ` ₱${Number(ctx.raw).toLocaleString()} (${ctx.label})`
                    }
                }
            },
            cutout: '66%'
        }
    });
}

// 3. Chart: Hourly Revenue & Margin Trend (Dim_Time ✕ Fact_Sales)
function renderTimeTrendChart(timeData) {
    const ctx = document.getElementById('chart-time-trend')?.getContext('2d');
    if (!ctx || !timeData) return;

    const cleanTime = timeData.filter(t => t.revenue > 0);
    const labels = cleanTime.map(t => `${t.hour}:00`);
    const revenues = cleanTime.map(t => t.revenue);

    if (timeTrendChartInstance) {
        timeTrendChartInstance.data.labels = labels;
        timeTrendChartInstance.data.datasets[0].data = revenues;
        timeTrendChartInstance.update();
        return;
    }

    timeTrendChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Revenue (₱)',
                data: revenues,
                borderColor: '#0284c7',
                backgroundColor: 'rgba(147, 210, 227, 0.25)',
                borderWidth: 2.5,
                fill: true,
                tension: 0.35,
                pointBackgroundColor: '#ffd166',
                pointBorderColor: '#121212',
                pointBorderWidth: 2,
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: { color: '#e2e8f0' },
                    ticks: { color: '#1e293b', font: { family: 'Fira Code', weight: '600' } }
                },
                y: {
                    grid: { color: '#e2e8f0' },
                    ticks: {
                        color: '#1e293b',
                        font: { family: 'Fira Code', weight: '600' },
                        callback: val => `₱${Number(val).toLocaleString()}`
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => ` Revenue: ₱${Number(ctx.raw).toLocaleString()}`
                    }
                }
            }
        }
    });
}

// 4. Chart: Customer Spend Leaderboard (Dim_Customer ✕ Fact_Sales)
function renderCustomerChart(customerData) {
    const ctx = document.getElementById('chart-customers')?.getContext('2d');
    if (!ctx || !customerData) return;

    const cleanCustomers = customerData.filter(c => c.customer_name && c.total_spent > 0);
    const labels = cleanCustomers.map(c => c.customer_name);
    const spent = cleanCustomers.map(c => c.total_spent);
    const profit = cleanCustomers.map(c => c.total_profit);

    if (customerChartInstance) {
        customerChartInstance.data.labels = labels;
        customerChartInstance.data.datasets[0].data = spent;
        customerChartInstance.data.datasets[1].data = profit;
        customerChartInstance.update();
        return;
    }

    customerChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Gross Spend (₱)',
                    data: spent,
                    backgroundColor: '#06d6a0',
                    borderColor: '#121212',
                    borderWidth: 1.5,
                    borderRadius: 4
                },
                {
                    label: 'Net Margin (₱)',
                    data: profit,
                    backgroundColor: '#ffd166',
                    borderColor: '#121212',
                    borderWidth: 1.5,
                    borderRadius: 4
                }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: { color: '#e2e8f0' },
                    ticks: {
                        color: '#1e293b',
                        font: { family: 'Fira Code', weight: '600' },
                        callback: val => `₱${Number(val).toLocaleString()}`
                    }
                },
                y: {
                    grid: { display: false },
                    ticks: { color: '#121212', font: { family: 'Space Grotesk', weight: '700' } }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#1e293b', font: { family: 'Space Grotesk', weight: '700' }, padding: 12 }
                }
            }
        }
    });
}

// 5. Chart: Dimension Product Margins (Dim_Product)
function renderProductChart(productsData) {
    const ctx = document.getElementById('chart-products')?.getContext('2d');
    if (!ctx || !productsData) return;

    const topProducts = productsData.slice(0, 6);
    const labels = topProducts.map(p => p.product_name.length > 15 ? p.product_name.substring(0, 15) + '...' : p.product_name);
    const prices = topProducts.map(p => p.unit_price);
    const costs = topProducts.map(p => p.unit_cost);

    if (productChartInstance) {
        productChartInstance.data.labels = labels;
        productChartInstance.data.datasets[0].data = prices;
        productChartInstance.data.datasets[1].data = costs;
        productChartInstance.update();
        return;
    }

    productChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Selling Price (₱)',
                    data: prices,
                    backgroundColor: '#c4b5fd',
                    borderColor: '#121212',
                    borderWidth: 1.5,
                    borderRadius: 4
                },
                {
                    label: 'Base Cost (₱)',
                    data: costs,
                    backgroundColor: '#e2e8f0',
                    borderColor: '#121212',
                    borderWidth: 1.5,
                    borderRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#121212', font: { family: 'Space Grotesk', size: 11, weight: '700' } }
                },
                y: {
                    grid: { color: '#e2e8f0' },
                    ticks: {
                        color: '#1e293b',
                        font: { family: 'Fira Code', weight: '600' },
                        callback: val => `₱${Number(val).toLocaleString()}`
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#1e293b', font: { family: 'Space Grotesk', weight: '700' }, padding: 12 }
                }
            }
        }
    });
}

// 6. Populate Recent Star Schema Fact_Sales Ledger
function renderLedgerTable(recentSales) {
    const tbody = document.getElementById('ledger-tbody');
    if (!tbody || !recentSales) return;

    tbody.innerHTML = recentSales.map(row => `
        <tr>
            <td><strong>#${row.fact_id}</strong></td>
            <td><code>${row.transaction_id}</code></td>
            <td><strong>${row.customer_name || row.customer_id || 'CUST-001'}</strong></td>
            <td>${row.warehouse_location || 'WH-MNL-01'}</td>
            <td>${row.item_count || 1} pcs</td>
            <td style="color: #0284c7; font-weight: 800; font-family: var(--font-mono);">₱${parseFloat(row.monetary_value || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
            <td style="color: #059669; font-weight: 800; font-family: var(--font-mono);">₱${parseFloat(row.net_margin || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
            <td><span class="status-badge">${row.status || 'Completed'}</span></td>
        </tr>
    `).join('');
}
