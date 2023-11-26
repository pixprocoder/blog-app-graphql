import bcrypt from "bcrypt";
import config from "../../../config";
import { jwtHelper } from "../../../utils/jwtHelper";
import { prisma } from "../../../utils/prismaClient";

type userInfo = {
  name: string;
  email: string;
  password: string;
  bio?: string;
};

export const Mutation = {
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

    if (args.bio) {
      await prisma.profile.create({
        data: {
          bio: args.bio,
          userId: newUser.id,
        },
      });
    }

    // token
    const token = await jwtHelper(
      { userId: newUser.id },
      config.jwt.secret as string
    );
    return {
      userError: null,
      token,
    };
  },

  // signIn
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

    const token = jwtHelper({ userId: user.id }, config.jwt.secret as string);
    return {
      userError: "success",
      token,
    };
  },
};
