import type { FastifySchema } from "fastify";
import { type FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";
import { flowSchema } from "@/schemas/context";
import { executeStep } from "@/services/context";
import type { RunTrace } from "@/types";


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
        const trace: RunTrace[] = [];
        const steps = flow.steps;
        for (const step of steps) {
            const traceResults = executeStep(step, context);
            trace.push(...traceResults)
        }

        return {
            context,
            trace
        }
    });
};


export default route;
