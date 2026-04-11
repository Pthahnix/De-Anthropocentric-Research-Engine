import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { methodEvolveMutate } from '../../src/tools/method-evolve-mutate.js';

describe('methodEvolveMutate', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should mutate a method and return structured mutation result', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      originalMethod: 'SCAMPER Substitute',
      coreStrength: 'Systematic component replacement',
      knownWeakness: 'Often produces incremental rather than radical changes',
      aspectMutated: 'replacement scope',
      originalValue: 'single component replacement',
      mutatedValue: 'multi-component simultaneous replacement',
      predictedEffect: 'improvement',
      mutatedMethod: {
        name: 'SCAMPER Multi-Substitute',
        fullProtocol: 'Instead of replacing one component at a time, identify 2-3 tightly coupled components and replace them simultaneously with alternatives from a different paradigm.',
      },
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await methodEvolveMutate({
      method: '## SCAMPER Substitute\nReplace a component of the idea with something else.',
      trackRecord: 'Used 5 times. Generated 2 high-novelty ideas. Tends toward incremental variants.',
      context: 'Drug discovery: generating novel molecular scaffold ideas',
      _model: faux.getModel(),
    });

    expect(result.originalMethod).toBeTruthy();
    expect(result.coreStrength).toBeTruthy();
    expect(result.knownWeakness).toBeTruthy();
    expect(result.aspectMutated).toBeTruthy();
    expect(result.originalValue).toBeTruthy();
    expect(result.mutatedValue).toBeTruthy();
    expect(result.predictedEffect).toMatch(/improvement|degradation|uncertain/);
    expect(result.mutatedMethod.name).toBeTruthy();
    expect(result.mutatedMethod.fullProtocol).toBeTruthy();
  });
});
