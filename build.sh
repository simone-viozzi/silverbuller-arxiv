#!/usr/bin/env bash

deno task build
scp *.plug.js server:/docker-volumes/silverbullet-space/_plug/
