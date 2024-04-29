import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"

export async function getAttendeeBadge(app: FastifyInstance){
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/attendees/:attendeeId/badge',{
        schema: {
            params: z.object({
                attendeeId: z.coerce.number().int().positive()
            }),
            response:{
               
            }
        }
    }, async (request, reply) => {
        
        const { attendeeId } = request.params
       
        const attendee = await prisma.attendee.findUnique({
            select:{
                name: true,
                email: true,
                event:{
                    select:{
                        title: true
                    }
                }
            },
            where:{
                id: attendeeId
            }
        })

        if(!attendee){
            throw new Error("Attendee not found")
        }

        return reply.code(200).send({
            attendee
        })
        
    })
}

