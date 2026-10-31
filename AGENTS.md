# Website workflow

- Production is https://helmen.no and www.helmen.no, served by Cloudflare Pages project `atv` from branch `prod`.
- Nonproduction is branch `nonprod`, available at https://nonprod.atv-5t4.pages.dev/ and the configured alias nonprod.helmen.no. The Worker morning-pine-58fe.morgan-899.workers.dev also builds from nonprod.
- USER PREFERENCE (2026-10-31): Make future website changes on `nonprod` first. Publish to `prod` only when the user explicitly requests promotion. This replaces the earlier preference for routine direct production edits.
- The initial multi-service release is approved for production on 2026-10-31. Both environments start with the same website content; later changes should be tried on nonprod.
- `backup-prod-2026-10-31` is a frozen copy of the former production snow-clearing site, pinned to commit `6719cb8a5cf708422892c8c41ee39753100dbf0b`. Do not change or delete it.
- Keep `test-cloudflare` as a legacy historical branch. Do not publish new work there.
- Promote approved website files, preserving environment-specific hosting settings. Production must remain indexable; nonprod must retain its global X-Robots-Tag noindex header. Thank-you pages remain noindex in both.
- Keep `nonprod-worker.jsonc` and `.assetsignore` on nonprod. Do not copy Worker deployment configuration into production unless the user explicitly requests it.
- Do not change the Pages production branch or DNS as part of routine publishing.
- No build step is needed for the static site. Nonprod Worker deploy command: `npx wrangler deploy --config nonprod-worker.jsonc`.
- Contact forms use the live Web3Forms service. Use local mocks for tests; do not send live test messages unless explicitly requested.
- Keep Norwegian, English, Polish, Ukrainian and Lithuanian text in sync for visible changes. Test generic and snow-specific forms when their behavior changes.
