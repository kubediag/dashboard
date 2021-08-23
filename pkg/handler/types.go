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
	"encoding/json"
	"time"

	diagApiV1 "github.com/kubediag/kubediag/api/v1"
)

//annotation
const (
	defaultVersion       = "v1"
	prefix               = "diagnosis.kubediag.org/"
	descAnnotation       = prefix + "desc"
	maintainerAnnotation = prefix + "maintainer"
	reqAnnotation        = prefix + "dashboard-req"
)

type SummaryVO struct {
	ResourceCount map[string]int `json:"resourceCount,omitempty"`
}

type OperationSetVO struct {
	Name       string                  `json:"name,omitempty"`
	Desc       string                  `json:"desc,omitempty"`
	Version    string                  `json:"version,omitempty"`
	Maintainer string                  `json:"maintainer,omitempty"`
	UpdateTime time.Time               `json:"time,omitempty"`
	Req        OperationSetCreateReq   `json:"req,omitempty"`
	Detail     *diagApiV1.OperationSet `json:"detail,omitempty"`
}

type OperationVO struct {
	Name       string               `json:"name,omitempty"`
	Desc       string               `json:"desc,omitempty"`
	Version    string               `json:"version,omitempty"`
	Maintainer string               `json:"maintainer,omitempty"`
	UpdateTime time.Time            `json:"time,omitempty"`
	Detail     *diagApiV1.Operation `json:"detail,omitempty"`
}

type OperationSetCreateReq struct {
	Name       string                        `json:"name,omitempty"`
	Desc       string                        `json:"desc,omitempty"`
	Maintainer string                        `json:"maintainer,omitempty"`
	Data       OperationSetCreateReqChildren `json:"data,omitempty"`
}

type OperationSetCreateReqChildren struct {
	Id       int                             `json:"id,omitempty"`
	ParentId int                             `json:"parentId,omitempty"`
	Name     string                          `json:"name,omitempty"`
	State    string                          `json:"state,omitempty"`
	Children []OperationSetCreateReqChildren `json:"children,omitempty"`
}

func NewOperationSetVO(operationSet *diagApiV1.OperationSet) *OperationSetVO {
	operationSetVO := OperationSetVO{
		Name:       operationSet.Name,
		Desc:       operationSet.GetAnnotations()[descAnnotation],
		Version:    defaultVersion,
		Maintainer: operationSet.GetAnnotations()[maintainerAnnotation],
		UpdateTime: operationSet.CreationTimestamp.Time,
		Detail:     operationSet,
	}
	if reqStr, exist := operationSet.GetAnnotations()[reqAnnotation]; exist {
		var req OperationSetCreateReq
		json.Unmarshal([]byte(reqStr), &req)
		operationSetVO.Req = req
	}
	return &operationSetVO
}

func NewOperationVO(operation *diagApiV1.Operation) *OperationVO {
	return &OperationVO{
		Name:       operation.Name,
		Desc:       operation.GetAnnotations()[descAnnotation],
		Version:    defaultVersion,
		Maintainer: operation.GetAnnotations()[maintainerAnnotation],
		UpdateTime: operation.CreationTimestamp.Time,
		Detail:     operation,
	}
}

func NewOperationSet(req *OperationSetCreateReq, raw []byte) (*diagApiV1.OperationSet, *[]string) {
	operationSet := diagApiV1.OperationSet{}
	operationSet.SetName(req.Name)
	annotations := map[string]string{}
	if req.Maintainer != "" {
		annotations[maintainerAnnotation] = req.Maintainer
	}
	if req.Desc != "" {
		annotations[descAnnotation] = req.Desc
	}
	annotations[reqAnnotation] = string(raw)
	operationSet.SetAnnotations(annotations)

	nodeList := []diagApiV1.Node{}
	root := diagApiV1.Node{
		To: diagApiV1.NodeSet{1},
	}
	nodeList = append(nodeList, root)
	traverseChildren(&req.Data, &nodeList)
	operationSet.Spec = diagApiV1.OperationSetSpec{
		AdjacencyList: nodeList,
	}
	var path []string
	traverseNode("", 1, &nodeList, &path)
	return &operationSet, &path
}

func traverseChildren(parent *OperationSetCreateReqChildren, nodeList *[]diagApiV1.Node) int {
	index := len(*nodeList)
	parentNode := diagApiV1.Node{
		To:        diagApiV1.NodeSet{},
		Operation: parent.Name,
	}
	*nodeList = append(*nodeList, parentNode)
	for i := range parent.Children {
		childIndex := traverseChildren(&(parent.Children[i]), nodeList)
		(*nodeList)[index].To = append((*nodeList)[index].To, childIndex)
	}
	return index
}

func traverseNode(prefix string, start int, nodeList *[]diagApiV1.Node, path *[]string) {
	if prefix != "" {
		prefix = prefix + "->" + (*nodeList)[start].Operation
	} else {
		prefix = (*nodeList)[start].Operation
	}

	if len((*nodeList)[start].To) == 0 {
		*path = append(*path, prefix)
		return
	}
	for _, index := range (*nodeList)[start].To {
		traverseNode(prefix, index, nodeList, path)
	}
}
