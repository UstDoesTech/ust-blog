#!/usr/bin/env python3
"""
Ollama bootstrap helper.

Starts the Ollama container (via docker-compose) and pulls the model
specified in OLLAMA_MODEL (default: mistral).  Run this once before
using `workflow.py --provider ollama`.

Usage:
  python ollama_setup.py                  # Pull default model (mistral)
  python ollama_setup.py --model llama3   # Pull a specific model
  python ollama_setup.py --stop           # Tear down the container
"""

import argparse
import subprocess
import sys
import time
from pathlib import Path

COMPOSE_FILE = Path(__file__).parent / "docker-compose.yml"
DEFAULT_MODEL = "mistral"
OLLAMA_URL = "http://localhost:11435"


def _run(cmd: list[str], **kwargs):
    """Run a subprocess and stream output."""
    print(f"  ▸ {' '.join(cmd)}")
    return subprocess.run(cmd, **kwargs)


def _cleanup_stale_container():
    """Remove any leftover container that may be holding the port."""
    result = subprocess.run(
        ["docker", "ps", "-a", "--filter", "name=databricks-ollama", "--format", "{{.ID}}"],
        capture_output=True, text=True,
    )
    container_id = result.stdout.strip()
    if container_id:
        print("🧹 Removing stale container …")
        subprocess.run(["docker", "rm", "-f", container_id], capture_output=True)


def start_container():
    """Bring up the Ollama container."""
    _cleanup_stale_container()
    print("🐳 Starting Ollama container …")
    result = _run(
        ["docker-compose", "-f", str(COMPOSE_FILE), "up", "-d"],
        capture_output=True, text=True,
    )
    if result.returncode != 0:
        print(f"❌ docker-compose up failed:\n{result.stderr}")
        sys.exit(1)
    print("✅ Container started")


def wait_for_healthy(timeout: int = 60):
    """Block until the Ollama API responds."""
    import requests  # local import — only needed here

    print("⏳ Waiting for Ollama API …", end="", flush=True)
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            r = requests.get(f"{OLLAMA_URL}/api/tags", timeout=3)
            if r.ok:
                print(" ready!")
                return
        except Exception:
            pass
        print(".", end="", flush=True)
        time.sleep(2)
    print("\n❌ Ollama did not become healthy within timeout")
    sys.exit(1)


def pull_model(model: str):
    """Pull (download) a model inside the running container."""
    print(f"📦 Pulling model '{model}' — this may take a few minutes on first run …")
    result = _run(
        ["docker", "exec", "databricks-ollama", "ollama", "pull", model],
    )
    if result.returncode != 0:
        print(f"❌ Failed to pull model '{model}'")
        sys.exit(1)
    print(f"✅ Model '{model}' is ready")


def stop_container():
    """Tear down the container (data volume is preserved)."""
    print("🛑 Stopping Ollama container …")
    _run(["docker-compose", "-f", str(COMPOSE_FILE), "down"])
    print("✅ Stopped. Model data is preserved in the docker volume.")


def main():
    parser = argparse.ArgumentParser(description="Ollama container helper")
    parser.add_argument("--model", default=DEFAULT_MODEL, help="Model to pull (default: mistral)")
    parser.add_argument("--stop", action="store_true", help="Stop the container")
    args = parser.parse_args()

    if args.stop:
        stop_container()
        return

    start_container()
    wait_for_healthy()
    pull_model(args.model)

    print("\n" + "=" * 55)
    print("  🚀  Ollama is ready!")
    print(f"  Model : {args.model}")
    print(f"  API   : {OLLAMA_URL}")
    print()
    print("  Run the pipeline with:")
    print(f"    python workflow.py --provider ollama --model {args.model}")
    print("=" * 55)


if __name__ == "__main__":
    main()
