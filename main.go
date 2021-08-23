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

package main

import (
	"flag"
	"os"

	"github.com/kubediag/dashboard/pkg/client"
	"github.com/kubediag/dashboard/pkg/handler"
	"github.com/spf13/cobra"
	"github.com/spf13/pflag"
	"k8s.io/klog/v2"
)

func NewRunCommand() *cobra.Command {
	var host string
	var port string
	var kubeconfig string
	cmd := &cobra.Command{
		Use: "kubediag-dashboard",
		RunE: func(cmd *cobra.Command, args []string) error {
			cli, err := client.NewClient(kubeconfig)
			if err != nil {
				return err
			}
			httpServer := handler.NewHttpServer(cli, host, port)
			klog.Info("starting")
			return httpServer.StartHttpServer()
		},
	}
	cmd.Flags().StringVarP(&host, "host", "", "0.0.0.0", "The IP address on which to listen for the --port port")
	cmd.Flags().StringVarP(&port, "port", "", "8080", "The port on which to serve")
	cmd.Flags().StringVarP(&kubeconfig, "kubeconfig", "", "", "Path to kubeconfig file")
	klog.InitFlags(nil)
	pflag.CommandLine.AddGoFlagSet(flag.CommandLine)
	return cmd
}

func main() {
	cmd := NewRunCommand()
	if err := cmd.Execute(); err != nil {
		os.Exit(1)
	}
}
