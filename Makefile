
# Image URL to use all building/pushing image targets
IMG_FRONTEND ?= hub.c.163.com/kubediag/kubediag-dashboard-frontend
IMG_BACKEND ?= hub.c.163.com/kubediag/kubediag-dashboard-backend

# Image build dockerfile
DOCKERFILE_FRONTEND ?= Dockerfile-frontend.arch
DOCKERFILE_BACKEND ?= Dockerfile-backend.arch

# Image tag to use all building/pushing image targets
TAG ?= $(shell git rev-parse --short HEAD)

all: kubediag

# Deploy controller in the configured Kubernetes cluster in ~/.kube/config
deploy: manifests
	kubectl apply -f config/deploy

# Build the frontend docker image
docker-build-frontend: test
	docker build . -f ${DOCKERFILE_FRONTEND} -t ${IMG_FRONTEND}:${TAG}

# Build the backend docker image
docker-build-backend: test
	docker build . -f ${DOCKERFILE_BACKEND} -t ${IMG_BACKEND}:${TAG}

# Push the docker image
docker-push:
	docker push ${IMG}:${TAG}
