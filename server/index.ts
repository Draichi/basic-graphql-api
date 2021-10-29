import "./env";
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import cors from "cors";

import createSchema from "schema";
import createSession from "session";

const port = process.env.PORT;
const origin = process.env.URL_APP;

if (!port) {
  throw new Error("Missing PORT env var");
}
if (!origin) {
  throw new Error("Missing URL_APP env var");
}

const createServer = async () => {
  try {
    // create mongoose connection
    await createSession();
    // create express server
    const app = express();

    const corsOptions = {
      origin: [origin, "https://studio.apollographql.com"],
      credentials: true,
    };

    app.use(cors(corsOptions));

    // use JSON requests
    app.use(express.json());

    const schema = await createSchema();
    const apolloServer = new ApolloServer({
      schema,
      context: ({ req, res }) => ({ req, res }),
      introspection: true,
    });

    await apolloServer.start();

    apolloServer.applyMiddleware({ app, cors: corsOptions });

    app.listen({ port }, () => {
      console.info(
        `> Server is running at http://localhost:${port}${apolloServer.graphqlPath}`
      );
    });
  } catch (error) {
    console.error(error);
  }
};

createServer();
