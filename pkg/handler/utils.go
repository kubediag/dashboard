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
	"net/http"

	"k8s.io/klog/v2"
)

const (
	contentType     = "Content-Type"
	contentTypeJSON = "application/json;charset=UTF-8"
)

type Result struct {
	Success bool        `json:"success,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Message interface{} `json:"message,omitempty"`
}

func GenerateErrorMessage(prefix string, err error) string {
	if prefix == "" {
		return err.Error()
	}
	return prefix + ":" + err.Error()
}

func GenerateHandlerResult(writer http.ResponseWriter, header map[string]string, data interface{}, success bool) {
	for k, v := range header {
		writer.Header().Add(k, v)
	}
	writer.Header().Set(contentType, contentTypeJSON)
	var result *Result
	if success {
		result = &Result{
			Success: true,
			Data:    data,
		}
	} else {
		klog.Error(data)
		result = &Result{
			Success: false,
			Message: data,
		}
	}
	json.NewEncoder(writer).Encode(result)
}
