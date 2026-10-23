// Integration substitutions only. Original methodology modules stay untouched.
function replace(text, expression, replacement, id) {
  if (!expression.test(text)) throw new Error(`Adapter anchor missing: ${id}`);
  return text.replace(expression, replacement);
}
const rendering = (type, section) => `### ${section}. Rendering through the InSites MCP App\n\nCall \`render_insites\` with \`approved: true\` and the faithful approved \`DATA\` projection (\`type: '${type}'\`). Read \`references/data-contract.md\` for field shapes. The server validates the data and mounts pinned \`atar-runtime\` 0.3.8 in the MCP App. Do not emit a React shell, renderer, chart engine or model API call. The adapter sends questions and view context to this conversation using the MCP Apps host message channel. Answer here under the core epistemic rules and existing approval gate; do not advance a stage. Report validation or load failures and ask for the missing evidence instead of inventing content.\n\n`;

export function transform(id, source) {
  let text = source.replaceAll('\r\n', '\n');
  text = text.replace(/> \*\*Cross-platform reference\*\*:[^\n]*\n/g, '> **Visual reference**: Visual tokens and entity categories are documented in the bundled runtime contract.\n');
  if (id === '00-core-system') {
    text = replace(text, /- version: v11\.5[^\n]*/, '- version: v11.5 (runtime-0.3.8, participant-facing-labels)', id);
    text = text.replace('## System Prompt:', '## System Specification:').replace('**React artifacts**', '**MCP App views**');
    text = replace(text, /\*\*Artifact JS safety[^\n]+/, '**MCP display safety**: Send faithful approved DATA to `render_insites`; do not author rendering code or run a separate AI model. Custom tab HTML is sanitized by the server; no script, iframe, event handlers or external embedded code are allowed.', id);
    text = text.replace(/artifact/g, 'visual product').replace(/Artifact/g, 'Visual product');
  }
  if (id === '01-spec-command') text = text.replace("Create it as an editable Markdown document artifact. After the user edits it, offer to download the artifact's current version.", 'Deliver editable Markdown text, and a downloadable Markdown file when file creation is available. After a revision, offer the revised file.');
  if (id === '30-continuity') text = replace(text, /### Heavy-turn pre-flight[\s\S]*$/, '### Visual-product pre-flight\n\nBefore a graph or dashboard, offer a Resume Capsule first if the user wishes to save progress. Do not claim access to the remaining quota or propose model-specific usage estimates. Skip the offer if the user already asked to generate the product immediately.\n', id);
  if (id === '41-ca-kg') {
    text = replace(text, /> \*\*Platform note[^\n]+/, '> **Rendering**: Use `render_insites` after approval. The pinned runtime owns the graph; the adapter delivers questions into this conversation.', id);
    text = replace(text, /### 1\. Trigger and Artifact Enforcement[\s\S]*?(?=### 2\.)/, '### 1. Trigger and Rendering Enforcement\n\n- Execute only on an explicit Knowledge Graph request.\n- Call `render_insites`; no surrounding prose is required on success. Explain tool errors in chat.\n- Do not generate an alternative renderer or one-off model call.\n\n', id);
    text = replace(text, /### 4\. Artifact[\s\S]*?(?=### 5\.)/, rendering('kg', 4), id);
    text = text.replace(/Place the projected graph[^\n]+/, "Send the projected graph as the tool's `data` argument (`type: 'kg'`). See the bundled data contract. RTL is detected by the runtime.");
  }
  if (id === '42-ca-db-f') text = replace(text, /### Rendering[\s\S]*$/, '### Rendering through the InSites MCP App\n\nThe exclusive renderer is pinned `atar-runtime` 0.3.8 mounted by `render_insites`. Only assemble faithful approved DATA; never create an alternative rendering engine or AI backend. No browser persistence. Dynamic tabs of type table/cards/matrix/prose/custom carry approved readings; custom HTML is sanitized and cannot execute scripts, event handlers or iframes. The UI forwards questions and view context into this conversation. Read `references/data-contract.md`. Report a failed load as a finding.\n', id);
  if (id === '43-ca-db' || id === '53-ca-db-c') {
    const section = id === '43-ca-db' ? 4 : 3;
    text = replace(text, new RegExp(`### ${section}\\. Artifact[\\s\\S]*?(?=### ${section + 1}\\.)`), rendering(id === '43-ca-db' ? 'assessment' : 'collection', section), id);
    text = replace(text, /- \*\*Format\*\*:[^\n]+/, '- **Format**: call `render_insites` with approved DATA. The MCP App owns rendering and conversation delivery.', id);
    text = text.replace(/a live \*\*AI Query\*\* tab[^\n]+/, 'an **AI Query** tab that sends its question and view context into this conversation.');
  }
  if (['41-ca-kg', '43-ca-db', '53-ca-db-c'].includes(id)) {
    text = text.replace(/1\. \*\*Output\*\*:[^\n]+/, '1. **Output**: call `render_insites` with approved DATA; no surrounding prose on success. Explain errors in chat. Runtime pinned at 0.3.8.');
    text = text.replace('Respond **only** with the artifact (no surrounding prose).', 'Call the rendering tool; no surrounding prose on success. Explain failures in chat.');
  }
  if (id === '51-ma-ra') text = text.replace('generate Timeline artifact.', 'offer a timeline view through the assessment dashboard, preserving the approved events; generate only on acceptance.');
  if (id === '52-ma-rc') text = replace(text, /\*\*What it is\*\*:[^\n]+/, '**What it is**: when code execution is available, parse the uploaded tabular file and compute exact counts. On request, create a downloadable workbook when supported; otherwise provide CSV or structured JSON. If execution is unavailable, state that the figures were not computed and do not present estimates as verified counts.', id);
  if (id === '99-end-marker') text = 'END OF INSITES SPECIFICATION\n';
  text = text.replaceAll('GPT/Claude key aliases', 'supported key aliases').replaceAll('in-prompt', 'in the specification').replaceAll('in this prompt', 'in this specification');
  if (/window\.claude|Sonnet|GPT\/Gemini cannot|cross-platform-parity/.test(text)) throw new Error(`Unadapted integration text in ${id}`);
  return text;
}
