import { readFileSync } from "node:fs";

export class BaseStep {
    inputs: Record<string, any> = {} as const;
    outputs: Record<string, any> = {} as const;
    context: Record<string, any> = {};

    constructor(
        public contextFilePath: string,
        public name: string,
        public id?: string,
    ) { }

    setInputs(inputs: Record<string, any>) {
        this.inputs = inputs;
    }

    async run(): Promise<void> {
        throw new Error("Not implemented");
    }
}