# Trust Documents Folder

Documents placed here appear in the **About Charidham Odisha Trust** section of the homepage.

## How to publish a new document

1. Copy the file (PDF, JPG, PNG, or WEBP) into this folder: `temple/images/trust/`
2. Open `docs.json` in this folder and add an entry at the **end** of the array:

   ```json
   [
     { "file": "trust-registration.pdf", "label": "Trust Registration Certificate" },
     { "file": "pan-certificate.jpg",    "label": "PAN Card — Charidham Odisha Trust" }
   ]
   ```

   Fields:
   - `file`  – filename only (must match exactly, case-sensitive)
   - `label` – the title shown on the card

3. Commit and push to GitHub. The card will appear automatically on the live site — no code changes needed.

## Removing a document

Delete the file from this folder **and** remove its entry from `docs.json`, then commit.

## Notes

- PDFs render as a clickable PDF card that opens in a new tab.
- Images render as a thumbnail; clicking enlarges them in a lightbox.
- The two existing static documents (`Eng_trust.jpg`, `odi_trust.jpg`) live in `temple/images/` and are hard-coded in `index.html`; everything added via this folder appears **after** them.
