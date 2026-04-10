import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { analogicalTransfer } from '../../src/tools/analogical-transfer.js';

describe('analogicalTransfer', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should generate analogical transfer variants from source to target domain', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      sourcePrinciple: 'Evolutionary algorithms use mutation + selection to explore solution spaces by iteratively perturbing candidate solutions and retaining those with higher fitness',
      abstractedPrinciple: 'Iterative perturbation of candidates followed by fitness-based selection — stochastic search with memory of the best solutions found so far',
      transferPath: 'Apply mutation operators to molecular scaffolds; use binding affinity as fitness signal; retain top-K molecules each generation for the next perturbation round',
      variants: [
        {
          title: 'Evolutionary scaffold hopping via GNN-guided mutations',
          description: 'Treat molecular scaffolds as genomes; apply GNN-predicted mutation probabilities to guide substitution toward higher predicted affinity; select top-K each generation',
          mutationType: 'analogical_transfer',
          explanation: 'Natural transfer: evolutionary fitness maps to binding affinity, mutation operators map to chemical transformations, population maps to scaffold library',
          noveltyEstimate: 'medium' as const,
        },
        {
          title: 'Multi-objective evolutionary drug design with Pareto selection',
          description: 'Use NSGA-II multi-objective evolution to optimize binding affinity, synthetic accessibility, and ADMET properties simultaneously',
          mutationType: 'analogical_transfer',
          explanation: 'Extends the analogy by borrowing multi-objective evolutionary search from engineering optimization into multi-property drug design',
          noveltyEstimate: 'high' as const,
        },
      ],
      transferQuality: 'natural' as const,
      explanation: 'Natural analogy between evolutionary search and molecular design: the combinatorial space of molecules mirrors the search landscape, and fitness evaluation via docking mirrors the fitness function. Minimal conceptual stretching required.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await analogicalTransfer({
      sourceDomain: 'Evolutionary algorithms: genetic algorithms and evolution strategies use populations of candidate solutions, mutation/crossover operators, and fitness-based selection to explore complex solution spaces.',
      targetProblem: 'De novo molecular design: generate novel drug-like molecules with high binding affinity to a target protein, subject to synthetic accessibility and ADMET constraints.',
      context: 'Research on AI-driven drug discovery. Domain: ML for computational chemistry and molecular generation.',
      _model: faux.getModel(),
    });

    expect(result.sourcePrinciple).toBeTruthy();
    expect(result.abstractedPrinciple).toBeTruthy();
    expect(result.transferPath).toBeTruthy();
    expect(result.variants.length).toBeGreaterThanOrEqual(1);
    expect(result.variants[0].mutationType).toBe('analogical_transfer');
    expect(result.variants[0].noveltyEstimate).toMatch(/low|medium|high/);
    expect(result.transferQuality).toMatch(/forced|natural|deep/);
    expect(result.explanation).toBeTruthy();
  });
});
