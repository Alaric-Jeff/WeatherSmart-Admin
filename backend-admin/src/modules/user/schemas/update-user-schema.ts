import { Type } from "@sinclair/typebox";

export const updateUserSchema = Type.Object({
  firstName: Type.Optional(Type.String()),
  lastName: Type.Optional(Type.String()),
  displayName: Type.Optional(Type.String()),
  contactNumber: Type.Optional(Type.String()),
  address: Type.Optional(Type.String()),
  photoUrl: Type.Optional(Type.String()),
});