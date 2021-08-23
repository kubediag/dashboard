/*
 * Copyright 2021 The KubeDiag Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package handler

import (
	"io"
	"net/http"

	"encoding/json"

	"github.com/gorilla/mux"
	"github.com/kubediag/dashboard/pkg/client"
	runtimeclient "sigs.k8s.io/controller-runtime/pkg/client"
)

const (
	index  = "/"
	static = "/static"
	health = "/health"

	v1                  = "/v1"
	summaryURIPrefix    = "/summary"
	operationsURIPrefix = "/operations"

	operationSetsURIPrefix = "/operationSets"
	operationSetURIPrefix  = "/operationSets/{name}"
)

//error message
const (
	errorInvalidParams = "invalid params"
)

type HttpServer interface {
	StartHttpServer() error
}

type httpServer struct {
	cli  client.Client
	host string
	port string
}

func NewHttpServer(cli client.Client, host, port string) HttpServer {
	return &httpServer{
		cli:  cli,
		host: host,
		port: port,
	}
}
func (server *httpServer) index(writer http.ResponseWriter, req *http.Request) {
	http.FileServer(http.Dir("web")).ServeHTTP(writer, req)
}
func (server *httpServer) static(writer http.ResponseWriter, req *http.Request) {
	http.FileServer(http.Dir("web")).ServeHTTP(writer, req)
}
func (server *httpServer) checkHealth(writer http.ResponseWriter, req *http.Request) {
	GenerateHandlerResult(writer, nil, nil, true)
}

func (server *httpServer) summary(writer http.ResponseWriter, req *http.Request) {
	opts := &runtimeclient.ListOptions{}
	operationList, err := server.cli.OperationList(opts)
	if err != nil {
		GenerateHandlerResult(writer, nil, err, false)
		return
	}
	operationSetList, err := server.cli.OperationSetList(opts)
	if err != nil {
		GenerateHandlerResult(writer, nil, err, false)
		return
	}
	resourceCount := make(map[string]int)
	resourceCount["operation"] = len(operationList.Items)
	resourceCount["operationSet"] = len(operationSetList.Items)
	summaryVO := &SummaryVO{
		ResourceCount: resourceCount,
	}
	GenerateHandlerResult(writer, nil, summaryVO, true)
}

func (server *httpServer) operationList(writer http.ResponseWriter, req *http.Request) {
	opts := &runtimeclient.ListOptions{}
	operationList, err := server.cli.OperationList(opts)
	if err != nil {
		GenerateHandlerResult(writer, nil, err, false)
		return
	}
	result := []OperationVO{}
	for index := range operationList.Items {
		result = append(result, *NewOperationVO(&operationList.Items[index]))
	}
	GenerateHandlerResult(writer, nil, result, true)
}

func (server *httpServer) operationSetList(writer http.ResponseWriter, req *http.Request) {
	opts := &runtimeclient.ListOptions{}
	operationSetList, err := server.cli.OperationSetList(opts)
	if err != nil {
		GenerateHandlerResult(writer, nil, err, false)
		return
	}
	result := []OperationSetVO{}
	for index := range operationSetList.Items {
		result = append(result, *NewOperationSetVO(&operationSetList.Items[index]))
	}
	GenerateHandlerResult(writer, nil, result, true)
}

func (server *httpServer) operationSetAdd(writer http.ResponseWriter, req *http.Request) {
	if req.Body == nil {
		GenerateHandlerResult(writer, nil, errorInvalidParams, false)
		return
	}
	body, err := io.ReadAll(req.Body)
	if err != nil {
		GenerateHandlerResult(writer, nil, GenerateErrorMessage(errorInvalidParams, err), false)
		return
	}
	var createReq OperationSetCreateReq
	jsonErr := json.Unmarshal(body, &createReq)
	if jsonErr != nil {
		GenerateHandlerResult(writer, nil, GenerateErrorMessage(errorInvalidParams, jsonErr), false)
		return
	}
	operationSet, paths := NewOperationSet(&createReq, body)
	opts := runtimeclient.CreateOptions{}
	createErr := server.cli.OperationSetAdd(operationSet, &opts)
	if createErr != nil {
		GenerateHandlerResult(writer, nil, GenerateErrorMessage("", createErr), false)
		return
	}
	GenerateHandlerResult(writer, nil, paths, true)
}

func (server *httpServer) StartHttpServer() error {
	router := mux.NewRouter()
	//health
	router.HandleFunc(health, server.checkHealth).Methods(http.MethodGet)
	router.HandleFunc(v1Path(summaryURIPrefix), server.summary).Methods(http.MethodGet)

	//static resource
	router.HandleFunc(index, server.index).Methods(http.MethodGet)
	router.PathPrefix(static).HandlerFunc(server.static).Methods(http.MethodGet)

	//operation v1
	router.HandleFunc(v1Path(operationsURIPrefix), server.operationList).Methods(http.MethodGet)

	//operationSet v1
	router.HandleFunc(v1Path(operationSetsURIPrefix), server.operationSetList).Methods(http.MethodGet)
	router.HandleFunc(v1Path(operationSetsURIPrefix), server.operationSetAdd).Methods(http.MethodPost)

	return http.ListenAndServe(server.host+":"+server.port, router)
}

func v1Path(path string) string {
	return v1 + path
}
