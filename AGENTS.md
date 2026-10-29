# Deployment workflow

- Production is https://helmen.no (and www.helmen.no), hosted on Cloudflare Pages.
- Branch prod was created as an exact copy of production commit 214ed17893612e5b3ff7e542ade37153ffcb4a59.
- TRANSITION PENDING: Cloudflare Pages previously used test-cloudflare. The user must change the Pages production branch to prod in the dashboard. Do not assume the switch is done until confirmed.
- Keep test-cloudflare intact until the prod switch is confirmed and tested.
- Nonproduction uses branch nonprod. The confirmed Pages preview is https://nonprod.atv-5t4.pages.dev/.
- The user has also connected the existing Worker morning-pine-58fe.morgan-899.workers.dev to nonprod; its deployment status must be checked separately.
- By default, make and publish changes on nonprod for user review.
- Publish to production only when the user explicitly asks. Use prod after the dashboard switch has been confirmed.
- Workers deploy command: npx wrangler deploy --config nonprod-worker.jsonc
- No build step is needed: this is a static HTML/CSS/JavaScript site.
- When promoting website changes to production, exclude nonprod-worker.jsonc, .assetsignore and test-only content including noindex rules and concept labels, unless explicitly requested.
- The contact form uses the live Web3Forms service. Do not submit test messages unless explicitly requested.
