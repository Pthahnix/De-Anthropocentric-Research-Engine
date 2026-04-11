import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { methodProblemMatrix } from '../../src/tools/method-problem-matrix.js';

describe('methodProblemMatrix', () => {
  let faux: ReturnType<typeof registerFauxProvider>;
  afterEach(() => { if (faux) faux.unregister(); });

  it('should enumerate matrix and find unexplored cells', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      matrix: [
        { method: 'GNN', problem: 'Binding affinity', status: 'explored' as const, existingWork: 'SchNet, DimeNet', feasibility: 'high' as const },
        { method: 'GNN', problem: 'Solubility', status: 'explored' as const, existingWork: 'MPNN-based models', feasibility: 'high' as const },
        { method: 'Diffusion', problem: 'Binding affinity', status: 'explored' as const, existingWork: 'DiffDock', feasibility: 'high' as const },
        { method: 'Diffusion', problem: 'Solubility', status: 'unexplored' as const, existingWork: null, feasibility: 'medium' as const },
        { method: 'Transformer', problem: 'Binding affinity', status: 'partially_explored' as const, existingWork: 'Limited work on sequence-based', feasibility: 'high' as const },
        { method: 'Transformer', problem: 'Solubility', status: 'explored' as const, existingWork: 'ChemBERTa', feasibility: 'high' as const },
      ],
      unexploredOpportunities: [
        {
          method: 'Diffusion',
          problem: 'Solubility',
          title: 'Diffusion-based molecular generation optimized for solubility',
          description: 'Use diffusion generative model conditioned on target solubility range to generate novel molecules',
          mutationType: 'method_problem_matrix',
          explanation: 'Diffusion models have succeeded for binding but never been applied to solubility prediction/optimization',
          noveltyEstimate: 'high' as const,
        },
      ],
      explanation: 'Matrix reveals Diffusion × Solubility as a completely unexplored cell.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await methodProblemMatrix({
      methods: JSON.stringify(['GNN', 'Diffusion', 'Transformer']),
      problems: JSON.stringify(['Binding affinity', 'Solubility']),
      context: 'Drug discovery. Looking for unexplored method-problem combinations.',
      _model: faux.getModel(),
    });

    expect(result.matrix.length).toBeGreaterThanOrEqual(4);
    expect(result.unexploredOpportunities.length).toBeGreaterThanOrEqual(1);
    expect(result.matrix.some(c => c.status === 'unexplored')).toBe(true);
    expect(result.unexploredOpportunities[0].mutationType).toBe('method_problem_matrix');
    expect(result.explanation).toBeTruthy();
  });
});
