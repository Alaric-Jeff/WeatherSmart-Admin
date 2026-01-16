import type { FastifyInstance } from "fastify";
import type { CreateAuditType } from "./schema/create-audit-fn.js";
import { ServiceError } from "../../error/service-error.js";
import { adminId } from "../admin/schema/admin-id.js";

export async function createAuditFunction(
    fastify: FastifyInstance,
    body: CreateAuditType       
) {
    try {
        const adminDoc = await fastify.db.collection('admin').doc(body.adminId).get();

        if (!adminDoc.exists) {
            throw new ServiceError(400, "Admin not found");
        }

        const adminData = adminDoc.data();

        const audit = await fastify.db.collection('audit_logs').add({
            performedBy: `${adminData!.firstName} ${adminData!.lastName} (${adminData!.gmail})`,
            action: body.action,
            target: body.target,
            timestamp: new Date().toISOString()
        });

        fastify.log.info(`Successfully added an audit log`)
        return { auditId: audit.id };
    } catch (err: unknown) {
        fastify.log.error(err);
        throw new ServiceError(500, "Internal Server Error");
    }
}
