FROM --platform=linux/amd64 node:18-slim

# # Create app directory
# WORKDIR /usr/src/app

# # Bundle app source
# COPY . .

# # COPY .env
# # COPY .env.docker.example .env

# # Install app dependencies
# RUN yarn install

# EXPOSE 3344
# EXPOSE 5000


# CMD [ "yarn", "start" ]




# Create app directory
WORKDIR /usr/src/app

# Bundle app source
COPY . .

# Install app dependencies
RUN yarn install

# prisma global
RUN yarn global add prisma
RUN yarn add @prisma/client
RUN apt-get update -y && apt-get install -y openssl 
#RUN npx prisma migrate dev --name init
RUN prisma generate
RUN npm install jsonwebtoken
RUN npm install -D @types/jsonwebtoken

EXPOSE 3344
EXPOSE 5000

CMD [ "yarn", "dev" ]
