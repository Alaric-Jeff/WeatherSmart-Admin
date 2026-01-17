import { Type, type Static } from "@sinclair/typebox";

export const adminId = Type.Object({
    uuid: Type.String()
})

export type adminId = Static<typeof adminId>      

