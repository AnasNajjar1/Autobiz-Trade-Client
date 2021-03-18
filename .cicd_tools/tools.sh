#! /bin/bash
set -eu


set_up_ssh_for_alpine(){
  which ssh-agent || ( apk add openssh-client )
  eval $(ssh-agent -s)
  echo "${DELIVERY_SSHKEY}" | tr -d '\r' | ssh-add - > /dev/null
  mkdir -p ~/.ssh
  chmod 700 ~/.ssh
}

configure_access_to_bastion(){
  echo -e "Host\tBastion\n\tHostname\tb.autobiz.fr\n\tUser\t${DELIVERY_USER}\n\tStrictHostKeyChecking\tno\n\nHost\t* !Bastion\n\tUser\t${DELIVERY_USER}\n\tStrictHostKeyChecking\tno\n\tProxyJump\tBastion\n\n" > /etc/ssh/ssh_config
  cat /etc/ssh/ssh_config
}

set_up_access_to_docker_registry(){
  docker login -u ${DOCKER_USER} -p ${DOCKER_USER_TOKEN} ${DOCKER_REGISTRY} 
}

build_and_push_to_registry(){
  docker build --no-cache -t ${DOCKER_TAG}:${CI_COMMIT_SHA:0:8} -t ${DOCKER_TAG}:latest .
  docker push ${DOCKER_TAG}:${CI_COMMIT_SHA:0:8}
  docker push ${DOCKER_TAG}:latest
}

build_and_push_to_registry_with_dockerfile(){
  docker build --no-cache -t ${DOCKER_TAG}:${CI_COMMIT_SHA:0:8} -t ${DOCKER_TAG}:latest -f ${DOCKERFILE_PATH} .
  docker push ${DOCKER_TAG}:${CI_COMMIT_SHA:0:8}
  docker push ${DOCKER_TAG}:latest
}

deploy_to_server(){
  set_deploy_server "$@"
  remove_the_previous_stack_if_it_exists_and_create_new_deployment_folder
  change_docker_compose_for_deployment_server_and_send_new_docker_compose_file
  execute_docker_compose_up
}

set_deploy_server(){
  export DEPLOY_SERVER=${1:?Error, I expect deployment server}
}

set_docker_network(){
  export DOCKER_NETWORK=${1:?Error}
}

remove_the_previous_stack_if_it_exists_and_create_new_deployment_folder(){
  [[ -z "${DEPLOY_SERVER}" ]] && exit 1
  [[ -z "${SERVER_PROJECT_PATH_DOCKER_COMP_FILE}" ]] && exit 1
  [[ -z "${SERVER_PROJECT_PATH}" ]] && exit 1

  ssh ${DEPLOY_SERVER} <<-EOF
    if [ -f "${SERVER_PROJECT_PATH_DOCKER_COMP_FILE}" ]; then
      docker-compose -f "${SERVER_PROJECT_PATH_DOCKER_COMP_FILE}" down --rmi all;
      rm -r "${SERVER_PROJECT_PATH}";
    else if [ -d "${SERVER_PROJECT_PATH}" ]; then
      rm -r "${SERVER_PROJECT_PATH}";
      fi;
    fi;
    mkdir -p "${SERVER_PROJECT_PATH}";
EOF
}

change_docker_compose_for_deployment_server_and_send_new_docker_compose_file(){
  replace_place_holder_values_in_docker_compose_file
  copy_docker_compose_file_to_deployment_server
}

    replace_place_holder_values_in_docker_compose_file(){
      sed -i "s/CI_COMMIT_SHA/${CI_COMMIT_SHA:0:8}/g" "${DOCKER_COMPOSE_FILE_GIT_RELATIVE_PATH}"
    }
    
    copy_docker_compose_file_to_deployment_server(){
      scp "${DOCKER_COMPOSE_FILE_GIT_RELATIVE_PATH}" "${DEPLOY_SERVER}:${SERVER_PROJECT_PATH_DOCKER_COMP_FILE}" 
    }

execute_docker_compose_up(){
  ssh ${DEPLOY_SERVER} <<-EOF
    docker login -u ${DOCKER_USER} -p ${DOCKER_USER_TOKEN} ${DOCKER_REGISTRY};
    docker-compose -f "${SERVER_PROJECT_PATH_DOCKER_COMP_FILE}" up -d;
    docker-compose -f "${SERVER_PROJECT_PATH_DOCKER_COMP_FILE}" logs;
EOF
}

set_docker_tag(){
  export DOCKER_TAG=${1:?Error}
}
set_up_access_to_docker_registry_in_server(){
  ssh ${DEPLOY_SERVER} <<-EOF
    docker login -u ${DOCKER_USER} -p ${DOCKER_USER_TOKEN} ${DOCKER_REGISTRY};
EOF
}

