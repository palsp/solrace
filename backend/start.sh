#!/bin/sh

set -e

NODE_ENV=production yarn run db:migration:run
NODE_ENV=production node --max_old_space_size=7000 dist/src/index