{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = inputs@{ self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config = { allowUnfree = true; };
        };
      in {
        devShell = (pkgs.buildFHSUserEnv {
          name = "jekyll-env";
          targetPkgs = pkgs: with pkgs; [ mesa gcc gnumake curl ruby zlib dart-sass];
          runScript = "zsh";
        }).env;

      });
}
