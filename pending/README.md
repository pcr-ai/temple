# 📂 pending/

This folder represents the **Pending** stage of the gallery approval workflow.

## Purpose
Files / submissions placed here are **awaiting admin review**.

- Uploaded by site visitors via the gallery upload form
- Not yet visible in the public gallery
- Admin reviews items in the [Admin Panel](../admin.html)

## Workflow

```
User Upload → pending/  →  Admin Reviews
                              ↓           ↓
                         approved/    rejected/
```

> **Note:** On this static GitHub Pages site, media is stored securely in the browser's IndexedDB database. The `pending/`, `approved/`, and `rejected/` folders serve as organizational documentation for the approval workflow.  
> In a server-based deployment, actual files would be stored in this folder.
