// Assets https://gist.github.com/kentcdodds/5359ab59bf563347c9451ae04cf24a7e
import bcrypt from "bcryptjs";

export const hasPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  passwordHash: string
) => {
  return await bcrypt.compare(password, passwordHash);
};
