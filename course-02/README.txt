
Mehmet Satılmış
Monolith to Microservices at Scale project

Releated Links:
* I pushed all releated developments at kubernetes_demo branch.
* Github repo link : https://github.com/mehmetsatilmis/cloud-developer/tree/kubernetes_demo
* Releated screenshots : https://github.com/mehmetsatilmis/cloud-developer/tree/kubernetes_demo/course-02/project_submission_screenshots 
* Microservice backend-feed code : https://github.com/mehmetsatilmis/cloud-developer/tree/kubernetes_demo/course-02/exercises/udacity-c2-restapi-feed
* Microservice backend-user code : https://github.com/mehmetsatilmis/cloud-developer/tree/kubernetes_demo/course-02/exercises/udacity-c2-restapi-user
* CI-CD : https://github.com/mehmetsatilmis/cloud-developer/blob/kubernetes_demo/.travis.yml
* Public docker images:
    * https://hub.docker.com/repository/docker/mehmetsatilmis/reverseproxy
    * https://hub.docker.com/repository/docker/mehmetsatilmis/udagram-feed
    * https://hub.docker.com/repository/docker/mehmetsatilmis/udagram-user
    * https://hub.docker.com/r/mehmetsatilmis/udagram-frontend

* Dockerfiles:
    * https://github.com/mehmetsatilmis/cloud-developer/blob/kubernetes_demo/course-02/exercises/udacity-c2-restapi-feed/Dockerfile
    * https://github.com/mehmetsatilmis/cloud-developer/blob/kubernetes_demo/course-02/exercises/udacity-c2-restapi-user/Dockerfile
    * https://github.com/mehmetsatilmis/cloud-developer/blob/kubernetes_demo/course-02/exercises/udacity-c2-frontend/Dockerfile

* All yaml files related to kubernetes
    * https://github.com/mehmetsatilmis/cloud-developer/tree/kubernetes_demo/course-02/exercises/udacity-c3-deployment/k8s

Notes About Deployment:
* I used kops and aws with gossip dns
* I followed this url : https://github.com/kubernetes/kops/blob/master/docs/getting_started/aws.md 
* For ab testing feature or work with different versions for same app at the same time, I followed this link:
    * https://blog.gurock.com/implement-ab-testing-using-kubernetes/
    * Releated image : project_submission_screenshots/ab_testing_feature.png 
    * Just for proof, I create this feature for only backend-feed service.
    * I create green and red files for backend-feed service and deployments.
    * Check these files : backend-feed-deployment-green, backend-feed-deployment-red, backend-feed-service-green, backend-feed-service-red
* For zero downtime update :
    * Check zero_downtime_update_example.png image from screenshot folder.
