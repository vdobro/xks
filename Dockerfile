FROM openjdk:17-slim-bullseye as builder
WORKDIR application
COPY setup_env.sh .
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} application.jar
RUN java -Djarmode=layertools -jar application.jar extract

FROM openjdk:17-slim-bullseye
LABEL maintainer="Vitalijus Dobrovolskis vitalijusdobro@gmail.com"
VOLUME /tmp

RUN apt-get update && apt-get install -y gettext
RUN adduser  --system --group spring

USER spring:spring
WORKDIR /application
COPY --from=builder application/setup_env.sh ./
RUN true
COPY --from=builder application/dependencies/ ./
RUN true
COPY --from=builder application/spring-boot-loader/ ./
RUN true
COPY --from=builder application/snapshot-dependencies/ ./
RUN true
COPY --from=builder application/application/ ./

USER root
RUN chown spring:spring /application/BOOT-INF/classes/static/assets/env.js
USER spring:spring

EXPOSE 8080
ENTRYPOINT ["/bin/sh", "setup_env.sh"]
