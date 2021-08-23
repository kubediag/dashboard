# Image URL to use all building/pushing image targets
IMG ?= kubediag-dashboard:latest

# Get the currently used golang install path (in GOPATH/bin, unless GOBIN is set)
ifeq (,$(shell go env GOBIN))
GOBIN=$(shell go env GOPATH)/bin
else
GOBIN=$(shell go env GOBIN)
endif

all: main

# Run tests
test: fmt vet
	go test ./... -coverprofile cover.out

# Build main binary
main: fmt vet
	go build -o bin/main main.go

# Run against the configured Kubernetes cluster in ~/.kube/config
run: fmt vet
	go run ./main.go


# Deploy controller in the configured Kubernetes cluster in ~/.kube/config
deploy: 
	cd config/main && kustomize edit set image kubediag-dashboard=${IMG}
	kustomize build config/default | kubectl apply -f -

# Run go fmt against code
fmt:
	go fmt ./...

# Run go vet against code
vet:
	go vet ./...

# Build the docker image
docker-build: test
	docker build . -t ${IMG}

# Push the docker image
docker-push:
	docker push ${IMG}
