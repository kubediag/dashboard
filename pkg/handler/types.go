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

type TriggerType string

//annotation
const (
	defaultVersion       = "v1"
	prefix               = "diagnosis.kubediag.org/"
	descAnnotation       = prefix + "desc"
	maintainerAnnotation = prefix + "maintainer"
	reqAnnotation        = prefix + "dashboard-req"
	nodePrefix           = "(node)"
	podPrefix            = "(pod)"

	prometheusAlertTrigger TriggerType = "prometheus-alert"
	kubeEventTrigger       TriggerType = "kube-event"
	defaultNamespace                   = "default"
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

type DiagnosisVO struct {
	Name       string               `json:"name,omitempty"`
	Target     string               `json:"target,omitempty"`
	Maintainer string               `json:"maintainer,omitempty"`
	Phase      string               `json:"phase,omitempty"`
	StartTime  time.Time            `json:"startTime,omitempty"`
	Result     map[string]string    `json:"result,omitempty"`
	Detail     *diagApiV1.Diagnosis `json:"detail,omitempty"`
}

type TriggerVO struct {
	Name         string             `json:"name,omitempty"`
	OperationSet string             `json:"operationSet,omitempty"`
	Type         TriggerType        `json:"type,omitempty"`
	Maintainer   string             `json:"maintainer,omitempty"`
	Detail       *diagApiV1.Trigger `json:"detail,omitempty"`
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

type DiagnosisCreateReq struct {
	Name      string                  `json:"name,omitempty"`
	Namespace string                  `json:"namespace,omitempty"`
	Spec      diagApiV1.DiagnosisSpec `json:"spec,omitempty"`
}

type TriggerCreateReq struct {
	Name                    string                             `json:"name,omitempty"`
	OperationSet            string                             `json:"operationSet,omitempty"`
	PrometheusAlertTemplate *diagApiV1.PrometheusAlertTemplate `json:"prometheusAlertTemplate,omitempty"`
	KubernetesEventTemplate *diagApiV1.KubernetesEventTemplate `json:"kubernetesEventTemplate,omitempty"`
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

func NewDiagnosisVO(diagnosis *diagApiV1.Diagnosis) *DiagnosisVO {
	var vo DiagnosisVO
	vo.Name = diagnosis.Name
	spec := &diagnosis.Spec
	if spec.NodeName != "" {
		vo.Target = nodePrefix + spec.NodeName
	} else if spec.PodReference != nil {
		refer := spec.PodReference
		vo.Target = podPrefix + refer.NamespacedName.Namespace + "/" + refer.NamespacedName.Name
		if refer.Container != "" {
			vo.Target = vo.Target + "/" + refer.Container
		}
	}
	status := &diagnosis.Status
	vo.StartTime = status.StartTime.Time
	vo.Result = status.OperationResults
	vo.Phase = string(status.Phase)
	vo.Detail = diagnosis
	return &vo
}

func NewTriggerVO(trigger *diagApiV1.Trigger) *TriggerVO {
	var vo TriggerVO
	vo.Name = trigger.Name
	spec := &trigger.Spec
	vo.OperationSet = spec.OperationSet
	if spec.SourceTemplate.PrometheusAlertTemplate != nil {
		vo.Type = prometheusAlertTrigger
	} else if spec.SourceTemplate.KubernetesEventTemplate != nil {
		vo.Type = kubeEventTrigger
	}
	vo.Detail = trigger
	return &vo
}

func NewTrigger(req *TriggerCreateReq) *diagApiV1.Trigger {
	trigger := diagApiV1.Trigger{}
	trigger.SetName(req.Name)
	trigger.Spec.OperationSet = req.OperationSet
	if req.PrometheusAlertTemplate != nil {
		trigger.Spec.SourceTemplate.PrometheusAlertTemplate = req.PrometheusAlertTemplate
	}
	if req.KubernetesEventTemplate != nil {
		trigger.Spec.SourceTemplate.KubernetesEventTemplate = req.KubernetesEventTemplate
	}
	return &trigger
}

func NewDiagnosis(req *DiagnosisCreateReq) *diagApiV1.Diagnosis {
	diagnosis := diagApiV1.Diagnosis{}
	diagnosis.Name = req.Name
	diagnosis.Spec = req.Spec
	if req.Namespace != "" {
		diagnosis.Namespace = req.Namespace
	} else {
		diagnosis.Namespace = defaultNamespace
	}
	return &diagnosis
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
