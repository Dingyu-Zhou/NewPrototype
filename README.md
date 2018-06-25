# Start Instruction

## Required Pre-installed Tools
1. NodeJS (https://nodejs.org/)
2. yarn (https://yarnpkg.com/)
3. MongoDB (https://www.mongodb.com/)


## Start Server
### Start MongoDB, and then run below commands in a terminal:
1. cd WisdoMile_PrePublic/server
2. yarn install
3. yarn start
(Please see more yarn script command in the file: WisdoMile_PrePublic/server/package.json)

### This will start (The port depends on your configuration.):
* http://localhost:4000/graphql   (GraphQL server)
* http://localhost:4000/graphiql   (GraphiQL, in-browser GraphQL IDE)

### Generate the documentation for the server code:
1. yarn run doc
2. see the documentation in the directory: WisdoMile_PrePublic/server/generated/doc/

### Required knowledge:
MongoDB, Mongoose, Express, GraphQL, Graphql Server, Jest


## Start Client
### Run below commands in a terminal:
1. cd WisdoMile_PrePublic/client
2. yarn install
3. yarn start
(Please see more yarn script command in the file: WisdoMile_PrePublic/client/package.json)

### This will start:
* http://localhost:3000   (Website URL)

### Required knowledge:
React, React Apollo, React Router, Redux, Jest
