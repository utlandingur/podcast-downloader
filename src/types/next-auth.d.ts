import type { AdapterUser as BaseAdapterUser } from "next-auth/adapters";
import type { UserType } from "@/models/user";

declare module "@auth/core/adapters" {
  interface AdapterUser extends BaseAdapterUser, Omit<UserType, "_id"> {}
}
