import { Type, type Static } from "@sinclair/typebox";

export const deviceId = Type.Object({
    uuid: Type.String()
})

export type deviceId = Static<typeof deviceId>      


export const macId = Type.Object({
    macId: Type.String()
})

export type macId = Static<typeof macId>