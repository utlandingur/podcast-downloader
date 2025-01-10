"use server";
export const getGoogleClientId = async () => {
  return process.env.AUTH_GOOGLE_ID;
};
