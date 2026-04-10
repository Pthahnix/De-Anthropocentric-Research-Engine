import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { failureTaxonomy } from '../../src/tools/failure-taxonomy.js';

describe('failureTaxonomy', () => {
  let faux: ReturnType<typeof registerFauxProvider>;
  afterEach(() => { if (faux) faux.unregister(); });

  it('should categorize failures and generate targeted ideas', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      taxonomy: [
        {
          category: 'Flexible loop regions',
          rootCause: 'Loops have many degrees of freedom that rigid docking cannot handle',
          frequency: 'common' as const,
          impact: 'high' as const,
          examples: ['HIV protease flap region', 'Kinase activation loops'],
        },
        {
          category: 'Allosteric binding sites',
          rootCause: 'Most methods only dock to the known active site',
          frequency: 'common' as const,
          impact: 'high' as const,
          examples: ['GPCR allosteric modulation', 'p53-MDM2 PPI'],
        },
        {
          category: 'Metal coordination',
          rootCause: 'Force fields poorly model metal-ligand interactions',
          frequency: 'rare' as const,
          impact: 'medium' as const,
          examples: ['Zinc metalloproteases', 'Iron-containing enzymes'],
        },
      ],
      variants: [
        {
          title: 'Loop-aware docking with conformational ensemble from AlphaFold2',
          description: 'Generate loop conformational ensemble using AF2 with dropout at inference, dock against all conformations',
          mutationType: 'failure_taxonomy',
          addressesCategory: 'Flexible loop regions',
          explanation: 'Directly addresses the root cause: rigid loop assumption. AF2 provides cheap conformational sampling.',
          noveltyEstimate: 'high' as const,
        },
        {
          title: 'Blind docking with surface-based site discovery',
          description: 'Use 3D surface descriptors to detect all potential binding sites (including allosteric) before docking',
          mutationType: 'failure_taxonomy',
          addressesCategory: 'Allosteric binding sites',
          explanation: 'Addresses root cause by not limiting search to known active site',
          noveltyEstimate: 'medium' as const,
        },
      ],
      explanation: 'Two high-impact failure categories identified: flexible loops and allosteric sites.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await failureTaxonomy({
      failureCases: JSON.stringify([
        'Docking fails on HIV protease with open flap conformation',
        'Cannot find allosteric site on GPCR',
        'Poor scoring of zinc-coordinating ligands',
        'Incorrect ranking of flexible loop binding poses',
      ]),
      context: 'Known failure modes of molecular docking software.',
      _model: faux.getModel(),
    });

    expect(result.taxonomy.length).toBeGreaterThanOrEqual(2);
    expect(result.taxonomy[0].rootCause.length).toBeGreaterThan(10);
    expect(result.variants.length).toBeGreaterThanOrEqual(1);
    expect(result.variants[0].addressesCategory).toBeDefined();
    expect(result.variants[0].mutationType).toBe('failure_taxonomy');
    expect(result.explanation).toBeTruthy();
  });
});
