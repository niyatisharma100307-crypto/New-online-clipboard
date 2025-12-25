# --- Stage 1: Build the Application ---
# Use Maven with Java 21 for building
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy only pom.xml first to cache dependencies
COPY pom.xml .
# Download dependencies (cached if pom.xml doesn't change)
RUN mvn dependency:go-offline

# Copy source code and build the JAR
COPY src ./src
RUN mvn clean package -DskipTests

# --- Stage 2: Run the Application ---
# Use a lightweight Java 21 Runtime environment
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy the JAR file from the build stage
COPY --from=build /app/target/*.jar app.jar

# Render sets a PORT variable, so we expose 8080 as a default
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]