try_to_remove_previous_container_and_volumes(){
  ssh ${DEPLOY_SERVER} <<-EOF
    docker stop ${CONTAINER_NAME} && docker rm -v ${CONTAINER_NAME} || exit 0;
EOF
}

remove_previous_images(){
  ssh ${DEPLOY_SERVER} <<-EOF
    echo "Removing images for this Docker Tag: ${DOCKER_TAG}"
    docker rmi \$(docker images | grep "${DOCKER_TAG}" | tr -s ' '| cut -d ' ' -f3) --force || echo "No Images for this Docker Tag" && exit 0;
EOF
}

create_network_if_it_doesnt_exist(){
  ssh ${DEPLOY_SERVER} <<-EOF
    docker network create --driver bridge "${DOCKER_NETWORK}"|| exit 0;
EOF
}

docker_run_and_join_network(){
  ssh ${DEPLOY_SERVER} <<-EOF
    docker run -d -p ${PORT_MAPPING} --name ${CONTAINER_NAME} --network="${DOCKER_NETWORK}" --restart unless-stopped ${DOCKER_TAG}:${CI_COMMIT_SHA:0:8};
EOF
}

docker_run(){
  ssh ${DEPLOY_SERVER} <<-EOF
    docker run -d -p ${PORT_MAPPING} --name ${CONTAINER_NAME} --restart unless-stopped ${DOCKER_TAG}:${CI_COMMIT_SHA:0:8};
EOF
}

docker_run_no_port_mapping(){
  ssh ${DEPLOY_SERVER} <<-EOF
    docker run -d --name ${CONTAINER_NAME} --restart unless-stopped ${DOCKER_TAG}:${CI_COMMIT_SHA:0:8};
EOF
}

docker_run_once_no_port_mapping(){
  ssh ${DEPLOY_SERVER} <<-EOF
    docker run -d --name ${CONTAINER_NAME} ${DOCKER_TAG}:${CI_COMMIT_SHA:0:8};
EOF
}


change_dev_environment_variable_to(){
  local NEW_ENV=${1:?Error, I expected new environement}
  sed -i "s/dev/${NEW_ENV}/g" ./.env
}

change_environment_variable_to(){
  local NEW_ENV=${1:?Error, I expected new environement}
  sed -i "s/REACT_APP_ENV=.*/REACT_APP_ENV=${NEW_ENV}/g" ./.env
}

docker_run_with_this_port_mapping(){
  local PORT_MAPPING=${1:?Error, I expected a port mapping}

  ssh ${DEPLOY_SERVER} <<-EOF
    docker run -d -p ${PORT_MAPPING} --name ${CONTAINER_NAME} --restart unless-stopped ${DOCKER_TAG}:${CI_COMMIT_SHA:0:8};
EOF
}

docker_run_and_mount_etc_hosts(){
  ssh ${DEPLOY_SERVER} <<-EOF
    docker run -d -p ${PORT_MAPPING} -v/etc/hosts:/etc/hosts --name ${CONTAINER_NAME} --restart unless-stopped ${DOCKER_TAG}:${CI_COMMIT_SHA:0:8};
EOF
}

override_container_name(){
  export CONTAINER_NAME=${1:?Error}
}

test_merge_master_to_this_branch(){
  apk add git 
  git config --global user.email "gitlab@fake_mail.com"
  git config --global user.name "gitlab"
  git branch -a
  git fetch origin master
  git merge origin/master
}


decompress_node_modules(){
  tar xf .node_modules.tar.gz
}

npm_rebuild(){
  npm set registry https://nx.aut.bz/repository/npm/ 
  npm rebuild  
  npm rebuild node-sass 
  CI=false npm run-script build 
}

npm_install(){
  npm set registry https://nx.aut.bz/repository/npm/ 
  npm install
  npm rebuild node-sass 
  CI=false npm run-script build 
}

npm_install_optimized(){
  npm set registry https://nx.aut.bz/repository/npm/ 
  npm install --prefer-offline --no-audit --progress=false
}

npm_build(){
  npm set registry https://nx.aut.bz/repository/npm/ 
  npm install --prefer-offline --no-audit --progress=false
  npm rebuild node-sass 
  CI=false npm run-script build 
}

deploy_build_to_s3_bucket(){
  local S3_BUCKET_NAME=${1:?Error, I expected a bucket}
  pip3 install awscli 
  echo "deploy to ${S3_BUCKET_NAME}"
  aws s3 sync ./build s3://${S3_BUCKET_NAME} --delete
}

ensure_dependencies_folder_exist(){
  mkdir ./node_modules || echo "Folder already exists"
}

assert_build_folder_exists(){
  [ -d ./build ] || ( echo "Build does not exists!" && exit 1 )
}

