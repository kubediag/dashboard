# Dashboard

Dashboard is a general purpose, web-based UI for KubeDiag.

## Installation

Please make sure you have installed [KubeDiag](https://github.com/kubediag/kubediag) before installing dashboard. The simplest way to install dashboard is running the following command:

```shell
kubectl apply -f https://raw.githubusercontent.com/kubediag/dashboard/master/config/deploy/manifests.yaml
```

The dashboard is ready if the pod is in running state:

```shell
$ kubectl get pod -n kubediag -l app=kubediag-dashboard
NAME                                  READY   STATUS    RESTARTS   AGE
kubediag-dashboard-75bccc5f8f-xxmgk   1/1     Running   0          3m20s
```

A `NodePort` service is deployed and exposed on port 30055 on the node:

```shell
$ kubectl get service -n kubediag kubediag-dashboard
NAME                 TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
kubediag-dashboard   NodePort   10.104.255.77   <none>        80:30055/TCP   5m46s
```
