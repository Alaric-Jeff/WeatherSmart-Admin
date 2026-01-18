import { Type, type Static } from "@sinclair/typebox";  


export const assignDeviceService = Type.Object({
    userId: Type.String(),
    deviceId: Type.String(),
    adminId: Type.String(),
    reason: Type.Optional(Type.String())
})

export type assignDeviceService = Static<typeof assignDeviceService>


export const assignDeviceReq = Type.Object({
    userId: Type.String(),
    deviceId: Type.String(),
    reason: Type.Optional(Type.String())
})

export type assignDeviceReq = Static<typeof assignDeviceReq>