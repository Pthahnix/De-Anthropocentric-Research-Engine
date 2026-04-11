import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { constraintInjection } from '../../src/tools/constraint-injection.js';

describe('constraintInjection', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should apply no-GPU constraint to a large-scale protein language model pretraining method and find creative workarounds', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      constraint: 'No GPU available — all computation must run on CPU-only hardware',
      brokenParts: [
        'Full model pretraining of a 650M-parameter ESM-2-scale protein language model: requires ~128 A100-GPU-days, completely infeasible on CPU',
        'Batch sizes needed for stable pretraining (typically 256-2048 sequences) cannot fit in CPU RAM for long sequences',
        'Mixed-precision training (BF16/FP16) acceleration is GPU-specific and unavailable on most CPUs',
        'Attention computation for sequences of length 512-1024 is already slow on GPU; on CPU the per-forward-pass time would increase 50-200x',
      ],
      workarounds: [
        {
          description: 'Use a pre-trained protein language model (ESM-2, ProtTrans) as a frozen feature extractor and train only a lightweight prediction head on CPU. The pretraining is done once on GPU by others; the adaptation is CPU-feasible.',
          creativity: 'straightforward' as const,
        },
        {
          description: 'Replace neural pretraining with evolutionary-statistics-based representations (BLOSUM embeddings, position-specific scoring matrices from MSA, coevolution statistics from EVcouplings). These require only CPU-scale linear algebra and capture much of the same biological signal.',
          creativity: 'clever' as const,
        },
        {
          description: 'Design a tokenization scheme that maps proteins to compact discrete codes (e.g., 20 amino acid types → 4-bit tokens via frequency encoding), then apply n-gram language modeling instead of neural LM. N-gram models train in minutes on CPU and capture local amino acid dependencies.',
          creativity: 'clever' as const,
        },
        {
          description: 'Reframe pretraining as a sparse dictionary learning problem: decompose protein sequences into overcomplete dictionaries of motifs using randomized SVD on k-mer frequency matrices. This is a CPU-native distributed linear algebra problem that could be parallelized across CPU cores.',
          creativity: 'radical' as const,
        },
      ],
      variants: [
        {
          title: 'CPU-Native Protein Representation via Evolutionary Statistics + Sparse Coding',
          description: 'Replace neural pretraining entirely with a two-stage CPU-native pipeline: (1) extract per-position evolutionary statistics from UniRef50 MSAs using HMM profiling (HMMER, CPU-native); (2) learn a sparse dictionary over these statistics using online dictionary learning (scikit-learn, CPU-native). The resulting representations are biologically grounded, interpretable, and trainable without any GPU.',
          mutationType: 'constraint_injection',
          explanation: 'The no-GPU constraint forces us to exploit the biological prior embedded in evolutionary conservation, which turns out to be a stronger inductive bias than self-supervised neural pretraining for many downstream tasks. This insight would not have emerged without the constraint.',
          noveltyEstimate: 'high' as const,
        },
        {
          title: 'Federated Protein Representation Learning Across CPU Clusters',
          description: 'Distribute the pretraining computation across a federation of CPU-only edge devices (lab workstations, cloud CPU VMs). Use federated averaging with gradient compression to train a shared representation model. Each device processes a protein family shard; the global model aggregates family-specific knowledge.',
          mutationType: 'constraint_injection',
          explanation: 'The GPU constraint reveals that protein family structure (natural data sharding) maps perfectly to federated learning topology — each participating lab trains on proteins from their area of expertise, creating a biologically meaningful federated curriculum.',
          noveltyEstimate: 'high' as const,
        },
      ],
      insightFromConstraint: 'The no-GPU constraint reveals that the original pretraining approach is deeply dependent on GPU-scale compute not for fundamental reasons but for engineering convenience. The biological signal in protein sequences (evolutionary conservation, coevolution, motif statistics) can be captured by CPU-native algorithms that are actually more interpretable and scientifically grounded than black-box neural pretraining. The constraint exposes a hidden assumption: that "more parameters = better representations" which may not hold for protein biology where domain knowledge is rich.',
      explanation: 'Injecting the no-GPU constraint completely breaks the core pretraining workflow (650M parameter training requires GPU), but forces creative alternatives that are arguably more scientifically interesting. The constraint reveals that protein biology has rich prior knowledge (evolutionary statistics, structural motifs) that can substitute for large-scale neural pretraining. The federated variant additionally reveals that the natural protein family structure is a perfect fit for federated learning topology.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await constraintInjection({
      idea: 'Large-scale protein language model pretraining on UniRef50 (135M sequences) using masked token prediction and next-sequence-in-family prediction objectives. Scale to 650M parameters (ESM-2 scale) with rotary position embeddings and flash attention for efficiency. Downstream: fine-tune for structure prediction, function annotation, and drug-target interaction.',
      constraint: 'No GPU available — all computation must run on CPU-only hardware',
      context: 'Academic lab with limited compute budget studying protein evolution. Has access to a 64-core CPU server and the full UniRef50 database. Needs protein representations for downstream tasks but cannot afford cloud GPU costs for large-scale pretraining.',
      _model: faux.getModel(),
    });

    expect(result.constraint).toBeTruthy();
    expect(result.brokenParts.length).toBeGreaterThanOrEqual(1);
    expect(result.workarounds.length).toBeGreaterThanOrEqual(1);
    expect(result.workarounds[0].description).toBeTruthy();
    expect(result.workarounds[0].creativity).toMatch(/straightforward|clever|radical/);
    expect(result.variants.length).toBeGreaterThanOrEqual(1);
    expect(result.variants[0].mutationType).toBe('constraint_injection');
    expect(result.variants[0].noveltyEstimate).toMatch(/low|medium|high/);
    expect(result.variants[0].title).toBeTruthy();
    expect(result.insightFromConstraint).toBeTruthy();
    expect(result.explanation).toBeTruthy();
  });
});
