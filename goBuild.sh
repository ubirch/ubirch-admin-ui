#!/bin/bash -x

NPM_CONTAINER_VERSION="latest"
CURRENT_SERVICE_NAME="admin-ui-container"
#DOCKER_REPO=tracklecontainerregistry-on.azurecr.io
DOCKER_REPO=ubirch

function init() {

  DEPENDENCY_LABEL=$GO_DEPENDENCY_LABEL_NPM_CONTAINER


  if [ -z ${DEPENDENCY_LABEL} ]; then
    NPM_CONTAINER_VERSION="latest"
  else
    NPM_CONTAINER_VERSION="v${DEPENDENCY_LABEL}"
  fi

  # clean up
  if [ -d dist ]; then
      echo "Cleaning up old dist"
      rm -rf dist/
  fi

}

function build_software() {

    docker run -e HOME=/build -e npm_config_cache=/build/.npm --user `id -u`:`id -g` --rm -v $PWD:/build ubirch/npm-  build-container:$NPM_CONTAINER_VERSION /build/buildWeb.sh $1

}

function build_container() {

  if [ -z $GO_PIPELINE_LABEL ]; then
      # building without GoCD
      docker build --pull -t ubirch/$CURRENT_SERVICE_NAME:v$GO_PIPELINE_LABEL .
  else
      # build with GoCD
      docker build --pull -t ubirch/$CURRENT_SERVICE_NAME:v$GO_PIPELINE_LABEL \
      --build-arg GO_PIPELINE_NAME=$GO_PIPELINE_NAME \
      --build-arg GO_PIPELINE_LABEL=$GO_PIPELINE_LABEL \
      --build-arg GO_PIPELINE_COUNTER=$GO_PIPELINE_COUNTER \
      --build-arg GO_STAGE_COUNTER=$GO_STAGE_COUNTER \
      --build-arg GO_REVISION_GIT=$GO_REVISION_GIT .
  fi

  if [ $? -ne 0 ]; then
    echo "Docker build failed"
    exit 1
  fi

  # push Docker image
  docker push ubirch/$CURRENT_SERVICE_NAME
  docker push ubirch/$CURRENT_SERVICE_NAME:v$GO_PIPELINE_LABEL
  if [ $? -ne 0 ]; then
    echo "Docker push failed"
    exit 1
  fi
}

function container_tag () {
    label=$1
    docker pull ubirch/$CURRENT_SERVICE_NAME:v$GO_PIPELINE_LABEL
    docker tag ubirch/$CURRENT_SERVICE_NAME:v$GO_PIPELINE_LABEL $DOCKER_REPO/$CURRENT_SERVICE_NAME:$label
    docker push ubirch/$CURRENT_SERVICE_NAME:$label

}

case "$1" in
    build)
        init
        build_software "docker"
        ;;
    containerbuild)
        build_container
        ;;
    containertag)
        container_tag "latest"
        ;;
    containertagstable)
        container_tag "stable"
        ;;
    *)
        echo "Usage: $0 { build | containerbuild | containertag | containertagstable }"
        exit 1
esac

exit 0
