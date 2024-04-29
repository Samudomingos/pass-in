import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import { title } from "process";
import { z } from "zod";

const app = fastify()
const prisma = new PrismaClient({
    log: ['query']
})

app.get('/ping', async (request, reply) => {
    return { pong: true }
})

app.post('/events', async (request, reply) => {

    const createEventSchema = z.object({
        title: z.string().min(4),
        details: z.string().nullable(),
        maximumAttendees: z.number().int().positive().nullable(),   
    })

    const data = createEventSchema.parse(request.body)
    
    const event = await prisma.event.create({
        data:{
            title: data.title,
            details: data.details,
            maximumAttendees: data.maximumAttendees,
            slug: new Date().toISOString()
        }
    })


    return reply.code(201).send({
        eventId: event.id,
    }) 
})

app.listen({port: 4444})
.then(()=>{
    console.log("HTTP server running... 🚀")
})