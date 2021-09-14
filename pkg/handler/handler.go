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
	"errors"
	"io"
	"net/http"

	"encoding/json"

	"github.com/gorilla/mux"
	"github.com/kubediag/dashboard/pkg/client"
	"k8s.io/apimachinery/pkg/util/validation"
	runtimeclient "sigs.k8s.io/controller-runtime/pkg/client"
)

const (
	index     = "/"
	static    = "/static"
	health    = "/health"
	checkName = "/checkName/{name}"

	v1               = "/v1"
	summaryURIPrefix = "/summary"

	operationsURIPrefix = "/operations"
	operationURIPrefix  = "/operations/{name}"

	operationSetsURIPrefix = "/operationSets"
	operationSetURIPrefix  = "/operationSets/{name}"

	triggersURIPrefix = "/triggers"
	triggerURIPrefix  = "/triggers/{name}"

	diagnosesURIPrefix = "/diagnoses"
	diagnosisURIPrefix = "/diagnoses/{name}"

	nodesURIPrefix     = "/nodes"
	namespaceURIPrefix = "/namespaces"
	podsURIPrefix      = "/namespaces/{namespace}/pods"
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

//check name valid, refer: https://kubernetes.io/docs/concepts/overview/working-with-objects/names
func (server *httpServer) checkName(writer http.ResponseWriter, req *http.Request) {
	vars := mux.Vars(req)
	err := validation.IsDNS1123Subdomain(vars["name"])
	if err != nil {
		GenerateHandlerResult(writer, nil, err, false)
		return
	}
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
	diagnosisList, err := server.cli.DiagnosisList(opts)
	if err != nil {
		GenerateHandlerResult(writer, nil, err, false)
		return
	}
	triggerList, err := server.cli.TriggerList(opts)
	if err != nil {
		GenerateHandlerResult(writer, nil, err, false)
		return
	}
	resourceCount := make(map[string]int)
	resourceCount["operation"] = len(operationList.Items)
	resourceCount["operationSet"] = len(operationSetList.Items)
	resourceCount["diagnosis"] = len(diagnosisList.Items)
	resourceCount["trigger"] = len(triggerList.Items)
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
	var createReq OperationSetCreateReq
	body, err := parseBody(req)
	if err != nil {
		GenerateHandlerResult(writer, nil, err.Error(), false)
		return
	}
	err = json.Unmarshal(body, &createReq)
	if err != nil {
		GenerateHandlerResult(writer, nil, err.Error(), false)
		return
	}
	operationSet, paths := NewOperationSet(&createReq, body)
	opts := runtimeclient.CreateOptions{}
	createErr := server.cli.OperationSetAdd(operationSet, &opts)
	if createErr != nil {
		GenerateHandlerResult(writer, nil, createErr.Error(), false)
		return
	}
	GenerateHandlerResult(writer, nil, paths, true)
}

func (server *httpServer) diagnosisList(writer http.ResponseWriter, req *http.Request) {
	opts := &runtimeclient.ListOptions{}
	diagnosisList, err := server.cli.DiagnosisList(opts)
	if err != nil {
		GenerateHandlerResult(writer, nil, err, false)
		return
	}
	result := []DiagnosisVO{}
	for index := range diagnosisList.Items {
		result = append(result, *NewDiagnosisVO(&diagnosisList.Items[index]))
	}
	GenerateHandlerResult(writer, nil, result, true)
}

func (server *httpServer) diagnosisAdd(writer http.ResponseWriter, req *http.Request) {
	var createReq DiagnosisCreateReq
	err := parseBodyWithObj(req, &createReq)
	if err != nil {
		GenerateHandlerResult(writer, nil, err.Error(), false)
		return
	}
	diagnosis := NewDiagnosis(&createReq)
	opts := runtimeclient.CreateOptions{}
	err = server.cli.DiagnosisAdd(diagnosis, &opts)
	if err != nil {
		GenerateHandlerResult(writer, nil, err.Error(), false)
		return
	}
	GenerateHandlerResult(writer, nil, "", true)

}

func (server *httpServer) triggerList(writer http.ResponseWriter, req *http.Request) {
	opts := &runtimeclient.ListOptions{}
	triggerList, err := server.cli.TriggerList(opts)
	if err != nil {
		GenerateHandlerResult(writer, nil, err, false)
		return
	}
	result := []TriggerVO{}
	for index := range triggerList.Items {
		result = append(result, *NewTriggerVO(&triggerList.Items[index]))
	}
	GenerateHandlerResult(writer, nil, result, true)
}

func (server *httpServer) triggerAdd(writer http.ResponseWriter, req *http.Request) {
	var createReq TriggerCreateReq
	err := parseBodyWithObj(req, &createReq)
	if err != nil {
		GenerateHandlerResult(writer, nil, err.Error(), false)
		return
	}
	trigger := NewTrigger(&createReq)
	opts := runtimeclient.CreateOptions{}
	err = server.cli.TriggerAdd(trigger, &opts)
	if err != nil {
		GenerateHandlerResult(writer, nil, err.Error(), false)
		return
	}
	GenerateHandlerResult(writer, nil, "", true)
}

func (server *httpServer) podList(writer http.ResponseWriter, req *http.Request) {
	var namespace string
	vars := mux.Vars(req)
	if v, ok := vars["namespace"]; ok {
		namespace = v
	}
	opts := runtimeclient.ListOptions{
		Namespace: namespace,
	}
	podList, err := server.cli.PodList(&opts)
	if err != nil {
		GenerateHandlerResult(writer, nil, err.Error(), false)
		return
	}
	result := make(map[string][]string)
	for _, pod := range podList.Items {
		var containerNames []string
		containers := pod.Spec.Containers
		for _, container := range containers {
			containerNames = append(containerNames, container.Name)
		}
		result[pod.Name] = containerNames
	}
	GenerateHandlerResult(writer, nil, result, true)
}

func (server *httpServer) nodeList(writer http.ResponseWriter, req *http.Request) {
	var opts runtimeclient.ListOptions
	nodeList, err := server.cli.NodeList(&opts)
	if err != nil {
		GenerateHandlerResult(writer, nil, err.Error(), false)
		return
	}
	var result []string
	for _, item := range nodeList.Items {
		result = append(result, item.Name)
	}
	GenerateHandlerResult(writer, nil, result, true)
}

func (server *httpServer) namespaceList(writer http.ResponseWriter, req *http.Request) {
	var opts runtimeclient.ListOptions
	namespaceList, err := server.cli.NamespaceList(&opts)
	if err != nil {
		GenerateHandlerResult(writer, nil, err.Error(), false)
		return
	}
	var result []string
	for _, item := range namespaceList.Items {
		result = append(result, item.Name)
	}
	GenerateHandlerResult(writer, nil, result, true)
}

func (server *httpServer) StartHttpServer() error {
	router := mux.NewRouter()
	//health
	router.HandleFunc(health, server.checkHealth).Methods(http.MethodGet)
	router.HandleFunc(v1Path(summaryURIPrefix), server.summary).Methods(http.MethodGet)
	router.HandleFunc(v1Path(checkName), server.checkName).Methods(http.MethodGet)

	//static resource
	router.HandleFunc(index, server.index).Methods(http.MethodGet)
	router.PathPrefix(static).HandlerFunc(server.static).Methods(http.MethodGet)

	//inner resource
	router.HandleFunc(v1Path(nodesURIPrefix), server.nodeList).Methods(http.MethodGet)
	router.HandleFunc(v1Path(namespaceURIPrefix), server.namespaceList).Methods(http.MethodGet)
	router.HandleFunc(v1Path(podsURIPrefix), server.podList).Methods(http.MethodGet)

	//operation v1
	router.HandleFunc(v1Path(operationsURIPrefix), server.operationList).Methods(http.MethodGet)

	//operationSet v1
	router.HandleFunc(v1Path(operationSetsURIPrefix), server.operationSetList).Methods(http.MethodGet)
	router.HandleFunc(v1Path(operationSetsURIPrefix), server.operationSetAdd).Methods(http.MethodPost)

	//trigger v1
	router.HandleFunc(v1Path(triggersURIPrefix), server.triggerList).Methods(http.MethodGet)
	router.HandleFunc(v1Path(triggerURIPrefix), server.triggerAdd).Methods(http.MethodPost)

	//diagnosis v1
	router.HandleFunc(v1Path(diagnosesURIPrefix), server.diagnosisList).Methods(http.MethodGet)
	router.HandleFunc(v1Path(diagnosisURIPrefix), server.diagnosisAdd).Methods(http.MethodPost)

	return http.ListenAndServe(server.host+":"+server.port, router)
}

func v1Path(path string) string {
	return v1 + path
}

func parseBodyWithObj(req *http.Request, obj interface{}) error {
	body, err := parseBody(req)
	if err != nil {
		return err
	}
	jsonErr := json.Unmarshal(body, &obj)
	if jsonErr != nil {
		return jsonErr
	}
	return nil
}

func parseBody(req *http.Request) ([]byte, error) {
	if req.Body == nil {
		return nil, errors.New(errorInvalidParams)
	}
	body, err := io.ReadAll(req.Body)
	if err != nil {
		return nil, err
	}
	return body, nil
}
