FROM openjdk:8-jre-alpine as builder
COPY setup_env.sh ./
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} xks.jar
RUN java -Djarmode=layertools -jar xks.jar extract

FROM openjdk:8-jre-alpine
LABEL maintainer="Vitalijus Dobrovolskis vitalijusdobro@gmail.com"
VOLUME /tmp
RUN apk add --no-cache gettext
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring
COPY --from=builder setup_env.sh ./
COPY --from=builder dependencies/ ./
COPY --from=builder spring-boot-loader/ ./
COPY --from=builder snapshot-dependencies/ ./
COPY --from=builder application/ ./

USER root
RUN chown spring:spring /BOOT-INF/classes/static/assets/env.js
USER spring:spring

EXPOSE 8080
ENTRYPOINT ["/bin/sh", "setup_env.sh"]
