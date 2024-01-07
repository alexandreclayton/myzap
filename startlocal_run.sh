#!/bin/bash
docker build --tag=smr-myzap:dev . && docker run -p 3333:3333 -it --rm --name sm-myzap-dev -v "$(pwd):/usr/src/app" smr-myzap:dev
