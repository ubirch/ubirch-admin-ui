#!/bin/sh -x

NPM_CONTAINER_VERSION="latest"



init () {

  DEPENDENCY_LABEL=$GO_DEPENDENCY_LABEL_NPM_CONTAINER


  if [ -z ${DEPENDENCY_LABEL} ]; then
    NPM_CONTAINER_VERSION="latest"
  else
    NPM_CONTAINER_VERSION="v${DEPENDENCY_LABEL}"
  fi


}

build_software () {

	docker run -e HOME=/build -e UBIRCH_API_HOST=avatar-service -e npm_config_cache=/build/.npm --user `id -u`:`id -g` --rm -v $PWD:/build ubirch/npm-build-container:$NPM_CONTAINER_VERSION /build/buildWeb.sh $1

}

build_container () {
  # copy artefacts to TMP directory for faster build
  rm -rf TMP/
  mkdir -p TMP
  #get artifact names generated by Scala Build
  source Dockerfile.input
  if [ ! -f $SOURCE ]; then
    echo "Missing $SOURCE file \n did you run $0 assembly?"
    exit 1
  fi

  # get artefact name from Dockerfile

  tar cvf - $SOURCE | (cd TMP; tar xvf - )
  tar cvf - config/src/main/resources/ tools/ | (cd TMP; tar xvf - )
  cp Dockerfile.template TMP/Dockerfile
  #replace artefact name in start.sh
  sed -i.bak "s%@@build-artefact@@%$TARGET%g" TMP/tools/start.sh
  sed -i.bak "s%@@SOURCE@@%$SOURCE%g" TMP/Dockerfile
  sed -i.bak "s%@@TARGET@@%$TARGET%g" TMP/Dockerfile
  cd TMP
  docker build -t ubirch-avatar-service .
  if [ $? -ne 0 ]; then
    echo "Docker build failed"
    exit 1
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
