## Jobs

References:  
[Kubernetes API: Job](https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/job-v1/)  

**Agenda**
* Overview.
* Create a Job.
* Cleanup.

> Start a Kubernetes cluster using `minikube start`.

**Overview: Job vs Deployment**  
A Kubernetes Job is a resource that creates and manages one or more pods to complete a specific task or job within a cluster.

| Job | Deployment |
| --- | ---------- |
| Used for running batch or one-time tasks. | Used for managing long-running services in a scalable and fault-tolerant manner. |
| It ensures that a task completes successfully, and if it fails, it can be retried. | It ensures that a specified number of replicas (Pod instances) are running at all times, enabling features like automatic scaling, rolling updates, and rollbacks. |
| Suitable for tasks like data processing, backups, or periodic cron jobs. | Suitable for applications that provide ongoing services or microservices. |

**Example**  
The following `Job` will start a [BusyBox](https://hub.docker.com/_/busybox) container which executes some shell commands.  
Create the manifest. Save the following YAML file in your directory.  
File: [k8s-job-1.yaml](yaml/k8s-job-1.yaml)  

```yaml
# Start a busybox container which executes some shell commands
apiVersion: batch/v1
kind: Job
metadata:
  name: job1
spec: # JobSpec
  template: # PodTemplateSpec
    spec: # PodSpec
      containers: # List of containers belonging to the pod
      - name: job-container
        image: busybox
        command: ["/bin/sh"]
        args:
          - "-c"
          - "date; echo sleeping..; sleep 100s; echo exiting..; date"
      restartPolicy: Never
```

Apply the configuration using `kubectl apply -f YAML_FILE`.  
Check the `Job` and its associated `Pod`.  
You should see a `Pod` in `Running` state.
```console
~/learnk8s> kubectl apply -f yaml/k8s-job-1.yaml 
job.batch/job1 created
~/learnk8s> kubectl get job.batch/job1
NAME   COMPLETIONS   DURATION   AGE
job1   0/1           28s        28s
~/learnk8s> kubectl get pods --show-labels
NAME         READY   STATUS    RESTARTS   AGE   LABELS
job1-lp5xm   1/1     Running   0          43s   controller-uid=b6f4a482-37bd-4569-9d8f-539d05640b48,job-name=job1
```

Check the `Pod` logs.  
```console
~/learnk8s> kubectl logs job1-lp5xm
Sun Jun  4 04:18:54 UTC 2023
sleeping..
```

Check the `Pod` and its logs, and the `Job` after ~100 seconds.  

```console
~/learnk8s> kubectl logs job1-lp5xm
Sun Jun  4 04:18:54 UTC 2023
sleeping..
exiting..
Sun Jun  4 04:20:34 UTC 2023
~/learnk8s> kubectl get pods --show-labels
NAME         READY   STATUS      RESTARTS   AGE     LABELS
job1-lp5xm   0/1     Completed   0          2m33s   controller-uid=b6f4a482-37bd-4569-9d8f-539d05640b48,job-name=job1
~/learnk8s> kubectl get job.batch/job1
NAME   COMPLETIONS   DURATION   AGE
job1   1/1           104s       2m37s
~/learnk8s>
```

Notice the `Pod` status shows `Completed`. As pods successfully complete, the Job tracks the successful completions.  

Delete the job.  
```console
~/learnk8s> kubectl delete job.batch/job1
job.batch "job1" deleted
```

**Other JobSpec settings**  

* `activeDeadlineSeconds` (integer): Specifies the duration in seconds relative to the startTime that the job may be active before the system tries to terminate it.
* `backoffLimit` (integer): Specifies the number of retries before marking this job failed.
* `completions` (integer): Specifies the desired number of successfully finished pods the job should be run with.
* `parallelism` (integer): Specifies the maximum desired number of pods the job should run at any given time.
* `ttlSecondsAfterFinished` limits the lifetime of a Job that has finished execution (either Complete or Failed). If this field is set, ttlSecondsAfterFinished after the Job finishes, it is eligible to be automatically deleted.

**Cleanup**  
Delete the configuration using `kubectl delete -f YAML_FILE`.
