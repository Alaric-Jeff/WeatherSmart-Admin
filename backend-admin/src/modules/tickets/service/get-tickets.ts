import type {FastifyInstance} from 'fastify'
import { ServiceError } from '../../../error/service-error.js'

// backend service
export async function getTickets(fastify: FastifyInstance) {
    try {
        const tickets = await fastify.db.collection(`tickets`).get();

        return tickets.docs.map(doc => {
            const data = doc.data() ?? {};

            return {
                ticketId: data.id,
                userName: data.reportedBy?.name ?? data.reportedBy ?? "Unknown User",
                userEmail: data.reportedBy?.email ?? "",
                description: data.description ?? data.notes ?? "",
                issueType: data.issueType ?? data.type ?? "general",
                notes: data.notes ?? "",
                status: data.status,
                createdDate: data.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
                updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? null
            }
        })
    } catch(err: unknown) {
        throw new ServiceError(500, "Internal Server Error")
    }
}