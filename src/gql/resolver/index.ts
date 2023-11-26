import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

type userInfo = {
  name: string;
  email: string;
  password: string;
};

export const resolvers = {
  Query: {
    users: async (parent: any, args: any, context: any) => {
      return await prisma.user.findMany();
    },
  },

  Mutation: {
    signup: async (parent: any, args: userInfo, context: any) => {
      const hashedPassword = await bcrypt.hash(args.password, 12);

      const newUser = await prisma.user.create({
        data: {
          name: args.name,
          email: args.email,
          password: hashedPassword,
        },
      });

      const token = jwt.sign({ userId: newUser.id }, "secretToken", {
        expiresIn: "1d",
      });
      return {
        userError: null,
        token,
      };
    },

    // signIN
    signin: async (parent: any, args: any, context: any) => {
      const user = await prisma.user.findFirst({
        where: {
          email: args.email,
        },
      });

      if (!user) {
        return {
          userError: "user not found",
          token: null,
        };
      }

      const correctPass = await bcrypt.compare(args.password, user?.password);

      if (!correctPass) {
        return {
          userError: "Email or password Wrong",
          token: null,
        };
      }

      const token = jwt.sign({ userId: user.id }, "secretToken", {
        expiresIn: "1d",
      });

      return {
        userError: "success",
        token,
      };
    },
  },
};
