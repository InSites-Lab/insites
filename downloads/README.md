# InSites ChatGPT Desktop delivery

Early development version, not yet for use in formal assessments.

Download [insites-chatgpt.zip](insites-chatgpt.zip) and give the complete archive
to the recipient. Follow the [installation and acceptance guide](../system/chatgpt-plugin/distribution/INSTALL.md).
The guide is also inside the ZIP as `insites-chatgpt/INSTALL.md`.

After this folder is pushed to `dev`, the direct download is:
<https://github.com/InSites-Lab/insites/raw/refs/heads/dev/downloads/insites-chatgpt.zip>.
A public GitHub download does not need a GitHub login. Publishing the file in this
repository does not publish a plugin listing in ChatGPT's public directory.

The ZIP contains eight module-built skills, supporting files and a remote MCP
configuration. It contains no local server, installation script, account-specific
app ID, credentials or assessment documents. The Google Cloud service is already
hosted. It currently accepts synthetic tests without authentication; private
assessment material requires access control before use.

`insites-chatgpt-package.json` records the archive SHA-256, package version and
source file digests. These digests detect file changes; they are not a publisher
signature. Download the archive from the intended InSites repository.

## Rebuild

From `system/chatgpt-plugin`, with Node.js 22+, Python 3 and the locked development
dependencies installed:

```powershell
npm.cmd run verify
npm.cmd run package:delivery
```

The delivery script verifies the deployed service, rebuilds the skills from the
current modules, and writes the complete ZIP and its inspection record here.
This one distribution archive is intentionally tracked for download; other
generated files under `system/chatgpt-plugin/dist`, `web/dist` and `artifacts`
remain ignored. Edit source and rebuild; never hand-edit the ZIP.
