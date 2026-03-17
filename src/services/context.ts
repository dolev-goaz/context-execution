import { type FlowStep, type FlowStepIf, type FlowStepTask, stepType, taskType } from "@/schemas/context";
import type { RunTrace } from "@/types";


const MIN_RISK = 0;
const MAX_RISK = 10;
type Context = Record<string, any>;

function executeSteps(steps: FlowStep[], context: Context): RunTrace[] {
    let trace: RunTrace[] = [];
    for (const step of steps) {
        const stepTrace = executeStep(step, context);
        trace.push(...stepTrace);
    }
    return trace;
}

export function executeStep(step: FlowStep, context: Context): RunTrace[] {
    switch (step.type) {
        case stepType.task: {
            let success = true;
            try {
                executeTask(step, context);
            } catch (e) {
                console.error(`Error executing task ${step.task}:`, e); 
                success = false;
            }
            const trace = {
                id: step.id ?? step.task,
                type: step.type,
                ok: success,
            }
            return [trace];
        }
        case stepType.if:
            return executeIf(step, context);
        default:
            throw new Error(`Unknown step configuration: ${step}`);
    }
}

function executeTask(step: FlowStepTask, context: Context): boolean {
    switch (step.task) {
        case taskType.notify:
            return executeNotifyTask(step, context);
        case taskType.riskCheck:
            return executeRiskCheckTask(step, context);
        default:
            throw new Error(`Unknown task type: ${step.task}`);
    }
}

function executeNotifyTask(step: FlowStepTask, context: Context): boolean {
    const team = getValue("team", step.input.team, context);
    const taskKey = step.id ?? step.task;

    context[taskKey] = {
        notified: true,
        team,
    }
    return true;
    
}

function executeRiskCheckTask(step: FlowStepTask, context: Context): boolean {
    const country = getValue("country", step.input.country, context);
    const amountStr = getValue("amount", step.input.amount, context);
    const amount = parseFloat(amountStr);
    const countryRisk = country === "IL" ? 1 : 0;
    const riskScore = Math.round(amount / 10_000 + countryRisk)

    const clampedRiskScore = Math.min(Math.max(riskScore, MIN_RISK), MAX_RISK);

    const outKey = step.id ?? step.task;
    context[outKey] = { riskScore: clampedRiskScore };
    
    return true;
}

function executeIf(step: FlowStepIf, context: Context): RunTrace[] {
    const result = evaluateCondition(step.cond, context);

    let innerTrace;
    if (result) {
        innerTrace = executeSteps(step.then, context);
    } else {
        innerTrace = executeSteps(step.else, context);
    }

    const trace: RunTrace = {
        id: step.id,
        type: step.type,
        branch: result ? "then" : "else",
    }

    return [
        trace,
        ...innerTrace
    ]
}

function evaluateCondition(cond: Record<string, string>, context: Context): boolean {
    const [comparator, values] = Object.entries(cond)[0];
    const [left, right] = values;
    const leftValue = parseFloat(getValue("left", left, context));
    const rightValue = parseFloat(getValue("right", right, context));

    switch (comparator) {
        case "==":
            return leftValue == rightValue;
        case "!=":
            return leftValue != rightValue;
        case ">":
            return leftValue > rightValue;
        case ">=":
            return leftValue >= rightValue;
        case "<":
            return leftValue < rightValue;
        case "<=":
            return leftValue <= rightValue;
        default:
            throw new Error(`Unknown comparator ${comparator}`);
    }
}

function getValue(name: string, value: string, context: Context): string {
    if (value.startsWith("$")) {
        return getValueFromContext(value, context);
    }
    if (!value) {
        throw new Error(`Missing parameter ${name}`)
    }
    return value;
}

function getValueFromContext(key: string, context: Context): string {
    if (!key.startsWith("$")) {
        throw new Error(`Invalid key ${key}. Keys must start with $`);
    }
    const keyParts = key.slice(2).split(".");
    let currentContext = context;
    for (const part of keyParts) {
        if (!(part in currentContext)) {
            throw new Error(`Key ${key} not found in context`);
        }
        currentContext = currentContext[part];
    }
    return context[key];
}
