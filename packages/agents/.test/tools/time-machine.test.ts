import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { timeMachine } from '../../src/tools/time-machine.js';

describe('timeMachine', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should project a drug discovery method 5 years into the future', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      direction: 'future' as const,
      years: 5,
      projectedChanges: [
        {
          domain: 'models' as const,
          change: 'Foundation models for molecular biology (AlphaFold4-scale) will be commoditized; every protein structure will be predictable in seconds. The bottleneck shifts from structure prediction to understanding dynamics and allostery.',
          impact: 'The proposed method\'s use of static crystal structures as binding site input will be insufficient — future drug discovery requires ensemble-aware binding prediction over conformational landscapes, not single-pose docking.',
        },
        {
          domain: 'data' as const,
          change: 'Ultra-large-scale experimental datasets will be available: CryoET atlases of cellular protein complexes at nanometer resolution, massively parallel binding assays (DEL + NGS) generating 10^9 affinity measurements per campaign.',
          impact: 'Models trained on current 10k-100k binding affinity datasets will be severely undertrained compared to methods that can leverage billion-point experimental datasets. Architecture choices need to scale to this data regime.',
        },
        {
          domain: 'compute' as const,
          change: 'Molecular dynamics simulation throughput will increase 100-1000x through GPU clusters and neural force fields (OpenMM + ML potentials). Microsecond-to-millisecond timescale simulations will be routine.',
          impact: 'Static docking methods will be replaced by dynamics-aware binding prediction that can account for induced fit and protein flexibility. Methods not incorporating dynamics will appear crude by 2031 standards.',
        },
        {
          domain: 'regulation' as const,
          change: 'FDA will require explainability reports for AI-assisted drug candidate selection. Black-box binding affinity predictions without mechanistic interpretability will face regulatory scrutiny.',
          impact: 'The proposed GNN architecture\'s predictions need interpretability hooks — which residues, which interaction types drive the predicted affinity — to satisfy regulatory requirements for AI-assisted decision-making in drug development.',
        },
        {
          domain: 'hardware' as const,
          change: 'Quantum computing will enter the NISQ+error correction era; quantum chemistry calculations for small molecules (<50 atoms) will be feasible. Classical approximations of quantum effects become less dominant.',
          impact: 'The Hamiltonian approximations underlying the GNN\'s quantum-mechanical features will be obsoleted for small fragment-sized molecules; the model needs an upgrade path to interface with quantum chemistry backends.',
        },
      ],
      variants: [
        {
          title: 'Dynamics-Aware Binding Prediction for the 2031 Landscape',
          description: 'Extend the GNN to operate over conformational ensembles (input: 10-100 AlphaFold ESMFOLD conformers per protein) with hierarchical pooling over ensemble members. Train on massively parallel DEL assay data (100M+ measurements). Include interpretability module that outputs per-residue contribution maps compatible with FDA explainability requirements.',
          mutationType: 'time_machine',
          explanation: 'Anticipates the shift from static to dynamic binding prediction, the availability of massive training data, and regulatory explainability requirements — all changes that will be standard by 2031.',
          noveltyEstimate: 'high' as const,
        },
        {
          title: 'Hybrid Quantum-Classical GNN for Sub-50-Atom Fragment Binding',
          description: 'For small molecule fragments (≤50 heavy atoms), interface the GNN with quantum chemistry backends (PySCF, future NISQ circuits) to replace approximate electronic structure features with exact quantum mechanical descriptors. For larger molecules, use the classical GNN pathway.',
          mutationType: 'time_machine',
          explanation: 'Anticipates that quantum hardware will enable exact QM calculations for fragment-sized molecules within 5 years, making classical Hamiltonian approximations a bottleneck for fragment-based drug discovery.',
          noveltyEstimate: 'high' as const,
        },
      ],
      mostFragileAssumption: 'That static crystal structures are adequate inputs for binding prediction. By 2031, the field will have routine access to conformational ensembles from cryo-ET and enhanced MD simulations, making single-pose docking appear as a severe approximation. A method that cannot handle conformational flexibility will be considered obsolete regardless of its current-state accuracy.',
      explanation: 'Projecting 5 years forward reveals that the proposed docking method is optimized for the 2024 data/compute landscape but will face three major headwinds by 2029-2031: (1) the shift from static to dynamics-aware binding prediction as conformational ensemble data becomes available; (2) the emergence of massive experimental training datasets that will make current 100k-datapoint training sets seem impoverished; and (3) regulatory requirements for interpretability in AI-assisted drug discovery. The method needs to be designed with these future demands in mind, or it risks becoming a solved problem before it achieves clinical impact.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await timeMachine({
      idea: 'Graph neural network for protein-ligand binding affinity prediction using quantum-mechanical features (partial charges, molecular orbitals approximated via extended Hückel theory) as node features, trained on PDBbind + BindingDB for virtual screening in drug discovery campaigns.',
      direction: 'future',
      years: 5,
      context: 'Drug discovery pipeline targeting kinase inhibitor design. The method is intended for hit-to-lead optimization where computational cost must be low enough to screen 1M candidates. Current state-of-the-art: FEP+ (accurate but expensive), Glide SP (fast but less accurate), DiffDock (fast learned docking).',
      _model: faux.getModel(),
    });

    expect(result.direction).toBe('future');
    expect(result.years).toBe(5);
    expect(result.projectedChanges.length).toBeGreaterThanOrEqual(1);
    expect(result.projectedChanges[0].domain).toMatch(/compute|data|models|regulation|hardware/);
    expect(result.projectedChanges[0].change).toBeTruthy();
    expect(result.projectedChanges[0].impact).toBeTruthy();
    expect(result.variants.length).toBeGreaterThanOrEqual(1);
    expect(result.variants[0].mutationType).toBe('time_machine');
    expect(result.variants[0].noveltyEstimate).toMatch(/low|medium|high/);
    expect(result.variants[0].title).toBeTruthy();
    expect(result.mostFragileAssumption).toBeTruthy();
    expect(result.explanation).toBeTruthy();
  });
});
