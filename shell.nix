{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
  buildInputs = [
    pkgs.deno
    pkgs.python3
  ];

  # Set up Deno and Python environment
  shellHook = ''
    # Set up Deno environment with SilverBullet
    export DENO_INSTALL_ROOT="./.deno"
    mkdir -p ./.deno
    deno install -f --name silverbullet --unstable-kv --unstable-worker-options -A https://get.silverbullet.md --global
    export PATH="$DENO_INSTALL_ROOT/bin:$PATH"

    # Set up Python virtual environment for pre-commit
    export VENV_DIR="./.venv"
    if [ ! -d "$VENV_DIR" ]; then
      python3 -m venv "$VENV_DIR"
      source "$VENV_DIR/bin/activate"
      pip install pre-commit
    else
      source "$VENV_DIR/bin/activate"
    fi
  '';
}
