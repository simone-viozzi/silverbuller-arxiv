{ pkgs ? import <nixpkgs> {} }:
pkgs.mkShell {
  buildInputs = [ pkgs.deno ];

  # Installa SilverBullet automaticamente quando l'ambiente si avvia, con un'installazione locale
  shellHook = ''
    export DENO_INSTALL_ROOT="./.deno"
    mkdir ./.deno
    deno install -f --name silverbullet --unstable-kv --unstable-worker-options -A https://get.silverbullet.md --global
    export PATH="$DENO_INSTALL_ROOT/bin:$PATH"
  '';
}
