# 💾 Disaster Recovery & Backup Strategy

## 1. Backup Frequency (RPO)
We utilize a two-tier backup strategy to ensure data safety:

*   **Tier 1: Continuous Protection (Cloud Firestore)**
    *   **Method:** Point-in-Time Recovery (PITR)
    *   **Frequency:** Real-time (Every transaction)
    *   **Retention:** 7 Days
    *   **Usage:** Rollback the entire database to *any second* within the last week. Ideal for "Oops, I deleted the wrong order" moments.

*   **Tier 2: Daily Snapshots (Recommended)**
    *   **Method:** Google Cloud Storage Export
    *   **Frequency:** Daily (Scheduled via Cloud Scheduler)
    *   **Retention:** 30 Days
    *   **Usage:** Catastrophic failure or region outage recovery.

## 2. Recovery Time Objective (RTO)
*   **Minor Data Loss (1 record):** < 5 Minutes (Using Local Backup Tool)
*   **Total Database Loss:** < 30 Minutes (Using GCP Import)

## 3. How to Restore

### A. Partial Restore (Developer Tool)
We have created a local utility to save/restore critical "Configuration Data" (Menu Items).

1.  **Backup:** Run `npm run backup:menu`
    *   *Saves `menu_backup.json` to your local machine.*
2.  **Restore:** Run `npm run restore:menu`
    *   *Reads `menu_backup.json` and pushes it back to Firestore.*

### B. Full Database Switch (Catastrophe)
If `us-central1` fails completely:
1.  Go to **Firebase Console > Firestore**.
2.  Click **Import/Export**.
3.  Select the latest bucket snapshot.
4.  Click **Import**.

## 4. Verification
*   **Last Verified:** Today
*   **Status:** Active
*   **Data Integrity:** Protected by Security Rules & Schema Validation.
