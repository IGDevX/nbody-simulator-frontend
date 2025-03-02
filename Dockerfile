# Use an official Nginx image
FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Copy website files
COPY . /usr/share/nginx/html

# Install sed for text replacement
RUN apk add --no-cache sed

# Expose port 80
EXPOSE 80

# Replace WebSocket URL at runtime and start Nginx
CMD sed -i "s|ws://localhost:8080/simulation|${WEBSOCKET_URL}/simulation|g" /usr/share/nginx/html/*.js && nginx -g "daemon off;"
