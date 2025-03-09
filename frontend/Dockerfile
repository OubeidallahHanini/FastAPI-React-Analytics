# Using the NodeJs Image
FROM node:18

# The repo of the work
WORKDIR /app

# Copy from Frontend
COPY . /app

# Installing the dependencies
RUN npm install

# Build React image
RUN npm run build

# Provide the app like a lighweight server
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]

# Exposing on 3000
EXPOSE 3000
