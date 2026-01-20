import type { FastifyInstance } from "fastify";
import { ServiceError } from "../../../error/service-error.js";                         
import { Timestamp } from "firebase-admin/firestore";
export async function getAuditLogs(
    fastify: FastifyInstance
){
    try{
        const audits = await fastify.db.collection('audit_logs').get();

        return audits.docs.map(doc => {
            const data = doc.data();

            return {
                id: doc.id,
                performedBy: data.performedBy,
                action: data.action,
                target: data.target,
                timestamp: data.timestamp
            }
        })

    }catch(err: unknown){
        fastify.log.error(`error occured in get audit log, error: ${err}`);
        throw new ServiceError(500, "Internal Server Error");
    }
}