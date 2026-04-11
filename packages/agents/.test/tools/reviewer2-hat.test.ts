import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { reviewer2Hat } from '../../src/tools/reviewer2-hat.js';

describe('reviewer2Hat', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should find fatal flaws and generate improved variants for a GNN docking method', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      critiques: [
        {
          category: 'evaluation' as const,
          severity: 'fatal' as const,
          critique: 'No comparison to DiffDock, the current state-of-the-art diffusion-based docking method, makes it impossible to assess whether the GNN approach offers any improvement over the best existing methods.',
          suggestion: 'Add DiffDock, EquiBind, and TANKBind as baselines; reproduce their results on the same train/test split before claiming superiority.',
        },
        {
          category: 'methodology' as const,
          severity: 'major' as const,
          critique: 'The message-passing architecture processes protein-ligand interactions locally but cannot capture long-range allosteric effects that influence binding. The receptive field is fundamentally limited by graph depth.',
          suggestion: 'Incorporate global attention or hierarchical pooling to capture long-range interactions; or explicitly model allosteric communication channels.',
        },
        {
          category: 'novelty' as const,
          severity: 'major' as const,
          critique: 'SE(3)-equivariant GNNs for docking have been explored in DiffDock, Uni-Mol, and multiple concurrent papers. The claimed novelty of "graph-based pose prediction" is not well-differentiated from this crowded subfield.',
          suggestion: 'Clearly articulate what makes this approach distinct — if it is speed, prove it with timing benchmarks; if it is accuracy, show head-to-head comparisons.',
        },
        {
          category: 'significance' as const,
          severity: 'minor' as const,
          critique: 'Evaluation only on CASF-2016 benchmark, which has known issues with test set overlap with PDBbind training data.',
          suggestion: 'Add a recent time-split evaluation on complexes deposited after 2020 to assess generalization to truly novel targets.',
        },
      ],
      fatalFlaw: 'The absence of DiffDock baseline comparison is the single most damaging omission. Without it, reviewers cannot determine whether 3 years of progress in diffusion-based docking has already solved the problem this paper claims to address.',
      improvedVariants: [
        {
          title: 'Hybrid GNN-Diffusion Docking with Full Baseline Suite',
          description: 'Combine the proposed GNN encoder with a lightweight diffusion-based pose refinement step, evaluated against DiffDock, EquiBind, TANKBind, and Uni-Mol on both CASF-2016 and a 2022+ time-split benchmark.',
          mutationType: 'reviewer2_improvement',
          explanation: 'Addresses the fatal flaw by including DiffDock comparison, and strengthens novelty by showing the GNN+diffusion hybrid is complementary rather than competing.',
          noveltyEstimate: 'high' as const,
        },
        {
          title: 'GNN Docking with Allosteric Communication Modeling',
          description: 'Extend the GNN to explicitly model long-range allosteric pathways using elastic network models as a prior, enabling it to capture conformational changes missing from local message-passing.',
          mutationType: 'reviewer2_improvement',
          explanation: 'Addresses the major methodology critique about limited receptive field by providing a principled way to capture non-local effects.',
          noveltyEstimate: 'high' as const,
        },
      ],
      overallAssessment: 'Reject. The paper presents interesting graph-based machinery but fails to compare against DiffDock, the obvious state-of-the-art baseline. This omission alone would likely cause a desk reject at top venues. Significant revision required with comprehensive baselines before this can be considered for publication.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await reviewer2Hat({
      idea: 'SE(3)-equivariant graph neural network for protein-ligand docking that represents protein-ligand complexes as heterogeneous graphs and uses message passing to predict binding poses directly, achieving sub-2Å RMSD on CASF-2016.',
      context: 'Drug discovery pipeline at a biotech company. The team needs fast, accurate docking for virtual screening of 10M compound libraries. Prior work includes traditional methods (AutoDock Vina, Glide) and recent learned methods (EquiBind, TANKBind). DiffDock was published 6 months ago.',
      _model: faux.getModel(),
    });

    expect(result.critiques).toBeTruthy();
    expect(result.critiques.length).toBeGreaterThanOrEqual(1);
    expect(result.critiques[0].category).toMatch(/methodology|novelty|significance|evaluation|clarity/);
    expect(result.critiques[0].severity).toMatch(/minor|major|fatal/);
    expect(result.critiques[0].critique).toBeTruthy();
    expect(result.critiques[0].suggestion).toBeTruthy();
    expect(result.critiques.some(c => c.severity === 'fatal')).toBe(true);
    expect(result.fatalFlaw).toBeTruthy();
    expect(result.fatalFlaw.length).toBeGreaterThan(10);
    expect(result.improvedVariants.length).toBeGreaterThanOrEqual(1);
    expect(result.improvedVariants[0].mutationType).toBe('reviewer2_improvement');
    expect(result.improvedVariants[0].noveltyEstimate).toMatch(/low|medium|high/);
    expect(result.improvedVariants[0].title).toBeTruthy();
    expect(result.improvedVariants[0].description).toBeTruthy();
    expect(result.overallAssessment).toBeTruthy();
  });
});
