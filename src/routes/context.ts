import type { FastifyInstance, FastifySchema } from "fastify";
import { FastifyPluginAsyncTypebox, Type} from "@fastify/type-provider-typebox";

// {
//   "type": "task",
//   "task": "riskCheck" | "notify",
//   "id": "optional step key",
//   "input": {
//     "anyKey": "literal value or a path like $.transaction.amount"
//   }
// }
// ```
//
// ### Step type: `if`
// ```json
// {
//   "type": "if",
//   "id": "optional step key",
//   "cond": { "<operator>": [ leftValue, rightValue ] },
//   "then": [],
//   "else": []
// }
//

const taskType = {
    riskCheck: "riskCheck",
    notify: "notify",
} as const

const flowStepSchemaTask = Type.Object({
    type: Type.Literal("task"),
    task: Type.Enum(taskType),
    id: Type.Optional(Type.String()),
    input: Type.Record(Type.String(), Type.String()),

})

const flowStepSchemaIf = Type.Object({
    type: Type.Literal("if"),
    id: Type.Optional(Type.String()),
    cond: Type.Record(Type.String(), Type.Tuple([Type.String(), Type.String()])),
    then: Type.Array(Type.Any()),
    else: Type.Array(Type.Any()),
})

const flowStepSchema = Type.Object({
    id: Type.String(),
    steps: Type.Array(Type.Union([flowStepSchemaTask, flowStepSchemaIf])),
});

const schemas = {
    run: {
        body: Type.Object({
            flow: flowStepSchema,
            context: Type.Record(Type.String(), Type.Any()),
        })
    }
} satisfies Record<string, FastifySchema>;


const route: FastifyPluginAsyncTypebox = async (fastify) => {
    fastify.post("/", { schema: schemas.run }, async (req, reply) => {
        const { flow, context } = req.body;
    });
};


export default route;
