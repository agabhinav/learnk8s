## Using Secrets as environment variables

References:  
[Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)   
[Kubernetes API: Secret](https://kubernetes.io/docs/reference/kubernetes-api/config-and-storage-resources/secret-v1/)  

**Agenda**
* Background.  
* Create a Secret and a Pod that uses the Secret (1) as container environment variable, and (2) as files in a volume mounted on the container.  
* Cleanup.

> Start a Kubernetes cluster using `minikube start`.

**Using Secrets as environment variables**  



**Create Secret and Pod that uses the secret using config file**  
The manifest file used in this lab has Secret and Pod configuration in the same file separated by `---` in YAML.  

Secret:  
name=mysecret  
data has two strings _admin_ and _mypassword_ in base64.  

Pod:  
Uses Secret as env variable and as file in a volume.  

Create the manifest. Save the following YAML file in your directory.  
File: [7-k8s-secret-env-vol.yaml](yaml/7-k8s-secret-env-vol.yaml)

![Secret and Pod Manifest](images/k8s-yaml-secret-2.png)

Apply the configuration using using `kubectl apply -f YAML_FILE`.  

```console
~/learnk8s> kubectl apply -f yaml/6-k8s-secret.yaml 
secret/mysecret created
```

**Secret verification and decoding**  

```console
~/learnk8s> kubectl get secrets
NAME       TYPE     DATA   AGE
mysecret   Opaque   2      3m49s
~/learnk8s> kubectl describe secret mysecret
Name:         mysecret
Namespace:    default
Labels:       <none>
Annotations:  <none>

Type:  Opaque

Data
====
password:  10 bytes
username:  5 bytes
```

The commands `kubectl get` and `kubectl describe` avoid showing the contents of a `Secret` by default. This is to protect the `Secret` from being exposed accidentally, or from being stored in a terminal log.

To decode the password field stored in the secret, run the following command.

```console
~/learnk8s> kubectl get secret mysecret -o jsonpath='{.data.password}' | base64 --decode
mypassword
```

**Cleanup**  
To delete a Secret, run the following command:

```console
~/learnk8s> kubectl delete secret mysecret
secret "mysecret" deleted
```