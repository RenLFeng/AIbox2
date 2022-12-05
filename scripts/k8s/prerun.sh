#!/bin/bash
kubectl create ns ai-box
kubectl create configmap nginx-frontend --from-file=./default.conf -n ai-box
