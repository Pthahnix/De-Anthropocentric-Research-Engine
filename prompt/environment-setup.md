# Environment Setup

Generate a shell command sequence to initialize a RunPod GPU environment for an ML experiment.

## Input

- Hardware estimation output (GPU type, docker image)
- Experiment Plan (frameworks, key libraries, data sources)
- Whether user has local datasets to upload

## Rules

- RunPod pytorch images come with PyTorch + CUDA pre-installed. Verify first, don't reinstall.
- Only install packages the experiment actually needs.
- Always verify GPU availability after setup.
- Use pip (not conda) unless the experiment specifically requires conda.
- Install tmux for persistent training sessions.

## Output

Output a numbered shell command sequence that can be executed line-by-line via SSH. Group commands by purpose:

```bash
# === 1. Verify Pre-installed Environment ===
python -c "import torch; print(f'PyTorch {torch.__version__}, CUDA available: {torch.cuda.is_available()}, GPUs: {torch.cuda.device_count()}')"
nvidia-smi

# === 2. System Packages ===
apt-get update && apt-get install -y tmux htop

# === 3. Python Dependencies ===
pip install --upgrade pip
pip install transformers datasets accelerate evaluate
pip install {{EXTRA_DEPS}}

# === 4. Verify Installation ===
python -c "import transformers; import datasets; print('All dependencies OK')"

# === 5. Create Workspace ===
mkdir -p /workspace/experiment
cd /workspace/experiment
```

## Adaptation Rules

- If experiment uses JAX: replace torch verification with JAX, use `jax[cuda]` pip install
- If experiment uses TensorFlow: verify TF-GPU, install via `tensorflow[and-cuda]`
- If experiment needs specific model: add `huggingface-cli download {{MODEL_ID}}`
- If experiment needs wandb tracking: add `pip install wandb && wandb login`
