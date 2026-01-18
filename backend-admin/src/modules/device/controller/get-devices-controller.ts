import type { FastifyRequest, FastifyReply} from "fastify";
import { ServiceError } from "../../../error/service-error.js";
import { getDeviceService } from "../service/get-devices.js";
export async function getDevicesController(
    req: FastifyRequest,
    reply: FastifyReply
){
    try{
        const devices = await getDeviceService(req.server);

        return reply.code(200).send({
            message: "Successfully fetched devices",
            data: devices
        })

    }catch(err: unknown){
        if(err instanceof ServiceError){
            return reply.code(err.statusCode).send({
                message: err.message
            })
        }
        req.log.error(`Error occured in device controller, error: ${err}`)
        return reply.code(500).send({
            message: "Internal Server Error"
        })
    }
}