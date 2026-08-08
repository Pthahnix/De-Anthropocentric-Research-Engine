from pathlib import Path


PROMPT = Path(__file__).parents[1] / "skills" / "paper-fetch" / "prompt.md"


def test_direct_pdf_route_precedes_search_fallbacks_and_stops_on_failure():
    prompt = PROMPT.read_text(encoding="utf-8")
    direct = prompt.index("direct PDF")
    alphaxiv = prompt.index("### Step 2: alphaxiv")
    semantic_scholar = prompt.index("### Step 3: Semantic Scholar")
    biorxiv = prompt.index("### Step 4: bioRxiv / medRxiv")

    assert direct < alphaxiv
    assert direct < semantic_scholar
    assert direct < biorxiv
    assert "direct_pdf" in prompt
    assert "do not fall back" in prompt.lower()
    assert "not_found" in prompt


def test_already_supplied_sources_skip_search_but_still_land_and_index():
    prompt = PROMPT.read_text(encoding="utf-8")
    step1 = prompt.index("### Step 1:")
    alphaxiv = prompt.index("### Step 2: alphaxiv")
    step1_body = prompt[step1:alphaxiv]

    # local md/txt and local pdf are recognized alongside the direct PDF URL
    for channel in ("local_file", "local_pdf", "direct_pdf"):
        assert channel in step1_body

    # no search for any of them, and a bad path is not retried as a query
    assert "do not call alphaxiv" in step1_body.lower()
    assert "rather than searching for it" in step1_body

    # the landing step is NOT skipped — downstream SOPs need the section index
    assert "landing step still applies" in step1_body
    assert "source.meta.json" in step1_body or "indexed into" in step1_body
