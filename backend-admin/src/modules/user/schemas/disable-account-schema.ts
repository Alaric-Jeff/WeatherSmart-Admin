import { Type, type Static } from "@sinclair/typebox";

export const disableUserAccountService = Type.Object({
    adminId: Type.String(),
    userId: Type.String(),
    reason: Type.String()
})

export type disableUserAccountService = Static<typeof disableUserAccountService>

export const disableUserAccountReq = Type.Object({
    userId: Type.String(),
    reason: Type.String()
})

export type disableUserAccountReq = Static<typeof disableUserAccountReq>