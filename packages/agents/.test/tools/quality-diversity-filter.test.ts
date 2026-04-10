import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { qualityDiversityFilter } from '../../src/tools/quality-diversity-filter.js';

describe('qualityDiversityFilter', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should keep best idea per niche and remove duplicate (3 ideas, 2 niches, 1 removed)', async () => {
    faux = registerFauxProvider();

    const expected: import('../../src/tools/quality-diversity-filter.js').QdFilterResult = {
      filteredIdeas: [
        {
          idea: 'Use momentum-contrast (MoCo) with a dynamic queue to prevent representation collapse in self-supervised graph encoders',
          quality: { novelty: 8, feasibility: 7, evidence: 8, overall: 7.7 },
          niche: 'representation_collapse × contrastive_learning',
          kept: true,
          reason: 'Highest overall score in the representation_collapse × contrastive_learning niche; well-grounded in MoCo and GNN literature.',
        },
        {
          idea: 'Apply SimSiam-style stop-gradient to graph autoencoders to mitigate dimensional collapse without negative pairs',
          quality: { novelty: 6, feasibility: 8, evidence: 6, overall: 6.6 },
          niche: 'representation_collapse × contrastive_learning',
          kept: false,
          reason: 'Same niche as the MoCo idea but lower overall score (6.6 vs 7.7); removed by MAP-Elites selection.',
        },
        {
          idea: 'Introduce adaptive graph rewiring guided by Ricci curvature to alleviate over-squashing in long-range message passing',
          quality: { novelty: 9, feasibility: 6, evidence: 7, overall: 7.5 },
          niche: 'over_squashing × graph_topology',
          kept: true,
          reason: 'Sole occupant of the over_squashing × graph_topology niche; high novelty (9) justifies inclusion despite moderate feasibility.',
        },
      ],
      removedCount: 1,
      nicheMap: {
        'representation_collapse × contrastive_learning': 'MoCo dynamic queue for graph encoder collapse',
        'over_squashing × graph_topology': 'Ricci curvature adaptive rewiring',
      },
      reasoning:
        'Three ideas span two niches. In the contrastive_learning niche, MoCo outscores SimSiam overall (7.7 vs 6.6), so SimSiam is removed. The Ricci curvature idea occupies a distinct topology niche with no competitors, achieving high novelty. The filtered set covers two complementary directions — representation stability and graph topology — providing maximum diversity across the identified gaps.',
    };

    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(expected))])]);

    const ideas = JSON.stringify([
      'Use momentum-contrast (MoCo) with a dynamic queue to prevent representation collapse in self-supervised graph encoders',
      'Apply SimSiam-style stop-gradient to graph autoencoders to mitigate dimensional collapse without negative pairs',
      'Introduce adaptive graph rewiring guided by Ricci curvature to alleviate over-squashing in long-range message passing',
    ]);

    const gaps = JSON.stringify([
      'Self-supervised GNN encoders suffer representation collapse when trained without negative pairs',
      'Long-range dependencies in graphs are lost due to over-squashing in standard message-passing networks',
    ]);

    const result = await qualityDiversityFilter({
      ideas,
      gaps,
      _model: faux.getModel(),
    });

    // Structural checks
    expect(result.filteredIdeas).toHaveLength(3);
    expect(result.removedCount).toBe(1);
    expect(Object.keys(result.nicheMap)).toHaveLength(2);
    expect(result.reasoning.length).toBeGreaterThan(20);

    // MAP-Elites correctness: exactly 2 kept, 1 removed
    const keptIdeas = result.filteredIdeas.filter((i) => i.kept);
    const removedIdeas = result.filteredIdeas.filter((i) => !i.kept);
    expect(keptIdeas).toHaveLength(2);
    expect(removedIdeas).toHaveLength(1);

    // The removed idea must share a niche with a kept idea
    const removedNiche = removedIdeas[0].niche;
    const keptNiches = keptIdeas.map((i) => i.niche);
    expect(keptNiches).toContain(removedNiche);

    // Quality scores are in valid range
    for (const item of result.filteredIdeas) {
      expect(item.quality.novelty).toBeGreaterThanOrEqual(0);
      expect(item.quality.novelty).toBeLessThanOrEqual(10);
      expect(item.quality.feasibility).toBeGreaterThanOrEqual(0);
      expect(item.quality.feasibility).toBeLessThanOrEqual(10);
      expect(item.quality.evidence).toBeGreaterThanOrEqual(0);
      expect(item.quality.evidence).toBeLessThanOrEqual(10);
      expect(item.quality.overall).toBeGreaterThanOrEqual(0);
      expect(item.quality.overall).toBeLessThanOrEqual(10);
    }

    // Each kept idea appears in nicheMap
    for (const kept of keptIdeas) {
      expect(result.nicheMap[kept.niche]).toBeDefined();
    }
  });
});
