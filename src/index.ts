import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { typeDefs } from "./gql/schema";
import { resolvers } from "./gql/resolver";

const main = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  const { url } = await startStandaloneServer(server, {
    listen: { port: 3001 },
  });
  console.log(`🚀  Server ready at: ${url}`);
};
main();
