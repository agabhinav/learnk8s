## Namespaces

Ref: [Namespaces](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/)

**Agenda**
* Create a namespace.
* Create a resource in the namespace.

> Start a Kubernetes cluster using `minikube start`.

**Create namespace - imperative**  
`kubectl create namespace <insert-namespace-name-here>`

```
$ kubectl create namespace ns-imperative
namespace/ns-imperative created

$ kubectl get ns --show-labels
NAME              STATUS   AGE   LABELS
default           Active   31h   kubernetes.io/metadata.name=default
kube-node-lease   Active   31h   kubernetes.io/metadata.name=kube-node-lease
kube-public       Active   31h   kubernetes.io/metadata.name=kube-public
kube-system       Active   31h   kubernetes.io/metadata.name=kube-system
ns-imperative     Active   30s   kubernetes.io/metadata.name=ns-imperative
```

**Create namespace using YAML file- declarative**  
Ref: https://kubernetes.io/docs/reference/kubernetes-api/cluster-resources/namespace-v1/

Save the following YAML file in your directory.  
File: [1.1-k8s-namespace.yaml](yaml/1.1-k8s-namespace.yaml)

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: ns-declarative
  labels:
    name: ns-declarative
```

Run the command `kubectl apply -f <YAML-FILE>` to create the namespace in a declarative manner.

```
~/learnk8s> kubectl apply -f yaml/1-k8s-namespace.yaml 
namespace/ns-declarative created

~/learnk8s> kubectl get namespaces --show-labels
NAME              STATUS   AGE   LABELS
default           Active   32h   kubernetes.io/metadata.name=default
kube-node-lease   Active   32h   kubernetes.io/metadata.name=kube-node-lease
kube-public       Active   32h   kubernetes.io/metadata.name=kube-public
kube-system       Active   32h   kubernetes.io/metadata.name=kube-system
ns-declarative    Active   81s   kubernetes.io/metadata.name=ns-declarative,name=ns-declarative
ns-imperative     Active   30m   kubernetes.io/metadata.name=ns-imperative
```

**Creating a resource in the namespace**  
You can create Kubernetes objects like Deployment, Service, Pods etc. in a particular namespace by using `--namespace=<name>` from command line (imperative), or by specifying namespace in `metadata.namespace` in the YAML file (declarative).

Save the following YAML file in your directory.  
File: [1.2-k8s-namespace-pod.yaml](yaml/1.2-k8s-namespace-pod.yaml)

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  namespace: ns-declarative
spec:
  containers:
  - name: nginx
    image: nginx:latest
    ports:
    - containerPort: 80
    resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
```

Use `kubectl apply -f YAML_FILE` to create the Pod in the specified namespace.
```
~/learnk8s> kubectl apply -f yaml/1.2-k8s-namespace-pod.yaml 
pod/nginx created
~/learnk8s> kubectl get pods --namespace ns-declarative
NAME    READY   STATUS              RESTARTS   AGE
nginx   0/1     ContainerCreating   0          3s
~/learnk8s> kubectl get pods
No resources found in default namespace.
```

**Note:** By default, kubectl command operates on the `default` namespace. To set the namespace for the current request, use `--namespace` flag as shown above.

You can permanently save the namespace preference for all subsequent kubectl commands in that context using `kubectl config set-context --current --namespace=<insert-namespace-name-here>`. Now you can run `kubectl` commands without specifying `--namespace` flag.

```
~/learnk8s> kubectl config set-context --current --namespace=ns-declarative
Context "multinode" modified.
~/learnk8s> kubectl get pods
NAME    READY   STATUS    RESTARTS   AGE
nginx   1/1     Running   0          6m44s
```

**Cleanup**  
Delete namespaces. This will also delete the resources within those namespaces.  
Switch to the default namespace.
```
~/learnk8s> kubectl delete namespace ns-imperative
namespace "ns-imperative" deleted
~/learnk8s> kubectl delete namespace ns-declarative
namespace "ns-declarative" deleted
~/learnk8s> kubectl config set-context --current --namespace=default
Context "multinode" modified.
```