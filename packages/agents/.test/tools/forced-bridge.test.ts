import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { forcedBridge } from '../../src/tools/forced-bridge.js';

describe('forcedBridge', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should force connections between unrelated techniques and generate hybrid variants', async () => {
    faux = registerFauxProvider();
    const mockResult = {
      techniqueASummary: 'Dropout randomly zeroes neuron activations at training time with probability p, acting as a regularizer that prevents co-adaptation of features and approximates an ensemble of exponentially many sub-networks',
      techniqueBSummary: 'Contrastive learning maximizes agreement between two augmented views of the same sample (positive pair) while pushing apart representations of different samples (negative pairs), learning invariant features without labels',
      bridges: [
        {
          sharedProperty: 'Data augmentation through perturbation',
          bridgeDescription: 'Dropout perturbs the representation by zeroing activations; contrastive learning perturbs the input via data augmentation. Both create varied views of the same underlying signal to enforce invariance or robustness',
          quality: 'deep' as const,
        },
        {
          sharedProperty: 'Implicit ensemble / multi-view training',
          bridgeDescription: 'Dropout implicitly trains an exponential ensemble of sub-networks; contrastive learning explicitly trains on multiple augmented views. Both exploit the idea that a good representation should be stable across these perturbations',
          quality: 'deep' as const,
        },
      ],
      variants: [
        {
          title: 'Contrastive Dropout: feature-level augmentation for self-supervised learning',
          description: 'Use different dropout masks as positive pairs in contrastive learning — two forward passes of the same sample with different dropout masks become the two views, replacing input-level augmentation with representation-level perturbation',
          mutationType: 'forced_bridge',
          explanation: 'Exploits the deep bridge: dropout mask = augmentation. Removes need for domain-specific input augmentations; generalizes to modalities where good augmentations are unknown',
          noveltyEstimate: 'high' as const,
        },
        {
          title: 'Dropout-regularized contrastive pretraining with uncertainty estimation',
          description: 'Use Monte Carlo dropout at inference to produce uncertainty estimates on contrastive embeddings, enabling calibrated similarity scores for downstream retrieval',
          mutationType: 'forced_bridge',
          explanation: 'Combines dropout as uncertainty quantifier with contrastive embeddings, bridging the regularization role and the representation learning role',
          noveltyEstimate: 'medium' as const,
        },
      ],
      explanation: 'Deep bridge: dropout and contrastive learning both rely on perturbation-induced invariance — dropout at the activation level, contrastive at the input level. This shared principle enables hybrid architectures that use dropout masks as data augmentation views, generalizing contrastive learning to modalities without good domain-specific augmentations.',
    };
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(mockResult))])]);

    const result = await forcedBridge({
      techniqueA: 'Dropout regularization: randomly zeroing neural network activations during training to prevent overfitting and improve generalization.',
      techniqueB: 'Contrastive self-supervised learning: learning representations by maximizing agreement between different augmented views of the same sample.',
      context: 'Research on self-supervised representation learning. Domain: deep learning for computer vision and NLP.',
      _model: faux.getModel(),
    });

    expect(result.techniqueASummary).toBeTruthy();
    expect(result.techniqueBSummary).toBeTruthy();
    expect(result.bridges.length).toBeGreaterThanOrEqual(1);
    expect(result.bridges[0].quality).toMatch(/forced|natural|deep/);
    expect(result.variants.length).toBeGreaterThanOrEqual(1);
    expect(result.variants[0].mutationType).toBe('forced_bridge');
    expect(result.variants[0].noveltyEstimate).toMatch(/low|medium|high/);
    expect(result.explanation).toBeTruthy();
  });
});
