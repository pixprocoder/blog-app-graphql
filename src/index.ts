import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./gql/schema";
import { resolvers } from "./gql/resolver";
import { prisma } from "./utils/prismaClient";
import { Context } from "./constant/prisma";

const main = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // server
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async (): Promise<Context> => {
      return {
        prisma,
      };
    },
  });
  console.log(`🚀  Server ready at: ${url}`);
};
main();
