import jwt from "jsonwebtoken";
export const jwtHelper = async (payload: any) => {
  console.log(payload);
  const token = jwt.sign(payload, "SecretToken", { expiresIn: "1d" });
  return token;
};
