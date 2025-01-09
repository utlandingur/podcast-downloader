import type { AdapterUser as BaseAdapterUser } from "next-auth/adapters";
import type { PlainUserType } from "@/models/user";

declare module "@auth/core/adapters" {
  interface AdapterUser extends BaseAdapterUser, Omit<PlainUserType, "_id"> {}
}
