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

package client

import (
	"context"

	diagApiV1 "github.com/kubediag/kubediag/api/v1"
	"k8s.io/apimachinery/pkg/runtime"
	innerScheme "k8s.io/client-go/kubernetes/scheme"
	"k8s.io/client-go/tools/clientcmd"
	runtimeClient "sigs.k8s.io/controller-runtime/pkg/client"
)

var _ Client = &client{}

type Client interface {
	OperationList(opts ...runtimeClient.ListOption) (*diagApiV1.OperationList, error)
	OperationAdd(operation *diagApiV1.Operation, opts ...runtimeClient.CreateOption) error
	OperationUpdate(operation *diagApiV1.Operation, opts ...runtimeClient.UpdateOption) error
	OperationDel(operation *diagApiV1.Operation, opts ...runtimeClient.DeleteOption) error
	OperationSetList(opts ...runtimeClient.ListOption) (*diagApiV1.OperationSetList, error)
	OperationSetAdd(operationSet *diagApiV1.OperationSet, opts ...runtimeClient.CreateOption) error
	OperationSetUpdate(operationSet *diagApiV1.OperationSet, opts ...runtimeClient.UpdateOption) error
	OperationSetDel(operationSet *diagApiV1.OperationSet, opts ...runtimeClient.DeleteOption) error
	DiagnosisList(opts ...runtimeClient.ListOption) (*diagApiV1.DiagnosisList, error)
	DiagnosisAdd(diagnosis *diagApiV1.Diagnosis, opts ...runtimeClient.CreateOption) error
	DiagnosisUpdate(diagnosis *diagApiV1.Diagnosis, opts ...runtimeClient.UpdateOption) error
	DiagnosisDel(diagnosis *diagApiV1.Diagnosis, opts ...runtimeClient.DeleteOption) error
	TriggerList(opts ...runtimeClient.ListOption) (*diagApiV1.TriggerList, error)
	TriggerAdd(trigger *diagApiV1.Trigger, opts ...runtimeClient.CreateOption) error
	TriggerUpdate(trigger *diagApiV1.Trigger, opts ...runtimeClient.UpdateOption) error
	TriggerDel(trigger *diagApiV1.Trigger, opts ...runtimeClient.DeleteOption) error
}

type client struct {
	runtimeClient.Client
}

func (cli *client) OperationList(opts ...runtimeClient.ListOption) (*diagApiV1.OperationList, error) {
	var operationList diagApiV1.OperationList
	if err := cli.List(context.Background(), &operationList, opts...); err != nil {
		return nil, err
	}
	return &operationList, nil

}
func (cli *client) OperationAdd(operation *diagApiV1.Operation, opts ...runtimeClient.CreateOption) error {
	return cli.Create(context.Background(), operation, opts...)

}
func (cli *client) OperationUpdate(operation *diagApiV1.Operation, opts ...runtimeClient.UpdateOption) error {
	return cli.Update(context.Background(), operation, opts...)
}
func (cli *client) OperationDel(operation *diagApiV1.Operation, opts ...runtimeClient.DeleteOption) error {
	return cli.Delete(context.Background(), operation, opts...)

}

func (cli *client) OperationSetList(opts ...runtimeClient.ListOption) (*diagApiV1.OperationSetList, error) {
	var operationSetList diagApiV1.OperationSetList
	if err := cli.List(context.Background(), &operationSetList, opts...); err != nil {
		return nil, err
	}
	return &operationSetList, nil

}
func (cli *client) OperationSetAdd(operationSet *diagApiV1.OperationSet, opts ...runtimeClient.CreateOption) error {
	return cli.Create(context.Background(), operationSet, opts...)

}
func (cli *client) OperationSetUpdate(operationSet *diagApiV1.OperationSet, opts ...runtimeClient.UpdateOption) error {
	return cli.Update(context.Background(), operationSet, opts...)
}
func (cli *client) OperationSetDel(operationSet *diagApiV1.OperationSet, opts ...runtimeClient.DeleteOption) error {
	return cli.Delete(context.Background(), operationSet, opts...)

}

func (cli *client) DiagnosisList(opts ...runtimeClient.ListOption) (*diagApiV1.DiagnosisList, error) {
	var diagnosisList diagApiV1.DiagnosisList
	if err := cli.List(context.Background(), &diagnosisList, opts...); err != nil {
		return nil, err
	}
	return &diagnosisList, nil

}

func (cli *client) DiagnosisAdd(diagnosis *diagApiV1.Diagnosis, opts ...runtimeClient.CreateOption) error {
	return cli.Create(context.Background(), diagnosis, opts...)

}

func (cli *client) DiagnosisUpdate(diagnosis *diagApiV1.Diagnosis, opts ...runtimeClient.UpdateOption) error {
	return cli.Update(context.Background(), diagnosis, opts...)
}

func (cli *client) DiagnosisDel(diagnosis *diagApiV1.Diagnosis, opts ...runtimeClient.DeleteOption) error {
	return cli.Delete(context.Background(), diagnosis, opts...)
}

func (cli *client) TriggerList(opts ...runtimeClient.ListOption) (*diagApiV1.TriggerList, error) {
	var triggerList diagApiV1.TriggerList
	if err := cli.List(context.Background(), &triggerList, opts...); err != nil {
		return nil, err
	}
	return &triggerList, nil

}

func (cli *client) TriggerAdd(trigger *diagApiV1.Trigger, opts ...runtimeClient.CreateOption) error {
	return cli.Create(context.Background(), trigger, opts...)

}

func (cli *client) TriggerUpdate(trigger *diagApiV1.Trigger, opts ...runtimeClient.UpdateOption) error {
	return cli.Update(context.Background(), trigger, opts...)
}

func (cli *client) TriggerDel(trigger *diagApiV1.Trigger, opts ...runtimeClient.DeleteOption) error {
	return cli.Delete(context.Background(), trigger, opts...)
}

func NewClient(kubeconfig string) (Client, error) {
	clientConfig, err := clientcmd.BuildConfigFromFlags("", kubeconfig)
	if err != nil {
		return nil, err
	}
	scheme := runtime.NewScheme()
	innerScheme.AddToScheme(scheme)
	diagApiV1.AddToScheme(scheme)
	cli, err := runtimeClient.New(clientConfig, runtimeClient.Options{Scheme: scheme})
	if err != nil {
		return nil, err
	}
	return &client{cli}, nil
}
