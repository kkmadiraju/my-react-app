FROM eclipse-temurin:21-jdk-jammy AS build

WORKDIR /app

COPY my-react-service/gradlew ./gradlew
COPY my-react-service/gradle ./gradle
COPY my-react-service/build.gradle my-react-service/settings.gradle ./

RUN chmod +x ./gradlew

COPY my-react-service/src ./src

RUN ./gradlew bootJar --no-daemon

FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

COPY --from=build /app/build/libs/*.jar /app/app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
