#! /bin/bash

change_dev_environment_variable_to(){
  local NEW_ENV=${1:?Error, I expected new environement}
  sed -i "s/dev/${NEW_ENV}/g" ./.env
}

build_and_push_to_registry(){
  docker build --no-cache -f "${DOCKER_FILE_PATH}" -t ${DOCKER_TAG}:${CI_COMMIT_SHA:0:8} -t ${DOCKER_TAG}:latest .
  docker push ${DOCKER_TAG}:${CI_COMMIT_SHA:0:8}
  docker push ${DOCKER_TAG}:latest
}

docker_run_with_this_port_mapping(){
  local PORT_MAPPING=${1:?Error, I expected a port mapping}

  ssh ${DEPLOY_SERVER} <<-EOF
    docker run -d -p "${PORT_MAPPING}" --name ${CONTAINER_NAME} --restart unless-stopped ${DOCKER_TAG}:${CI_COMMIT_SHA:0:8};
EOF
}

override_container_name(){
  export CONTAINER_NAME=${1:?Error}
}

test_merge_master_to_this_branch(){
  apk add git 
  git config --global user.email "gitlab@fake_mail.com"
  git config --global user.name "gitlab"
  git merge master
}
