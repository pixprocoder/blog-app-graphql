import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { jwtHelper } from "../../utils/jwtHelper";

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
      const isExist = await prisma.user.findFirst({
        where: {
          email: args.email,
        },
      });
      if (isExist) {
        return {
          userError: "User Exist on this Email",
          token: null,
        };
      }

      const hashedPassword = await bcrypt.hash(args.password, 12);

      const newUser = await prisma.user.create({
        data: {
          name: args.name,
          email: args.email,
          password: hashedPassword,
        },
      });

      const token = await jwtHelper({ userId: newUser.id });
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

      const token = jwtHelper({ userId: user.id });
      return {
        userError: "success",
        token,
      };
    },
  },
};
