# get node officaial image
FROM node:25

# set working derectory
WORKDIR  /app

# copy package.json and package-lock.json
COPY package*.json ./

# install dependencies
RUN npm install

# copy project files
COPY . .

# expose port   
EXPOSE 5173

# start the app
CMD ["npm" , "run" , "dev"]