import { GraphQLSchema } from "graphql";
import { buildSchema } from "type-graphql";
import { ObjectId } from "mongodb";
import path from "path";

import { UserResolver } from "resolvers/UserResolvers";
import { AuthResolver } from "resolvers/AuthResolver";
import { StreamResolver } from "resolvers/StreamResolver";
import { ObjectIdScalar } from "./object-id.scalar";
import { TypegooseMiddleware } from "middleware/typegoose";

/* Build TypeGraphQL executable schema */
export default async function createSchema(): Promise<GraphQLSchema> {
  const schema = await buildSchema({
    // add all typescript resolvers
    resolvers: [UserResolver, AuthResolver, StreamResolver],
    emitSchemaFile: path.resolve(__dirname, "schema.gql"),
    // use document converting middleware
    globalMiddlewares: [TypegooseMiddleware],
    // use ObjectId scalar mapping
    scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
    validate: false,
  });
  return schema;
}
