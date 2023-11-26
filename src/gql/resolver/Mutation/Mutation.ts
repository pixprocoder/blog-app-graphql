import bcrypt from "bcrypt";
import config from "../../../config";
import { jwtHelper } from "../../../utils/jwtHelper";

type userInfo = {
  name: string;
  email: string;
  password: string;
  bio?: string;
};

export const Mutation = {
  signup: async (parent: any, args: userInfo, { prisma }: any) => {
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
    const token = await jwtHelper.generateToken(
      { userId: newUser.id },
      config.jwt.secret as string
    );
    return {
      userError: null,
      token,
    };
  },

  signin: async (parent: any, args: any, { prisma }: any) => {
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

    const token = jwtHelper.generateToken(
      { userId: user.id },
      config.jwt.secret as string
    );
    return {
      userError: "success",
      token,
    };
  },

  addPost: async (parent: any, args: any, { userInfo }: any) => {
    console.log("userInfo", userInfo);
    console.log("object");
  },
};
