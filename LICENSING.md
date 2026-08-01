# Licensing

Two licences, because this repository holds two kinds of thing.

## Apache-2.0 — the specifications and the tools

Applies to `system/`, `tools/`, and any code — **with one exception below**.

You may use, modify and redistribute them, including commercially, provided you keep the notice and state what you changed. The licence also grants patent rights and disclaims warranty, which is why it is preferred here over MIT for a specification others may build products on.

The canonical text is in [`LICENSE`](LICENSE).

## MIT — the rendering runtime

Applies to `system/atar-runtime/`.

That directory is the source of the `atar-runtime` npm package, which the artifacts load from a CDN at a pinned version. It is published under MIT and stays MIT here, so the copy in this repository and the package on npm carry the same terms. MIT is the more permissive of the two: it drops the patent grant and the state-your-changes requirement that Apache-2.0 adds.

## CC BY 4.0 — the documentation and the research record

Applies to `docs/` and `studies/`.

You may share and adapt them for any purpose, including commercially, **provided you give attribution**. For the research record that requirement is the point: the files are evidence for published claims, and a reader who reuses them should be able to trace them back.

Attribution as: Alef, Y., Shafriri, Y., *InSites: research record for the Tuba-Zangariyye significance assessment*, and the release DOI.

## What is not licensed here

**The three heritage documents assessed in the Tuba-Zangariyye study.** They are third-party works, they are not redistributed in this repository, and neither licence above extends to them. See [`studies/heritage4.0-tuba-2026/sources/README.md`](studies/heritage4.0-tuba-2026/sources/README.md).

**Quotations from those documents** appear in the transcript and the coding files at the extent needed to trace a claim to its passage. That use is quotation, not licensing, and it does not transfer with the CC BY grant.

**The site photograph** credited to B. Rothenberg, 1955, Meitar Collection, The Pritzker Family National Photography Collection, The National Library of Israel, is used in the paper under its own terms and is not part of this repository.
