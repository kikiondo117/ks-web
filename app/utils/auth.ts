import * as bycript from "bcrypt";

// Assets https://gist.github.com/kentcdodds/5359ab59bf563347c9451ae04cf24a7e

export const hasPassword = async (password: string) => {
  return await bycript.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  passwordHash: string
) => {
  return await bycript.compare(password, passwordHash);
};
