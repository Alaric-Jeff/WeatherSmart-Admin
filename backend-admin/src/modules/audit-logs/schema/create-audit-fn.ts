import { Type, type Static } from "@sinclair/typebox";      

export const createAudit = Type.Object({
    adminId: Type.String(),
    action: Type.String(),
    target: Type.String(),
    reason: Type.Optional(Type.String())
});

export type CreateAuditType = Static<typeof createAudit>;
