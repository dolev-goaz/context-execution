import type { FastifySchema } from "fastify";
import { FastifyPluginAsyncTypebox, Type} from "@fastify/type-provider-typebox";
import { flowSchema } from "@/schemas/context";



const schemas = {
    run: {
        body: Type.Object({
            flow: flowSchema,
            context: Type.Record(Type.String(), Type.Any()),
        })
    }
} satisfies Record<string, FastifySchema>;


const route: FastifyPluginAsyncTypebox = async (fastify) => {
    fastify.post("/", { schema: schemas.run }, async (req, reply) => {
        const { flow, context } = req.body;
        const steps = flow.steps;
        for (const step of steps) {

        }
    });
};


export default route;
