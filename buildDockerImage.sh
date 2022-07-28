#!/bin/bash
docker build --tag=smr-myzap:dev .
aws ecr get-login-password --region sa-east-1 --profile aws-semar | docker login --username AWS --password-stdin 221040820204.dkr.ecr.sa-east-1.amazonaws.com
docker tag smr-myzap:dev 221040820204.dkr.ecr.sa-east-1.amazonaws.com/smr-myzap:$1
docker push 221040820204.dkr.ecr.sa-east-1.amazonaws.com/smr-myzap:$1