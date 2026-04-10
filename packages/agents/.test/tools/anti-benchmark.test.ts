import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { antiBenchmark } from '../../src/tools/anti-benchmark.js';

describe('antiBenchmark', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should challenge benchmark assumptions and propose alternatives', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      benchmark: 'PDBbind v2020',
      statedPurpose: 'Evaluate protein-ligand binding affinity prediction accuracy',
      challengedAssumptions: [
        {
          assumption: 'Crystal structures represent biologically relevant binding poses',
          challenge: 'Crystal packing forces may distort binding geometry; solution-phase structures can differ significantly',
          evidence: 'NMR vs crystal structure discrepancies documented for >30% of protein-ligand complexes in comparative studies',
          severity: 'significant' as const,
        },
        {
          assumption: 'Experimental binding affinity values are accurate and comparable ground truth',
          challenge: 'Different assay types (ITC, SPR, fluorescence polarization) can disagree by >1 log unit for the same complex',
          evidence: 'BindingDB shows 0.5-2.0 log unit variance across assay types for identical protein-ligand pairs',
          severity: 'fundamental' as const,
        },
        {
          assumption: 'Random splits produce fair train/test evaluation',
          challenge: 'Protein family leakage between train and test sets inflates apparent performance',
          evidence: 'Time-split and scaffold-split evaluations show 30-50% performance drops vs random splits',
          severity: 'significant' as const,
        },
      ],
      variants: [
        {
          title: 'Assay-aware binding affinity prediction with uncertainty quantification',
          description: 'Condition the prediction model on assay type and experimental conditions, outputting assay-specific affinity distributions instead of point estimates',
          mutationType: 'anti_benchmark',
          explanation: 'Challenging the "single ground truth" assumption reveals that assay-specific prediction with calibrated uncertainty is more scientifically valid than predicting a single pKd',
          noveltyEstimate: 'high' as const,
        },
        {
          title: 'Temporal-split benchmark for realistic virtual screening evaluation',
          description: 'Replace random splitting with temporal splitting (train on pre-2018 data, test on post-2018 data) to simulate prospective virtual screening campaigns',
          mutationType: 'anti_benchmark',
          explanation: 'Challenging the random split assumption exposes that real-world performance is much lower than benchmarks suggest',
          noveltyEstimate: 'medium' as const,
        },
      ],
      proposedAlternative: 'Multi-assay binding benchmark with uncertainty estimates per data point, temporal splits, and protein family-aware stratification to prevent leakage',
      explanation: 'PDBbind conflates multiple sources of experimental uncertainty into a single ground truth label, uses random splits that allow protein family leakage, and assumes crystal poses are biologically relevant. A fair benchmark needs assay-aware labels, temporal splits, and family-stratified evaluation.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await antiBenchmark({
      benchmark: 'PDBbind v2020 for protein-ligand binding affinity prediction',
      context: 'Drug discovery community relies heavily on PDBbind for evaluating docking and scoring methods. Recent work questions whether benchmark performance translates to real-world virtual screening success.',
      _model: faux.getModel(),
    });

    expect(result.benchmark).toBeTruthy();
    expect(result.statedPurpose).toBeTruthy();
    expect(result.challengedAssumptions.length).toBeGreaterThan(0);
    expect(result.challengedAssumptions[0].severity).toMatch(/minor|significant|fundamental/);
    expect(result.challengedAssumptions.some(a => a.severity === 'fundamental' || a.severity === 'significant')).toBe(true);
    expect(result.variants.length).toBeGreaterThanOrEqual(1);
    expect(result.variants[0].mutationType).toBe('anti_benchmark');
    expect(result.variants[0].noveltyEstimate).toMatch(/low|medium|high/);
    expect(result.proposedAlternative).toBeTruthy();
    expect(result.proposedAlternative.length).toBeGreaterThan(10);
    expect(result.explanation).toBeTruthy();
  });
});
