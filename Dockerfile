# Setup Docker to have access to Nodejs
# use a official nodejs runtime as a parent image (image is more like a snapshot of a separate instruction sheet)
# this file will create a snap of the environment,
# so when we run a container we are running a snapshot of the environment and it can get us right back to where we were

# specify the node.js version
FROM node:22-alpine
# FROM node:20-alpine3.17

# specify our working directory in the container
WORKDIR /app

RUN apk add --no-cache openssl

# Now we need to copy the files from our local project into this environment
# Copy package.json and package.json.lock files to the container
COPY package*.json .
# this copies all the json file from our local device to the ./app of the docker environment 


# now we need to install the necessary npm packages and dependencies we need for our project
# Install Dependencies - since we already have the package.json inside our docker container
# it can read and install only the dependencies we have inside our package.json file
RUN npm install


# we can then proceed to copy all our applications across
# first dot represents our src current dir and the second dot represents the docker container /app dir
# basically a FROM - TO
COPY . . 


# *** NOTE: Docker is built from top down
# any files that has been changed, Docker will start rebuilding from there
# so if our source code is changed, we dont have to re-install all our dependencies
# and only re-build our source code changes

# Expose the port that the app runs on
# we need to tell our app to open up the port for incoming network request from whatever sources
EXPOSE 8000


# Define the command to run our application
CMD ["node", "./src/server.js"] 

