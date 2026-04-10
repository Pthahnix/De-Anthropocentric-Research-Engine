import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { benchmarkSweep } from '../../src/tools/benchmark-sweep.js';

describe('benchmarkSweep', () => {
  let faux: ReturnType<typeof registerFauxProvider>;
  afterEach(() => { if (faux) faux.unregister(); });

  it('should analyze benchmarks and find cross-benchmark ideas', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      benchmarkAnalysis: [
        { benchmark: 'PDBbind v2020', currentSOTA: 'DiffDock, 38% success', bottleneck: 'Conformational flexibility', approaches: ['Ensemble docking', 'Flexible receptor modeling'] },
        { benchmark: 'CASF-2016', currentSOTA: 'Gnina, 0.78 correlation', bottleneck: 'Scoring function accuracy', approaches: ['ML-based scoring', 'Physics-ML hybrid'] },
      ],
      crossBenchmarkIdeas: [
        {
          title: 'Flexible receptor ensemble docking with hybrid scoring',
          description: 'Generate receptor conformational ensemble, dock against all, score with physics-ML hybrid function',
          mutationType: 'benchmark_sweep',
          benchmarksCovered: ['PDBbind v2020', 'CASF-2016'],
          explanation: 'Addresses both flexibility (PDBbind bottleneck) and scoring (CASF bottleneck) simultaneously',
          noveltyEstimate: 'medium' as const,
        },
      ],
      explanation: 'Both benchmarks share a common bottleneck: rigid receptor assumption.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await benchmarkSweep({
      benchmarks: JSON.stringify(['PDBbind v2020', 'CASF-2016', 'DUD-E']),
      context: 'Molecular docking benchmarks. Looking for ideas that improve across multiple.',
      _model: faux.getModel(),
    });

    expect(result.benchmarkAnalysis.length).toBeGreaterThanOrEqual(2);
    expect(result.crossBenchmarkIdeas.length).toBeGreaterThanOrEqual(1);
    expect(result.crossBenchmarkIdeas[0].benchmarksCovered.length).toBeGreaterThanOrEqual(2);
    expect(result.crossBenchmarkIdeas[0].mutationType).toBe('benchmark_sweep');
    expect(result.explanation).toBeTruthy();
  });
});
