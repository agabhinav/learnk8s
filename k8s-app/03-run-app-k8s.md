## Running an Express App in Kubernetes
### PART-3: Run Application in a K8s Cluster

**Agenda**
* Run application in a K8s cluster.

**Start a minikube cluster with 2 nodes.**

```
~/learnk8s/k8s-app> minikube start --nodes 2 -p multinode

...
👍  Starting control plane node multinode in cluster multinode
...
👍  Starting worker node multinode-m02 in cluster multinode

~/learnk8s/k8s-app> minikube profile list
|-----------|-----------|---------|--------------|------|---------|---------|-------|--------|
|  Profile  | VM Driver | Runtime |      IP      | Port | Version | Status  | Nodes | Active |
|-----------|-----------|---------|--------------|------|---------|---------|-------|--------|
| multinode | docker    | docker  | 192.168.58.2 | 8443 | v1.26.3 | Running |     2 |        |
|-----------|-----------|---------|--------------|------|---------|---------|-------|--------|
```

Switch to the newly created cluster to make it active.  

```
~/learnk8s/k8s-app> minikube profile multinode
✅  minikube profile was successfully set to multinode
```
Verify kubectl command runs against the active cluster.  
```
~/learnk8s/k8s-app> kubectl get nodes
NAME            STATUS   ROLES           AGE    VERSION
multinode       Ready    control-plane   2m3s   v1.26.3
multinode-m02   Ready    <none>          98s    v1.26.3
```

---

**Create Kubernetes Manifests**

Create a directory `k8s-yaml` to store the Kubernetes manifests required for the app.  

Create a `deployment.yaml` as shown below. Update the image to point to your Docker Hub account.  

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
  labels:
    app: myapp
spec: # DeploymentSpec
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template: # PodTemplate
    metadata:
      labels:
        app: myapp
    spec: # PodSpec
      containers:
      - name: myapp
        image: YOUR_DOCKERHUB_ACCOUNT/k8s-app:0.0.1
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
        ports:
        - containerPort: 3000

```

Create a `service.yaml` as shown below. A `LoadBalancer` service is the standard way to expose a service to the internet. With this method, each service gets its own IP address.  

```yaml
apiVersion: v1
kind: Service
metadata:
  name: myapp-svc
spec:
  type: LoadBalancer
  selector:
    app: myapp
  ports:
  - port: 3000
    targetPort: 3000
```

Run `kubectl apply -f .` to apply the configuration.  

```
~/learnk8s/k8s-app/k8s-yaml> kubectl apply -f .
deployment.apps/myapp-depl created
service/myapp-svc created
```

View the newly created resources. Notice that `EXTERNAL-ID` for `myapp-svc` is `<pending>`.

```
~/learnk8s> kubectl get deployment,services
NAME                    READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/myapp   3/3     3            3           4m35s

NAME                 TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
service/kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          72m
service/myapp-svc    LoadBalancer   10.101.251.35   <pending>     3000:32288/TCP   4m35s

~/learnk8s> kubectl get pods -o wide
NAME                    READY   STATUS    RESTARTS   AGE    IP           NODE            NOMINATED NODE   READINESS GATES
myapp-cbb8d86c7-2mz48   1/1     Running   0          5m3s   10.244.0.4   multinode       <none>           <none>
myapp-cbb8d86c7-jq5ps   1/1     Running   0          5m3s   10.244.1.4   multinode-m02   <none>           <none>
myapp-cbb8d86c7-v69q9   1/1     Running   0          5m3s   10.244.1.5   multinode-m02   <none>           <none>
~/learnk8s
```

Using `minikube tunnel`  
Services of type `LoadBalancer` can be exposed via the minikube tunnel command. It must be run in a separate terminal window to keep the LoadBalancer running. Ctrl-C in the terminal can be used to terminate the process at which time the network routes will be cleaned up.

Run the tunnel in a separate terminal.

```
~/learnk8s> minikube tunnel
✅  Tunnel successfully started

📌  NOTE: Please do not close this terminal as this process must stay alive for the tunnel to be accessible ...

🏃  Starting tunnel for service myapp-svc.
```

Check the `EXTERNAL-IP` for `myapp-svc` again.  

```
~/learnk8s> kubectl get services
NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          74m
myapp-svc    LoadBalancer   10.101.251.35   127.0.0.1     3000:32288/TCP   6m27s
```

Verify output using browser or by using curl command from a terminal.  

```
~> curl localhost:3000
HOSTNAME: myapp-cbb8d86c7-jq5ps, IP: 10.244.1.4~>
~> curl localhost:3000
HOSTNAME: myapp-cbb8d86c7-2mz48, IP: 10.244.0.4~>
~> curl localhost:3000
HOSTNAME: myapp-cbb8d86c7-v69q9, IP: 10.244.1.5~>
~>
```

Cleanup using `kubectl delete`.

```
~/learnk8s/k8s-app/k8s-yaml> k delete -f .
deployment.apps "myapp" deleted
service "myapp-svc" deleted
```