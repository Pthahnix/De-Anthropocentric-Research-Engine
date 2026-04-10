import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { paperRate } from '../../src/tools/paper-rate.js';

describe('paperRate', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should rate a highly relevant paper as High', async () => {
    faux = registerFauxProvider();
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify({
      rating: 'High',
      reason: 'Directly proposes a new attention mechanism for long sequences, which is the core research topic.',
    }))])]);

    const result = await paperRate({
      title: 'Efficient Long-Range Attention via Sparse Kernels',
      abstract: 'We propose a sparse kernel approach to enable linear-time attention for sequences exceeding 100K tokens.',
      year: 2025,
      citations: 45,
      topic: 'efficient attention mechanisms for long sequences',
      _model: faux.getModel(),
    });

    expect(result.rating).toBe('High');
    expect(result.reason).toBeDefined();
    expect(result.reason.length).toBeGreaterThan(10);
  });

  it('should rate a loosely related paper as Low', async () => {
    faux = registerFauxProvider();
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify({
      rating: 'Low',
      reason: 'Paper focuses on image classification with CNNs, only tangentially related to attention mechanisms.',
    }))])]);

    const result = await paperRate({
      title: 'Deep Residual Learning for Image Recognition',
      abstract: 'We present a residual learning framework for training very deep convolutional networks.',
      year: 2015,
      citations: 120000,
      topic: 'efficient attention mechanisms for long sequences',
      _model: faux.getModel(),
    });

    expect(result.rating).toBe('Low');
  });

  it('should handle missing optional fields', async () => {
    faux = registerFauxProvider();
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify({
      rating: 'Medium',
      reason: 'Related work on sequence modeling but uses RNN approach rather than attention.',
    }))])]);

    const result = await paperRate({
      title: 'State Space Models for Long Sequences',
      abstract: 'We explore state space models as an alternative to attention.',
      topic: 'efficient attention mechanisms',
      _model: faux.getModel(),
    });

    expect(['High', 'Medium', 'Low']).toContain(result.rating);
  });
});
