# Hardware Estimation

Estimate GPU hardware requirements from an experiment plan.

## Input

- Experiment Plan (full output from Stage 4), specifically:
  - Method: model architecture, parameter count
  - Datasets: names, approximate sizes
  - Resources section: any existing estimates from literature
  - Frameworks: PyTorch/JAX/TensorFlow

## Analysis Dimensions

1. **Model VRAM**
   - Inference VRAM ≈ parameters × 2 bytes (fp16) or × 4 bytes (fp32)
   - Training VRAM ≈ inference × 4 (optimizer states + gradients + activations)
   - Gradient checkpointing: reduces activation memory ~60%, costs ~30% more compute
   - Example: 7B model fp16 → inference ~14GB, training ~56GB

2. **Dataset Scale**
   - Tokens/samples × epochs → total training steps
   - Steps × per-step time → total training hours
   - Reference: 1B tokens on 7B model ≈ 8-12 hours on 1× A100

3. **Storage**
   - Model checkpoints: ~2× model size per checkpoint
   - Dataset: check HuggingFace dataset card for size
   - Logs/metrics: negligible (~100MB)

4. **Parallelism Strategy**
   - Single GPU: if model fits in one GPU's VRAM
   - Data parallel (multi-GPU): if need more throughput but model fits single GPU
   - Model parallel / FSDP: if model doesn't fit single GPU

## GPU Reference Table

| Scenario | Recommended GPU | VRAM | ~Price/hr | RunPod gpuTypeId |
|----------|----------------|------|-----------|------------------|
| Inference / small fine-tune (<1B) | RTX 4090 | 24 GB | ~$0.44 | NVIDIA GeForce RTX 4090 |
| Medium training (1-7B) | A100 80GB SXM | 80 GB | ~$1.64 | NVIDIA A100 80GB PCIe |
| Large training (7-13B) | H100 80GB | 80 GB | ~$3.29 | NVIDIA H100 80GB HBM3 |
| Very large (13B+) | H100 × 2-4 | 160-320 GB | ~$6.58-13.16 | NVIDIA H100 80GB HBM3 |

Note: Prices are approximate and fluctuate. The gpuTypeId strings are RunPod identifiers for use with create-pod.

## Output Format (strict JSON)

```json
{
  "gpuType": "NVIDIA A100 80GB PCIe",
  "gpuCount": 1,
  "minVRAM_GB": 80,
  "estimatedHours": 12,
  "estimatedCost_USD": 19.68,
  "reasoning": "7B parameter model in fp16 requires ~56GB VRAM for training...",
  "alternatives": [
    {
      "gpuType": "NVIDIA H100 80GB HBM3",
      "gpuCount": 1,
      "hours": 8,
      "cost_USD": 26.32,
      "tradeoff": "~40% faster but ~34% more expensive"
    }
  ],
  "diskEstimate_GB": 50,
  "dockerImage": "runpod/pytorch:2.1.0-py3.10-cuda11.8.0-devel-ubuntu22.04",
  "recommendations": [
    "Use gradient checkpointing to reduce VRAM",
    "Use bf16 mixed precision for H100/A100"
  ]
}
```
