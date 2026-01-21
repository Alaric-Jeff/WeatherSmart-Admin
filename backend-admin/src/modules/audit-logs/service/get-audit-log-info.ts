import type { FastifyInstance } from "fastify";
import { ServiceError } from "../../../error/service-error.js";

export async function getAuditInfo(
    fastify: FastifyInstance, 
    body: {id: string}
){
    try{
        const audits = await fastify.db.collection('audit_logs').doc(body.id).get();

        if(!audits.exists){
            throw new ServiceError(404, "Audit not found");
        }

        const auditData = audits.data() ?? {}

        return {
            id: auditData.id,
            performedBy: auditData.performedBy,
            action: auditData.action,
            target: auditData.target,
            reason: auditData.reason || 'No description provided',
            timestamp: auditData.createdAt?.toDate().toISOString() || null
        }

    }catch(err: unknown){
        fastify.log.error(`error occured in get audit log, error: ${err}`);
        throw new ServiceError(500, "Internal Server Error");
    }
}