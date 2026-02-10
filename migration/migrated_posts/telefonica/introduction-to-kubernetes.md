---
title: "Introduction to Kubernetes"
date: 2018-03-20
tags: []
description: "Discover the basics of Kubernetes with Telefónica Tech. Learn how this powerful tool can streamline your container management and deployment processes."
source: "https://telefonicatech.uk/blog/introduction-to-kubernetes/"
source_site: "Telefonica Tech UK (formerly Adatis)"
original_author: "Ust Oldfield"
status: draft
migrated: true
migration_date: "2026-02-10"
# images_to_download: 1 (see bottom of file)
---

> **Migrated from [Telefonica Tech UK (formerly Adatis)](https://telefonicatech.uk/blog/introduction-to-kubernetes/)**
> Original publication date: 2018-03-20

Kubernetes is an orchestrator for containerised applications. This post will aim to give a high-level overview of what Kubernetes is.

According to the team at Kubernetes, *Kubernetes provides a **container-centric** management environment. It orchestrates computing, networking, and storage infrastructure on behalf of user workloads. This provides much of the simplicity of Platform as a Service (PaaS) with the flexibility of Infrastructure as a Service (IaaS), and enables portability across infrastructure providers.*

Where PaaS operates at a hardware, Kubernetes sits at the container level which means that you don’t get a full PaaS offering – but you do get some features such as ease of deployment, scalability, load balancing, logging and monitoring. Unlike IaaS, it’s not a monolithic solution – each solution is optional and pluggable, providing a platform to build upon, like Lego bricks, preserving choice and flexibility where required.

It is also not just an orchestrator. Most orchestrators use workflow: Do this, then that etc., whereas Kubernetes is a set of independent control processes to drive the current state to the desired state. Traditional orchestration can be viewed as the means justify the end, whereas Kubernetes can be viewed as the end justifies the means.

You can think of Kubernetes as one of a few things. Either a container platform; a microservices platform; or a portable cloud platform. There are probably more applications for Kubernetes, but those are the three broad and dominant uses of it.

## Why Containers?

Without containers, the way to deploy an application was to install the application on the host system using the OS package manager. It entangles the application with the host OS. Rollback is difficult, but possible. However rollback would often be restoring a VM image – which is heavy-duty and non-portable.

Containers virtualise the operating system rather than virtualise the hardware, like a VM does. They’re isolated from each other and the host. They have their own file systems and their resource usage can be bound. Because they are decoupled from the infrastructure and the host OS, they are portable across different operating systems and between on-prem and cloud distributions.

## Working with Kubernetes

To interact with Kubernetes, you interact with the Kubernetes API objects. These objects describe the cluster’s desired state. Effectively, what applications or work loads do you want to run; the container image they should use; the number of replicas; the resources to make available – to name but a few. The desired state is set by creating objects using the API, typically using a command line interface called *kubectl*. Once this desired state has been set the Control Plane works to make the current state match the desired state. The process of doing this, Kubernetes manages automatically, but it does so through a collection of processes that run on a cluster. These are:

- The Kubernetes Master, which is a collection of three processes (*kube-apiserver*, *kube-controller-manager*, *kube-scheduler*) that run on a single node in the cluster. When you interact with a Kubernetes cluster through *kubectl*, you’re interacting with the master.
- A worker node will run two processes – *kubelet*, which communicates with the master node; and *kube-proxy*, which is a network proxy for the node. A worker node is a machine that runs the workload. The master controls each node.

## Kubernetes Objects

There are several Kubernetes objects. As a basic set, these objects are:

- *Pod* – like DNA, a *Pod* is the basic building block of Kubernetes. A *Pod* represents a process running on a cluster. It encapsulates a container and the resources it needs and the behaviour for how it should run. A *Pod* represents a unit of deployment: a single instance of Kubernetes, which may contain one or many tightly coupled containers. Docker is the most container runtime used in a *Pod*.
- *Service* – a *Service* is a logical abstraction for a set of *Pods* and a policy by which to access them.
- *Volume* – a *Volume* is similar to a shared disk but are vital to resolving issues that arise with containers. On-disk, containers are temporary. They are mortal. If a container crashes, it will be restarted but files that it had within are lost. Similarly, if you run many containers in a *Pod* it can be necessary to share files between the containers. Volume solves these problems.

## The Control Plane

The Control Plane maintains a record of all Kubernetes objects and runs continuous maintenance loops to check that each objects matches the desired state.

At a high-level, that is Kubernetes. Be on the look out for more posts around Kubernetes.


<!-- IMAGE MANIFEST (DOWNLOADED)
Images downloaded to local paths:
  - images\introduction-to-kubernetes\ustoldfield_image_thumb_50.png
    alt: image
    original: https://telefonicatech.uk/wp-content/uploads/adatis/historic/ustoldfield_image_thumb_50.png

To use in markdown:
  ![image](images\introduction-to-kubernetes\ustoldfield_image_thumb_50.png)
-->