import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { methodEvolveCrossover } from '../../src/tools/method-evolve-crossover.js';

describe('methodEvolveCrossover', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should combine two methods into a hybrid and return structured crossover result', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      parentA: { name: 'SCAMPER Substitute', strength: 'Systematic component-level replacement', weakness: 'Limited to single-component changes' },
      parentB: { name: 'Analogical Transfer', strength: 'Cross-domain inspiration', weakness: 'Transfer quality varies' },
      fromA: 'Systematic component enumeration framework',
      fromB: 'Cross-domain source selection heuristics',
      integrationPoint: 'Use analogical reasoning to find replacement candidates instead of random selection',
      hybrid: {
        name: 'Analogical Substitution',
        fullProtocol: '1. Enumerate components (SCAMPER). 2. For each component, find analogous components from distant domains. 3. Evaluate substitution viability. 4. Generate variant.',
        expectedImprovement: 'Higher novelty than pure SCAMPER with more structure than pure analogical transfer',
      },
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await methodEvolveCrossover({
      methodA: '## SCAMPER Substitute\nReplace a component of the idea with something else.',
      methodB: '## Analogical Transfer\nFind an analog in a distant domain and transfer its structure.',
      trackRecords: 'SCAMPER: 5 uses, 2 high-novelty. Analogical: 3 uses, 1 high-novelty.',
      context: 'Drug discovery: generating novel molecular scaffold ideas',
      _model: faux.getModel(),
    });

    expect(result.parentA.name).toBeTruthy();
    expect(result.parentA.strength).toBeTruthy();
    expect(result.parentA.weakness).toBeTruthy();
    expect(result.parentB.name).toBeTruthy();
    expect(result.parentB.strength).toBeTruthy();
    expect(result.parentB.weakness).toBeTruthy();
    expect(result.fromA).toBeTruthy();
    expect(result.fromB).toBeTruthy();
    expect(result.integrationPoint).toBeTruthy();
    expect(result.hybrid.name).toBeTruthy();
    expect(result.hybrid.fullProtocol).toBeTruthy();
    expect(result.hybrid.expectedImprovement).toBeTruthy();
  });
});
