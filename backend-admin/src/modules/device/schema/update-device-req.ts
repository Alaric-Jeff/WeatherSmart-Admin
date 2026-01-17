import { Type, type Static } from "@sinclair/typebox";

export const updateDeviceService = Type.Object({

    adminId: Type.String(),
    id: Type.String(),
    macId: Type.String(),
    reason: Type.String()
})

export type updateDeviceServiceType = Static<typeof updateDeviceService>;


export const updateDeviceReq = Type.Object({
    id: Type.String(),
    macId: Type.String(),
    reason: Type.String()
})

export type updateDeviceReqType = Static<typeof updateDeviceReq>;
