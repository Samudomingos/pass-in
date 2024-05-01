import { FastifyInstance } from "fastify"
import { BadRequestError } from "./routes/_errors/bad-request"
import { ZodError } from "zod"

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler  = (error, request, reply) => {
    if(error instanceof ZodError){

        console.log("CAIU AQUI")

        return reply.status(500).send({
            message: 'Invalid request data.',
            errors: error.flatten().fieldErrors
        })
    }

    if(error instanceof BadRequestError){
        return reply.status(400).send({
            message: error.message
        })
    }

    return reply.status(500).send({
        message: 'Internal server error.'
    })

}