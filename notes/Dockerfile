# Use the official Java Development Kit 17 as the parent image
FROM openjdk:17-slim

# Set the working directory to /app
WORKDIR /app

# Copy the build artifact JAR file into the container
COPY target/Me-0.0.1-SNAPSHOT.jar /app/Me-0.0.1-SNAPSHOT.jar

# Expose the application's port
EXPOSE 8080

# Configure the command to execute when the container starts
CMD ["java", "-jar", "/app/Me-0.0.1-SNAPSHOT.jar"]


