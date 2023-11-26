import { prisma } from "../../../utils/prismaClient";

export const Query = {
  users: async (parent: any, args: any, context: any) => {
    return await prisma.user.findMany();
  },
};
