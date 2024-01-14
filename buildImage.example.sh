#!/bin/bash
# build image

awscli=$(which aws) ; [[ -z $awscli ]] && { echo "AWS Cli não instalado, instale!" ; exit ; }

REGION="sa-east-1"
IDECR=""
REPO=""
PROFILE=""
VERSION=""

echo "autenticando na aws"
aws ecr get-login-password --region $REGION --profile $PROFILE | docker login --username AWS --password-stdin $IDECR.dkr.ecr.$REGION.amazonaws.com

echo "criando build da imagem"
docker build --tag=$REPO:dev .

echo "criando tag da imagem para fazer upload para a AWS/ECR"
docker tag $REPO:dev $IDECR.dkr.ecr.$REGION.amazonaws.com/$REPO:$VERSION

echo "subindo imagem para a aws"
docker push $IDECR.dkr.ecr.$REGION.amazonaws.com/$REPO:$VERSION
