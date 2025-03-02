# Use an official Nginx image as the base image
FROM nginx:alpine

# Set the working directory to /usr/share/nginx/html
WORKDIR /usr/share/nginx/html

# Copy website files to the container
COPY . /usr/share/nginx/html

# Replace WebSocket URL dynamically
RUN sed -i 's|ws://localhost:8080/simulation|'ws://"${WEBSOCKET_URL}"/simulation'|g' /usr/share/nginx/html/*.js

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
