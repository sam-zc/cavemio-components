# Domain glossary

Use these names in architecture discussions and documentation. They describe existing concepts, not new runtime abstractions.

| Term                       | Meaning                                                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Canonical source           | Authored reusable React source in `registry/components/`; the source used by previews and installation                    |
| Registry item              | One installable definition in `registry.json`, including its source files, local helpers, dependencies, CSS, and metadata |
| Installed source           | Editable files copied into a consumer using that consumer's configured aliases                                            |
| Consumer                   | A separate application receiving installed source; it owns application state and integration callbacks                    |
| Catalog                    | Versioned HTTP discovery document describing registry items and preview/install locations                                 |
| Primary source fingerprint | `sourceSha256`: SHA-256 of the first installed source file, not of every helper or dependency                             |
| Preview                    | Demo composition importing canonical source; Storybook and static HTTP previews are two delivery paths                    |
| Prompt history             | Edited user messages and their branches, browsed through Message Edit                                                     |
| Response history           | Regenerated assistant answers for one prompt, browsed through Response Versions                                           |
| Presentation geometry      | The dimensions/positions visible now, including an in-flight animation                                                    |
| Transition identity        | A particular entry/exit instance; distinct from the logical history index when navigation repeats                         |
| Isolated install case      | A fresh consumer receiving only one registry item, so earlier items cannot supply missing requirements                    |
| Coexistence case           | A fresh consumer receiving multiple items to verify their combined installation                                           |

Architecture vocabulary: a **module** combines an **interface** and an **implementation**. Its **depth** is the useful behavior available through that interface. A **seam** is where behavior can vary through the interface; an **adapter** fills that role. **Leverage** is the capability callers gain; **locality** is the concentration of change and verification. More files do not inherently create more depth.
