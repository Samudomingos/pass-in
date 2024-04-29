import fastify from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { createEvent } from "./routes/create-event";

const app = fastify()

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.get('/ping', async (request, reply) => {
    return { pong: true }
})

app.register(createEvent)

app.listen({port: 4444})
.then(() => {
    console.log("HTTP server running... 🚀")
})