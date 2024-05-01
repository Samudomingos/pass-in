import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { generateSlug } from "../utils/generate-slug"
import { FastifyInstance } from "fastify"

export async function createEvent(app: FastifyInstance){
  app
    .withTypeProvider<ZodTypeProvider>()
    .post('/events',{
        schema: {
            summary: "Create a new event",
            tags: ['events'],
            body: z.object({
                title: z.string().min(4),
                details: z.string().nullable(),
                maximumAttendees: z.number().int().positive().nullable(),   
            }),
            response:{
                201: z.object({
                    eventId: z.string().uuid()
                }),
                400: z.object({
                    error: z.string()
                })
            }
        }
    }, async (request, reply) => {

        const {
            title,
            details,
            maximumAttendees
        } = request.body
        
        const slug = generateSlug(title)

        const eventWithSameSlug = await prisma.event.findUnique({
            where: {
                slug
            }
        })

        if(eventWithSameSlug){
            return reply.code(400).send({
                error: "Event with same title already exists"
            })
        }

        const event = await prisma.event.create({
            data:{
                title,
                details,
                maximumAttendees,
                slug
            }
        })


        return reply.code(201).send({
            eventId: event.id,
        }) 
    })
}

