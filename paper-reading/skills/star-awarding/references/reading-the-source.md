# Reading the Source

Every reading SOP in this package receives two paths from `paper-fetch`
rather than the paper's text:

- **source_path** — the paper as fetched, e.g.
  `context/papers/2026-08-07-23-01-kimi-k3-scaling/source.md`
- **meta_path** — its companion index, e.g.
  `context/papers/2026-08-07-23-01-kimi-k3-scaling/source.meta.json`

## Read the index first

`source.meta.json` looks like this:

```json
{
  "identifier": "arXiv:2607.24653",
  "title": "the paper's title as retrieved",
  "title_slug": "the-slug",
  "source_channel": "alphaxiv",
  "source_url": "https://...",
  "fetched_at": "2026-08-07T23:01",
  "total_lines": 1240,
  "sections": {
    "abstract": [12, 34],
    "1 introduction": [36, 118],
    "3 method": [200, 445],
    "6 conclusion": [890, 920]
  },
  "figure_captions": [145, 203, 288, 402]
}
```

- `sections` keys are the paper's own headings, lowercased, in document
  order. Values are `[first_line, last_line]`, 1-indexed and inclusive.
- `figure_captions` is a flat list of line numbers, not ranges — captions
  are scattered rather than contiguous.

The index is small. Always read it in full before touching `source.md`.

## Then read only what your task needs

Use your file-reading tool's offset and limit parameters against
`source_path`. To read `3 method` from the example above: offset 200, limit
246 (`445 - 200 + 1`).

If your SOP's own prompt names the sections it needs, read those and stop.
Reading the whole paper when you were told to read two sections is not
thoroughness — it defeats the reason this contract exists, and for some SOPs
it breaks a methodological constraint (`first-pass-skim` is defined by *not*
reading section bodies).

## Matching section names

Heading text varies between papers: `3 method`, `methods`, `3 our approach`,
`methodology`. Match on meaning, not string equality. If a section your
prompt asks for "method" and the paper calls it `3 our approach`, that is the
section you want.

If a section your prompt names genuinely has no counterpart in this paper,
say so explicitly in your output. Do not silently substitute a different
section, and do not fall back to reading everything.

## When the index is unusable

If `sections` is `{}` or the file carries `"index_reliable": false`, the
paper's heading structure could not be indexed. Read `source.md` in full and
say in your output that you did so because the index was unavailable. This
is a documented degradation path, not an error to work around silently.

## Never quote what you did not read

Every quote you produce must come from a range you actually read from
`source.md`. Do not reconstruct a quote from memory of the paper, and do not
paraphrase and present it as a quote. If you need a verbatim quote from a
section you did not read, read that section first.
