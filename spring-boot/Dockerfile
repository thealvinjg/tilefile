FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app

COPY .mvn/ .mvn
COPY mvnw pom.xml ./

RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline

COPY src ./src

RUN ./mvnw package -DskipTests

# Ensure this jar name matches your target folder (e.g. tilefile-0.0.1-SNAPSHOT.jar)
CMD ["java", "-jar", "target/spring-boot-0.0.1-SNAPSHOT.jar"]