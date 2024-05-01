import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"

export async function getEvent(app: FastifyInstance){
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/events/:eventId',{
        schema: {
            summary: "Get a single event by ID",
            tags: ['events'],
            params: z.object({
                eventId: z.string().uuid()
            }),
            response:{
                200: z.object({
                    event: z.object({
                        id: z.string().uuid(),
                        title: z.string(),
                        slug: z.string(),
                        details: z.string().nullable(),
                        maximumAttendees: z.number().int().positive().nullable(),
                        attendeesAmount: z.number().int().positive()
                    })
                }),
            }
        }
    }, async (request, reply) => {
        
        const { eventId } = request.params
       
        const event = await prisma.event.findUnique({
            select:{
                id: true,
                title: true,
                slug: true,
                details: true,
                maximumAttendees: true,
                _count:{
                    select:{
                        attendees: true
                    }
                }
            },
            where:{
                id: eventId
            }
        })

        if(!event){
            throw new Error("Event not found")
        }

        return reply.code(200).send({ 
            event: {
                id: event.id,
                title: event.title,
                slug: event.slug,
                details: event.details,
                maximumAttendees: event.maximumAttendees,
                attendeesAmount: event._count.attendees
            } 
        })
        
    })
}

