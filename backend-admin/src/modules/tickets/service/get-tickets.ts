import type {FastifyInstance} from 'fastify'
import { ServiceError } from '../../../error/service-error.js'

export async function getTickets(
    fastify: FastifyInstance
){
    try{
        const tickets = await fastify.db.collection(`tickets`).get();

        return tickets.docs.map(doc => {
            const data = doc.data() ?? {};

            return {
                id: data.id,
                reportedBy: data.reportedBy,
                notes: data.notes ?? "",
                status: data.status,
                createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
                updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? null
            }
        })

    }catch(err: unknown){
        throw new ServiceError(500, "Internal Server Error")
    }
}