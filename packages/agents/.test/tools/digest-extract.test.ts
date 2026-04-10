import { describe, it, expect, afterEach } from 'vitest';
import { registerFauxProvider, fauxAssistantMessage, fauxText } from '@mariozechner/pi-ai';
import { digestExtract } from '../../src/tools/digest-extract.js';

describe('digestExtract', () => {
  let faux: ReturnType<typeof registerFauxProvider>;

  afterEach(() => {
    if (faux) faux.unregister();
  });

  it('should perform 3-pass reading for High rating', async () => {
    const expected = {
      paperTitle: 'attention_is_all_you_need',
      pass1: 'Proposes Transformer architecture replacing RNNs with self-attention. Sections: intro, background, model architecture, experiments, results, conclusion.',
      pass2: 'Multi-head attention mechanism with Q/K/V projections. Positional encoding via sinusoidal functions. Trained on WMT 2014 EN-DE and EN-FR translation.',
      pass3: 'Key insight: attention parallelizes better than recurrence. Assumes fixed-length positional encoding limits extrapolation. Connection to memory-augmented networks.',
      keyFindings: [
        'Self-attention achieves state-of-the-art BLEU on WMT translation',
        'Multi-head attention captures different representation subspaces',
        'Training is significantly faster than RNN-based models'
      ],
      limitations: [
        'Quadratic memory complexity with sequence length',
        'Positional encoding may not generalize to longer sequences than training'
      ],
    };
    faux = registerFauxProvider();
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(expected))])]);

    const result = await digestExtract({
      paperMarkdown: '# Attention Is All You Need\n\nThe dominant sequence transduction models are based on complex recurrent or convolutional neural networks...',
      normalizedTitle: 'attention_is_all_you_need',
      rating: 'High',
      _model: faux.getModel(),
    });

    expect(result.pass1).toBeDefined();
    expect(result.pass2).toBeDefined();
    expect(result.pass3).toBeDefined();
    expect(result.keyFindings.length).toBeGreaterThanOrEqual(1);
    expect(result.limitations.length).toBeGreaterThanOrEqual(1);
    expect(result.paperTitle).toBe('attention_is_all_you_need');
  });

  it('should omit pass3 for Medium rating', async () => {
    const expected = {
      paperTitle: 'bert_pretraining',
      pass1: 'Introduces BERT: bidirectional pre-training for language understanding.',
      pass2: 'Masked language modeling + next sentence prediction. Fine-tuning on downstream tasks.',
      keyFindings: ['Bidirectional context improves over left-to-right models'],
      limitations: ['Pre-training is computationally expensive'],
    };
    faux = registerFauxProvider();
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(expected))])]);

    const result = await digestExtract({
      paperMarkdown: '# BERT: Pre-training of Deep Bidirectional Transformers\n\n...',
      normalizedTitle: 'bert_pretraining',
      rating: 'Medium',
      _model: faux.getModel(),
    });

    expect(result.pass1).toBeDefined();
    expect(result.pass2).toBeDefined();
    expect(result.pass3).toBeUndefined();
    expect(result.paperTitle).toBe('bert_pretraining');
  });

  it('should only have pass1 for Low rating', async () => {
    const expected = {
      paperTitle: 'gpt2_language_models',
      pass1: 'GPT-2 demonstrates that language models can learn tasks without explicit supervision.',
      keyFindings: ['Zero-shot task transfer via language modeling'],
      limitations: ['Requires massive compute for training'],
    };
    faux = registerFauxProvider();
    faux.setResponses([fauxAssistantMessage([fauxText(JSON.stringify(expected))])]);

    const result = await digestExtract({
      paperMarkdown: '# Language Models are Unsupervised Multitask Learners\n\n...',
      normalizedTitle: 'gpt2_language_models',
      rating: 'Low',
      _model: faux.getModel(),
    });

    expect(result.pass1).toBeDefined();
    expect(result.pass2).toBeUndefined();
    expect(result.pass3).toBeUndefined();
    expect(result.paperTitle).toBe('gpt2_language_models');
  });
});
