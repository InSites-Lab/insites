# InSites ChatGPT plugin and MCP server

Early development version, not yet for use in formal assessments.

This directory contains the source for eight module-built InSites skills, a
stateless Node.js MCP server, and its MCP App viewer. The server accepts approved
display data and serves the viewer; it does not run an AI model or store
assessment data. The viewer sends bounded view context through the host's model
context channel, then sends only the user's question into the current chat.

`config/remote-mcp.json` is the public endpoint used for portable packages. The
deployed service is `insites-mcp` in Google Cloud project
`culturalinsite-a8247`, region `me-west1`. Its Cloud Run runtime identity is
`insites-mcp-run@culturalinsite-a8247.iam.gserviceaccount.com`. It has no project
IAM roles. The endpoint is unauthenticated and intended for synthetic tests;
do not send private assessment material until access control is implemented.

From this directory, with Node.js 22+ and Python 3:

```powershell
npm.cmd ci
npm.cmd run verify
node scripts/verify-repository.mjs
```

After deploying this exact source and confirming `/health` reports the version
in `shared/version.mjs`, run:

```powershell
npm.cmd run package
node scripts/inspect-package.mjs
```

The generated `artifacts/insites-chatgpt-portable.zip` contains eight skills and
both MCP declarations pointing to the configured endpoint. The web skills ZIP
contains no MCP declaration; its MCP app is connected separately. Generated
files under `dist/`, `web/dist/`, and `artifacts/` are never edited or committed.
The plugin package and Cloud Run service are updated as separate operations.

For a recipient's private Plugin Creator import, run `npm.cmd run package:delivery`.
This writes the complete archive to `downloads/insites-chatgpt.zip` at the repository
root, with the account-independent remote MCP declarations and
[`distribution/INSTALL.md`](distribution/INSTALL.md) included inside. That delivery
archive and its SHA-256 inspection record are intentionally tracked for download
from the repository; the other build products remain ignored. No local installer is needed.
The recipient uses Plugin Creator's private archive creation tool, installs the
result, and verifies tool and widget delivery in their own account. Package checks
do not establish another account's feature eligibility or host acceptance.

The local development command `npm.cmd run dev` can still start a loopback
server through ngrok, or `npm.cmd run dev -- --cloudflare` through Cloudflare.
Passing an explicit HTTPS `/mcp` URL to `scripts/package.mjs` is supported only
when that endpoint serves the same version. No tunnel is required for the
configured Cloud Run service.

Personal plugin updates must preserve the existing account metadata and
audience. Installation and current chat activation must be checked in the
intended desktop account; package validation alone does not prove that a live
chat loaded the new release.
