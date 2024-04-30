import { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"

export async function checkIn(app: FastifyInstance){
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/attendees/:attendeeId/check-in',{
        schema: {
            params: z.object({
                attendeeId: z.coerce.number().int().positive()
            }),
            response:{
               201: z.null()
                
            }
        }
    }, async (request, reply) => {
        
        const { attendeeId } = request.params
       
        const attendeeCheckIn = await prisma.checkIn.findUnique({
            
            where:{
                attendeeId
            }
        })

        if(attendeeCheckIn){
            throw new Error("Attendee already checked in")
        }

        await prisma.checkIn.create({
            data:{
                attendeeId
            }
        })

        return reply.code(201).send()
        
    })
}

