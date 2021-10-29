# Project Atelier API

![node.js](https://img.shields.io/badge/Node.js-20232A?style=for-the-badge&logo=nodedotjs&logoColor=green)
![Express](https://img.shields.io/badge/-Express-20232A?style=for-the-badge&logo=express&logoColor=yellow)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)

Developed by [Daniel Ho](https://github.com/dho1994)

Modernization of the back end of an existing eCommerce platform from a monolithic architecture to a microservices-based architecture, capable of serving at least 100 RPS with a max response time of 2 seconds.

The project consisted of 5 main stages: database design, server & API setup, stress testing & optimization, deployment, and scaling.
 - I used a relational DBMS for this project because the endpoints for my API were already well-defined and I knew the data I'd be working with was highly structured as opposed to dynamic. Within the different relational DBMS options, I chose PostgreSQL over a more user-friendly DBMS such as MySQL for its greater ability to fine-tune for better performance, which was important for this project.
 - I offloaded the API's data transformation logic to my database by taking advantage of PostgreSQL's built-in aggregate JSON functions and using query planner to measure performance gains.
 - Local stress-testing was done using k6, with New Relic to summarize results. This helped identify system bottlenecks in read-heavy endpoints.
 - I deployed the server and database onto separate AWS EC2 micro instances and used Loader.io, a cloud-based stress-testing tool, to benchmark performance.
 - Microservice was horizontally scaled by deploying three servers total behind NGINX load balancer with caching to handle 1200 RPS, with an average response time of 20ms and error rate <1%.
