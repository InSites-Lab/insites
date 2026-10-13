# Install InSites in your own ChatGPT Desktop account

Early development version, not yet for use in formal assessments.

This package contains all eight InSites skills, their supporting specification
files and the HTTPS connection configuration for the hosted InSites MCP service.
The service supplies the graph and dashboard widgets and their question channel.
It is already hosted in Google Cloud; you do not need a local server, ngrok, Git,
Node.js, Python or an installer.

The service currently has no authentication and is intended for synthetic tests.
Use fictional test material. Access control is required before sending private
assessment material to it.

## 1. Download the complete package

Download **insites-chatgpt.zip** from the maintainer's link. Keep it as a ZIP for
import. Its single top-level folder is `insites-chatgpt`; hidden compatibility
files are included. This delivery contains no app ID belonging to another
ChatGPT account or workspace.

The development download, available after the maintainer pushes it, is:

<https://github.com/InSites-Lab/insites/raw/refs/heads/dev/downloads/insites-chatgpt.zip>

## 2. Create your private plugin with Plugin Creator

1. Open **ChatGPT Desktop** and sign in to your own account. Select **Personal**
   as the destination for this installation.
2. In **Plugins**, find **Plugin Creator**, install it if required, and start a
   new conversation with `@Plugin Creator` in a mode where its creation tools
   are available. ChatGPT Work supports the creation workflow.
3. Attach **insites-chatgpt.zip** to the conversation and send this request:

   > Create a private plugin in my current personal account from this completed
   > InSites ZIP. Use the archive creation capability to import the supplied
   > package. Preserve all eight skills, their reference files, the package
   > identity and version, and the remote MCP URL. Do not rewrite the
   > specification, replace the skills with summaries, or deploy a new server.
   > Return the created plugin link and explain any remaining connection step.

4. Wait for an actual creation result and its plugin link. Open the link and
   confirm that the plugin contains the eight skills listed below and the
   InSites MCP connection. Creating only an MCP connection is not the complete
   InSites installation.
5. Select **Install plugin** if shown, then complete any connection or approval
   steps ChatGPT presents. Installing a package does not automatically complete
   every account's app authorization or enable unavailable account features.

Plugin Creator's archive tool can create a private plugin in the active workspace,
or in a personal account when no workspace is active. It accepts remote MCP
configuration. This does not require publication in the public directory.

If Plugin Creator is unavailable, or the archive creation tool cannot run in your
account, report the exact message to the maintainer. Do not substitute a generic
InSites-like assistant. Account availability has not been tested for every plan.

The remote MCP declaration is already in the ZIP. Complete connection approval
in ChatGPT when requested. No account-specific app ID is required in this delivery.
Its **Desktop only** designation is expected for an imported MCP package.

## 3. Verify the complete system

1. Start a **new Work conversation in ChatGPT Desktop**, type `@`, and select
   **InSites**.
2. In that conversation, write an arbitrary word of your choice and say it is
   the private connection-test marker.
3. Ask: **"Run the InSites conversation connection test only. Do not start an
   assessment and do not pass my marker to any tool."**
4. When the test widget appears, click **Ask in chat**. Confirm that a question
   appears in the same conversation and that the answer recalls your word.
5. Ask: **"Display a synthetic knowledge graph, not an assessment: Example
   building (Asset), Example village (Place), Example community (Social Group).
   Relations: building is located in village; community uses building; community
   lives in village. These fictional nodes and relations are approved test data."**
6. Confirm that the graph is visible. Select the building and ask from the widget:
   **"Which relationships involve this entity?"** Confirm that the answer appears
   in the same conversation and identifies both stated relationships.
7. Ask for a synthetic dashboard of the same fictional material. Confirm that it
   is visible and that its Ask control delivers a question to this conversation.

Record the result of each check: eight skills present, MCP tools available,
widget visible, question delivered, and answer using conversation context.
Archive import alone does not prove these host behaviors.

## 4. Start an InSites pilot workflow

Select `@InSites`, upload synthetic documentation and write **"Begin assessment."**
Review each stage, add or correct information, then explicitly approve continuing.
A revision does not approve the next stage. Request a knowledge graph or dashboard
from approved outputs. For supplied completed material, ask **"Read assessment"**
or **"Read collection"**. Write **"Save progress"** before ending a long session
and retain the resume capsule. Response language follows the language you use.

Do not load a single-file InSites specification into the same conversation. If
another InSites plugin is active, select the one you intend to test.

## Updates and help

For an update, attach the new complete ZIP in the original Plugin Creator
conversation and ask to update the existing plugin, keeping its backend identity,
audience and any app binding created for your account. Request the actual update
result, then repeat the connection checks in a new InSites conversation.
The GitHub download is a distribution file; automatic account updates are not
promised.

If a step fails, report its exact error and which check failed. Keep the test
conversation. To stop using InSites, disable the plugin in ChatGPT's plugin
controls; deleting it is not required.

## Included skills

`assess`, `claim-extractor`, `connection-test`, `dashboard`, `knowledge-graph`,
`read-assessment`, `read-collection`, `stage-spec`.

## Maintainer verification and sources

The package's file integrity, skill count and MCP configuration are checked before
delivery. Import, installation and conversation delivery in a different private
account remain a recipient acceptance test.

The private archive creation route is supported by Plugin Creator's
`create_plugin` tool and its package workflow. General official documentation:

- Plugin creation: <https://learn.chatgpt.com/docs/build-plugins>
- Package structure and MCP declarations:
  <https://developers.openai.com/plugins/build/plugins>
- Imported MCP package designation:
  <https://learn.chatgpt.com/docs/enterprise/plugin-management#desktop-only-plugins>
