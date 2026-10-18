# Polariton website documentation materials

This folder contains Markdown source material for the Polariton documentation section of a future website. Copy the whole folder into the dedicated website project. It contains no application code, build configuration, or deployment tooling.

Publish the 14 pages below. This README describes their structure and is not a website page.

## Start here

- [Introduction](index.md)
- [Installation and overview](start/installation.md)
- [Getting started](start/getting-started.md)

## Guides

- [Research project structure](guides/research-projects.md)
- [Checkpoints and inheritance](guides/checkpoints.md)
- [Research provenance](guides/provenance.md)
- [Capabilities and environments](guides/tools.md)
- [Storage and backups](guides/storage.md)
- [Compare two research approaches](guides/research-example.md)

## Reference

- [Command line](reference/cli.md)
- [Capability and environment reference](reference/environments.md)
- [Architecture](reference/architecture.md)
- [Known limitations and troubleshooting](reference/limitations.md)
- [Compatibility and verification scope](reference/compatibility.md)

## Source and link conventions

The introduction and research tutorial are website-specific. The other pages come from the preparation repository’s README and corresponding public docs. Their text, headings, examples, and diagrams are preserved; only link destinations have changed to fit this layout. Installation retains the full repository README.

Links between included pages are relative. Contributor instructions, development and maintenance guides, security reporting, changelog, licenses, attribution, and tool-authoring resources link to the public GitHub repository instead of being copied here. Those external links currently target `main`.

## Website integration

Use the three groups above as the sidebar order, with Introduction first. Render Markdown and Mermaid diagrams, preserve heading anchors, and translate `.md` links into the website’s routes. Keep this folder separate from any unrelated personal website content.

Before publication, identify the source version being documented, check external links, and verify diagrams and page navigation in the chosen framework. Run the research tutorial through Polariton: its arithmetic has been checked, but the live walkthrough remains unverified.

Keep future edits to reused content aligned with the public documentation. This folder is a handoff of raw material, not an automated import or publishing system.
