# atar-runtime changes

## 0.3.8 — published 2026-10-07

- Separate unclassified KG nodes from inferred/interpretive labels and counts; retain original value labels and approved display mappings.
- Count unknown collection values separately from explicit absence.
- Keep undated timeline records in their own list and unknown change types neutral.
- Show missing/nonstandard integrity ratings without a medium-rating default.
- Validate IDs, graph endpoints and tab definitions before rendering; show escaped, readable errors.
- Add an English/Chinese or Hebrew in-view status and an asynchronous `ready` result. Failed D3 loading/static fallback is an error, not successful interactive rendering.
- Preserve custom-tab support and existing Hebrew KG/dashboard controls.

Validation: build and syntax check; existing Hebrew smoke test; nine compatibility test groups covering evidence status, missing dates/ratings, input preservation, validation, async readiness, D3 failure/timeout and Hebrew notices. These are jsdom tests, not real-browser screenshots.

`npm run qa:compat` needs a local D3 7.9.0 fixture. Set `ATAR_QA_D3_PATH` to its path, or use the existing ignored `.agents/deepseek-v11.4/d3.js` fixture. Tests do not contact a CDN.

Pins: Claude v11.5, Gemini v11.4 and GPT v11.4 (English and Hebrew) pin **0.3.8**. DeepSeek V2 remains on 0.3.7 until its adapter is removed. Claude 11.4 and historical study versions remain unchanged.
