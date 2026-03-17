import Fastify from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import contextRoute from "./routes/context"

const fastify = Fastify({
  logger: true
}).withTypeProvider<TypeBoxTypeProvider>()
fastify.register(contextRoute, { prefix: "/run" });

// Run the server!
fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})

