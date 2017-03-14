#!/bin/bash -x

NPM_CONTAINER_VERSION="latest"



init () {

  DEPENDENCY_LABEL=$GO_DEPENDENCY_LABEL_NPM_CONTAINER


  if [ -z ${DEPENDENCY_LABEL} ]; then
    NPM_CONTAINER_VERSION="latest"
  else
    NPM_CONTAINER_VERSION="v${DEPENDENCY_LABEL}"
  fi

  #Clean up
  if [ -d dist ]; then
    echo "Cleaning up old dist"
    rm -rf dist/
  fi


}

build_software () {

	docker run -e HOME=/build -e npm_config_cache=/build/.npm --user `id -u`:`id -g` --rm -v $PWD:/build ubirch/npm-build-container:$NPM_CONTAINER_VERSION /build/buildWeb.sh $1

}

build_container () {
  # Adding Build time ARGs
  # ARG go_build=manual
  # ARG go_pipeline_name=manual
  # ARG go_pipeline_label=manual
  # ARG go_pipeline_counter=manual
  # ARG go_revision_ubirch_admin_ui=manual

  docker build -t ubirch/admin-ui-container:v$GO_PIPELINE_LABEL --build-arg GO_PIPELINE_NAME=$GO_PIPELINE_NAME \
  --build-arg GO_PIPELINE_LABEL=$GO_PIPELINE_LABEL \
  --build-arg GO_PIPELINE_COUNTER=$GO_PIPELINE_COUNTER \
  --build-arg GO_REVISION_UBIRCH_ADMIN_UI=$GO_REVISION_UBIRCH_ADMIN_UI .

  if [ $? -ne 0 ]; then
    echo "Docker build failed"
    exit 1
  else
    docker tag ubirch/admin-ui-container:v$GO_PIPELINE_LABEL ubirch/admin-ui-container:latest
    docker push ubirch/admin-ui-container
    if [ $? -ne 0 ]; then
      echo "Docker push failed"
      exit 1
    fi
  fi

}


case "$1" in
    build)
        init
        build_software "docker"
        ;;
    containerbuild)
        build_container
        ;;
    *)
        echo "Usage: $0 {build|containerbuild}"
        exit 1
esac
