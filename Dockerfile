# Stage 1: Build the application
FROM maven:3.9.7-eclipse-temurin-21-alpine AS build
WORKDIR /app

# Copy the pom.xml and resolve dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy the source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Create the runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Create a non-root user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy the executable JAR from the build stage
COPY --from=build --chown=appuser:appgroup /app/target/jankalyan-0.0.1-SNAPSHOT.jar app.jar

# Switch to the non-root user
USER appuser

# Expose the application port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
