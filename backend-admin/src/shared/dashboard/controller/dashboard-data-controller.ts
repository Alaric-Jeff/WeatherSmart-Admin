import type { FastifyRequest, FastifyReply } from "fastify";
import { ServiceError } from "../../../error/service-error.js";
import { getDashboardDataService } from "../service/dashboard-data-service.js";

export async function dashboardDataController(
    req: FastifyRequest,
    reply: FastifyReply
){
    try{
        const dashboardData = await getDashboardDataService(req.server);

        return reply.code(200).send({
            message: "Successfully fetched dashboard data",
            data: dashboardData
        })
    }catch(err: unknown){
        if(err instanceof ServiceError){
            return reply.code(err.statusCode).send({
                message: err.message
            })
        }
        return reply.code(500).send({
            message: "Internal Server Error"
        })
    }
}