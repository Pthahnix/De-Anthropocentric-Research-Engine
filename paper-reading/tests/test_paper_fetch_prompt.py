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
    assert "source_channel: direct_pdf" in prompt
    assert "do not fall back" in prompt.lower()
    assert "not_found" in prompt
