---
layout: video
title:  "Dangers of ScrumButt"
blurb: "What is Scrumbutt and why is Scrumbutt and Agile anti-pattern? We'll explain all the problems with Scrumbutt here quickly."
date:   2022-01-01 014:17:00 -0500
categories: aws exam
canonical: http://www.scrumtuous.com/aws/exam/2022/04/14/kubernetes-workloads.html
keywords: Lab on Kubernetes Workloads
video-title: "Kubernetes Workloads"
video-blurb: "Lab on Kubernetes Workloads"
embed-code: ZkXh9aLkxv0

cardnumbers: "11,12,13,14,15,16,17,18,19,20"
hints: "OpEx, CapEx, On Prem, Benefits of Automation, Managed Service, Design for Failure, Monolithic architectures, Parallel Computing, RDS, ECS, EKS, DynamoDB"
roundbubble: "AWS Flashcards"
headingtwo: "Check out our extensive collection of AWS Flashcards"
flashcardtext: "There's a <em>hidden</em> click and drag section below for hints."
---



<div class="card mt-5">
  <div class="card-header">
    <h5>Kubernetes Workloads Lab</h5>
  </div>
  <div class="card-body">
    <h5 class="card-title">Kubernetes Workloads</h5>
    <p>Workloads with Kubernetes</p>

<p>Here are the commands used in the labs</p>
<p>Not that YAML indentation is two spaces. Not three spaces, not one space, and definitely no tabs!</p>

<pre>

docker login -u {your-docker-id} -p {your-access-token}

sudo -i

cd /home/wasadmin/Works

minikube status

minikube stop

minikube start --driver=none

minikube status

minikube dashboard (From previous lab - optional)

gedit nginx-deployment.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
  spec:
    replicas: 3
    selector:
      matchLabels:
        app: nginx
    template:
      metadata:
        labels:
          app: nginx
      spec:
        containers:
        - name: nginx
          image: nginx:1.7.9
          ports:
          - containerPort: 80


kubectl create -f nginx-deployment.yaml
kubectl get deployments

kubectl rollout status deployment.v1.apps/nginx-deployment

kubectl get deployment nginx-deployment -o yaml

kubectl get pods --show-labels

kubectl describe deployment nginx-deployment

gedit nginx-deployment.yaml

kubectl apply -f nginx-deployment.yaml

kubectl rollout status deployment.v1.apps/nginx-deployment

kubectl get deployments

kubectl describe deployment nginx-deployment

kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.91

kubectl rollout status deployment.v1.apps/nginx-deployment

kubectl get pods

kubectl rollout undo deployment.v1.apps/nginx-deployment

kubectl get pods

kubectl scale deployment.v1.apps/nginx-deployment --replicas=1

kubectl get deployments nginx-deployment

kubectl rollout pause deployment.v1.apps/nginx-deployment

kubectl set image deployment.v1.apps/nginx-deployment nginx=nginx:1.9.2

kubectl rollout status deployment.v1.apps/nginx-deployment

kubectl rollout resume deployment.v1.apps/nginx-deployment

kubectl rollout status deployment.v1.apps/nginx-deployment

kubectl describe deployment nginx-deployment

kubectl delete deployments/nginx-deployment

kubectl get deployments

kubectl get pods

minikube stop

minikube delete

</pre>
<a href="/aws/practitioner/exam-questions-and-answers.html">all answers</a>
  </div>
</div>








  

