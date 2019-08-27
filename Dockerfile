FROM arm32v7/node:11.0.0

# Create app directory
WORKDIR /usr/src/app

# Environment variables
ENV MONGODB_URI mongodb://mongo:27017/feedernet
ENV PORT 4000

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY yarn.lock ./

RUN apt-get install python
RUN curl -O https://bootstrap.pypa.io/get-pip.py
RUN python get-pip.py
RUN pip install esptool

RUN npm install -g yarn@1.12.3
RUN yarn install


# Bundle app source
COPY . .

EXPOSE 4000

CMD [ "npm", "start" ]
