import type { FastifyRequest, FastifyReply} from "fastify";
import { ServiceError } from "../../../error/service-error.js";
import { getDeviceInfo } from "../service/get-device-info.js";
import { deviceId } from "../schema/device-id.js";
export async function getDeviceInfoController(
    req: FastifyRequest<{Body: deviceId}>,
    reply: FastifyReply
){
    const {
        uuid
    } = req.body;
    try{
        const deviceInfo = await getDeviceInfo(req.server, {
            id: uuid
        })

        req.log.info(`Successfully fetched device infos`);
        return reply.code(200).send({
            message: "Successfully fetched device information",
            data: deviceInfo
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