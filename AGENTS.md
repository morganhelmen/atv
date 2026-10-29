# Deployment workflow

- Production is https://helmen.no (and www.helmen.no), hosted on Cloudflare Pages.
- Its existing production Git branch is test-cloudflare. Despite the name, this IS PRODUCTION.
- Nonproduction is intended to be https://morning-pine-58fe.morgan-899.workers.dev/ using branch nonprod.
- By default, make and publish changes on nonprod for user review.
- Publish to test-cloudflare only when the user explicitly asks to publish approved changes to production.
- Nonprod has a separate Workers configuration: nonprod-worker.jsonc.
- Workers deploy command: npx wrangler deploy --config nonprod-worker.jsonc
- No build step is needed: this is a static HTML/CSS/JavaScript site.
- This repository setup does not connect Cloudflare Workers Builds automatically. The worker must be linked once to morganhelmen/atv, branch nonprod, in Cloudflare.
- When promoting website changes to production, exclude nonprod-worker.jsonc, .assetsignore and this deployment guidance; preserve the existing Pages configuration and production branch.
- The nonprod contact form still uses the live Web3Forms service. Do not submit test messages unless explicitly requested.
