import { Type, type Static } from "@sinclair/typebox";

export const userUuid = Type.Object({
    userId: Type.String()
})

export type userUuidType = Static<typeof userUuid>;