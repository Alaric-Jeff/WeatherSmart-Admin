import type { FastifyInstance } from "fastify";
import { getAuditLogsController } from "../controller/get-audit-logs-controller.js";
import { getAuditInfoController } from "../controller/get-audit-info-controller.js";

export function auditModRouter(
    fastify: FastifyInstance
){
    fastify.route({
        url: "/get-audit-logs",
        method: "GET",
        handler: getAuditLogsController
    })

    fastify.route({
        url: "/get-audit-info/:id",
        method: "GET",
        handler: getAuditInfoController
    })
}