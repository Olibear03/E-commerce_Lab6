# Track D: Data Pipeline Quality KPIs

As required by the rubric, the governance team must track these 3 metrics:

1. **ETL Processing Latency:** 
   - *Definition:* The time it takes for a raw record in `staging_orders` to be transformed and fully loaded into `Fact_Sales`.
   - *Target:* Under 5 seconds per batch.
2. **Data Ingestion Error Rate:** 
   - *Definition:* (Failed API Requests / Total API Requests) * 100.
   - *Target:* 0% error rate for valid payloads.
3. **Row Count Reconciliation Accuracy:** 
   - *Definition:* Total records emitted by Node A == Total records in Node B (Staging) == Total distinct transactions in Node C (Fact_Sales).
   - *Target:* 100% match (Zero row loss).