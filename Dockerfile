# Build
FROM arm32v7/node:11.0.0 as build
WORKDIR /admin-client
COPY admin-client/package.json /admin-client/package.json
RUN npm install --silent
RUN npm install react-scripts -g --silent
COPY admin-client /admin-client
RUN npm run build

# Production
FROM arm32v7/node:11.0.0

# Create app directory
WORKDIR /usr/src/app

# Environment variables
ENV MONGODB_URI mongodb://mongo:27017/feedernet
ENV PORT 4000

# Install esptool
RUN apt-get install python
RUN curl -O https://bootstrap.pypa.io/get-pip.py
RUN python get-pip.py
RUN pip install esptool

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
RUN npm install -g yarn
COPY package*.json ./
COPY yarn.lock ./
RUN yarn install

# Bundle app source
COPY . .
COPY --from=build /admin-client/build usr/src/app/admin-client/build

EXPOSE 4000

CMD [ "npm", "start" ]
