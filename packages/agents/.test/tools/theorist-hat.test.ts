import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { theoristHat } from '../../src/tools/theorist-hat.js';

describe('theoristHat', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should assess theoretical foundations of a novel GNN architecture for molecular property prediction', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      theoreticalFramework: 'Weisfeiler-Leman (WL) graph isomorphism hierarchy and its connections to message-passing neural networks (MPNNs). The 1-WL test provides the fundamental expressivity bound for standard GNNs; higher-order k-WL extensions characterize more expressive architectures. For molecular property prediction, relevant additional frameworks include PAC learning for structured inputs and VC dimension theory for function classes over graphs.',
      formalProperties: [
        {
          property: 'Expressivity at most k-WL for k-dimensional GNN variant',
          status: 'provable' as const,
          sketch: 'By direct construction: the neighborhood aggregation scheme maps to the k-WL color refinement algorithm. Two graphs indistinguishable by k-WL are also indistinguishable by the k-dimensional GNN. The converse (distinguishing all k-WL-distinguishable graphs) requires careful architectural choices and is architecture-specific.',
        },
        {
          property: 'Universal approximation of permutation-invariant functions over molecular graphs',
          status: 'conjectured' as const,
          sketch: 'Under sufficient depth and width with injective aggregation functions (à la Gin theorem), the model should be a universal approximator for permutation-invariant functions. However, the molecular-specific inductive biases (bond type encoding, 3D coordinates) complicate the standard proof; formal extension to 3D-equivariant cases is an active research area.',
        },
        {
          property: 'Sample complexity bound for learning binding affinity from molecular graphs',
          status: 'unknown' as const,
          sketch: 'No tight sample complexity bound exists for MPNN-class models on molecular property prediction. The VC dimension of the function class is not well-characterized because graphs of varying size make standard VC theory non-trivially applicable. Rademacher complexity bounds exist in principle but require bounded graph size assumptions.',
        },
        {
          property: 'Convergence of message-passing to fixed point under contraction mapping assumption',
          status: 'provable' as const,
          sketch: 'If the aggregation function is a contraction in the Wasserstein metric (sufficient condition: Lipschitz constant < 1), then iterative message-passing converges geometrically to a unique fixed-point representation. This can be enforced via spectral normalization of weight matrices.',
        },
      ],
      theoreticalGaps: [
        'No formal characterization of which molecular properties are theoretically learnable from 2D topology alone vs. requiring 3D geometry — there may exist properties fundamentally inaccessible to topology-only GNNs regardless of depth',
        'The generalization gap between training distribution (known drug-like molecules) and test distribution (novel scaffolds) lacks theoretical treatment; standard PAC bounds assume i.i.d. sampling which violates the scaffold-split evaluation protocol',
        'Information-theoretic lower bounds on what any GNN can learn about quantum mechanical properties from classical graph representations are not established',
        'The expressivity gap between equivariant GNNs (operating on 3D coordinates) and invariant GNNs (operating on distance matrices) is not formally characterized for molecular prediction tasks',
      ],
      formalizedVariants: [
        {
          title: 'Provably Expressive Molecular GNN via 3-WL Subgraph Counting',
          description: 'Augment message-passing with explicit subgraph counting (cycles, cliques, k-paths) to achieve 3-WL expressivity, with formal proof of distinguishing molecular isomers that 1-WL cannot separate, accompanied by a sample complexity analysis under the subgraph feature assumption.',
          mutationType: 'theorist_improvement',
          explanation: 'Replaces empirical expressivity claims with a formal 3-WL certificate and proves that specific molecular structural features (ring systems, branching patterns) map to the additional discriminative power.',
          noveltyEstimate: 'high' as const,
        },
        {
          title: 'PAC-Learnable Molecular Property Prediction with Distribution-Aware Bounds',
          description: 'Formalize the learning problem with a molecular distribution model (e.g., SMILES grammar prior), derive PAC bounds under scaffold-split evaluation, and design the GNN architecture to minimize the derived sample complexity.',
          mutationType: 'theorist_improvement',
          explanation: 'Establishes when and how the proposed method can be guaranteed to generalize to novel chemical space, replacing empirical generalization claims with formal PAC certificates.',
          noveltyEstimate: 'high' as const,
        },
      ],
      explanation: 'The architecture sits within the well-understood 1-WL expressivity framework of standard MPNNs. Its claimed advantages are likely empirical rather than expressivity-theoretic. The key theoretical question — whether the proposed attention mechanism achieves strictly higher expressivity than standard message-passing — is not addressed. Without this, the paper is an empirical contribution with unknown theoretical standing. The formal gaps around sample complexity and scaffold generalization are genuine open problems that could motivate a companion theory paper.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await theoristHat({
      idea: 'Attention-enhanced message-passing GNN for molecular property prediction that replaces sum aggregation with a learned attention mechanism over neighborhoods, weighted by learned edge features. Claims to better capture long-range dependencies in large molecules compared to standard MPNNs.',
      context: 'Computational chemistry and drug discovery. The architecture is evaluated on QM9 (quantum properties of small molecules) and MoleculeNet benchmarks. Competing methods include MPNN, SchNet, DimeNet, SphereNet, and Uni-Mol.',
      _model: faux.getModel(),
    });

    expect(result.theoreticalFramework).toBeTruthy();
    expect(result.formalProperties.length).toBeGreaterThanOrEqual(1);
    expect(result.formalProperties[0].property).toBeTruthy();
    expect(result.formalProperties[0].status).toMatch(/provable|conjectured|unknown|disproved/);
    expect(result.formalProperties[0].sketch).toBeTruthy();
    expect(result.theoreticalGaps.length).toBeGreaterThanOrEqual(1);
    expect(result.formalizedVariants.length).toBeGreaterThanOrEqual(1);
    expect(result.formalizedVariants[0].mutationType).toBe('theorist_improvement');
    expect(result.formalizedVariants[0].noveltyEstimate).toMatch(/low|medium|high/);
    expect(result.explanation).toBeTruthy();
  });
});
