FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app

# Copy Maven wrapper and pom.xml first (for better caching)
COPY .mvn .mvn
COPY mvnw .
COPY pom.xml .

# Download dependencies
RUN chmod +x mvnw
RUN ./mvnw dependency:go-offline -B

# Copy source code
COPY src src

# Build the application
RUN ./mvnw clean package -DskipTests

# List the target directory to see the JAR file name
RUN ls -la target/

# Run the application (using the exact JAR name)
ENTRYPOINT ["sh", "-c", "java -jar target/*.jar"]