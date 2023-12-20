import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import admin from 'firebase-admin';
import resolvers from './src/resolvers.js';
import { readFileSync } from 'fs';

const serviceAccount = JSON.parse(readFileSync('./pruebabyte4bit-firebase-adminsdk-9zdmf-71433a218f.json', 'utf-8'));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://pruebabyte4bit-default-rtdb.firebaseio.com',
});

const typeDefs = readFileSync('./src/schema.graphql', 'utf-8');
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const app = express();

async function startServer() {
  await server.start();

  // Aplicar middleware después de que el servidor Apollo ha iniciado
  server.applyMiddleware({ app });

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`Servidor GraphQL en http://localhost:${PORT}${server.graphqlPath}`);
  });
}

// Llamar a la función para iniciar el servidor
startServer();
