import { customAlphabet } from 'nanoid';
import { readFileSync, writeFileSync, rmSync } from "node:fs";
import { resolve } from "node:path";
import { pid } from "node:process";
import { parse } from 'yaml';
import { build } from "./steps/factory.ts";
import { JSONPath } from 'jsonpath-plus';
import { Workflow } from './types.ts';

const nanoid = customAlphabet('0123456789abcdefghjkmnpqrstuvwxyz', 5)

const runId = `${pid.toString()}.${nanoid()}.yml`;

const sourcePath = resolve(import.meta.dirname, "workflows", "get-current-ceo.yml");
const runPath = resolve(import.meta.dirname, "memory", runId);
console.log(runPath);
writeFileSync(runPath, JSON.stringify({}, null, 2));

const workflow = readFileSync(sourcePath, "utf-8");
const parsedWorkflow = parse(workflow) as Workflow;

console.log(
    "Workflow",
    parsedWorkflow
);

const variableRegex = /\${{\s*([^}]+)\s*}}/gmi;

console.log(
    "Detected variables",
    Array.from(workflow.matchAll(variableRegex)).map(([, varName]) => varName.trim())
);

function processInputs(
    contextFilePath: string,
    inputs: Record<string, any> = {}
) {
    const rawContext = readFileSync(contextFilePath, "utf-8");
    const context = JSON.parse(rawContext);

    return Object.fromEntries(Object.entries(inputs).map(([key, value]) => {

        if (Array.isArray(value)) {
            return [key, value.map((v) => {
                if (typeof v === "string" && variableRegex.test(v)) {
                    let finalValue = v;

                    for (const match of v.match(variableRegex) ?? []) {
                        const varKey = match.replace(variableRegex, "$1").trim();
                        const varValue = JSONPath({ path: varKey, json: context })?.[0];

                        finalValue = finalValue.replace(match, varValue);
                    }

                    const varKey = v.replace(variableRegex, "$1").trim();
                    const varValue = JSONPath({ path: varKey, json: context })?.[0];

                    return [key, finalValue.replace(
                        variableRegex,
                        typeof varValue === "string" ? varValue : JSON.stringify(varValue)
                    )];
                }

                return v;
            })];
        }

        if (typeof value === "string" && variableRegex.test(value)) {
            let finalValue = value;

            for (const match of value.match(variableRegex) ?? []) {
                const varKey = match.replace(variableRegex, "$1").trim();
                const varValue = JSONPath({ path: varKey, json: context })?.[0];

                finalValue = finalValue.replace(match, varValue);
            }

            const varKey = value.replace(variableRegex, "$1").trim();
            const varValue = JSONPath({ path: varKey, json: context })?.[0];

            return [key, finalValue.replace(
                variableRegex,
                typeof varValue === "string" ? varValue : JSON.stringify(varValue)
            )];
        }
        return [key, value];
    }));
}

for (const step of parsedWorkflow.steps) {
    console.group("Running step", step.name);
    const stepClass = build(step.uses);
    const stepInstance = new stepClass(runPath, step.name, step.id);
    stepInstance.setInputs(processInputs(runPath, step.inputs));
    await stepInstance.run();

    if (step.id) {
        const context = JSON.parse(readFileSync(stepInstance.contextFilePath, "utf-8"));
        writeFileSync(stepInstance.contextFilePath, JSON.stringify({
            ...context,
            [step.id]: {
                inputs: stepInstance.inputs,
                outputs: stepInstance.outputs,
            },
        }, null, 2));
    }
    console.groupEnd();
}

// rmSync(runPath);
