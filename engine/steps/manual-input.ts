import { createInterface } from "node:readline";
import { BaseStep } from "./base.ts";

export class ManualInput extends BaseStep {
    inputs = {
        question: ""
    };

    outputs = {
        name: ""
    };

    async run() {
        const promise = new Promise<string>((resolve) => {
            const rl = createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question(this.inputs.question, (answer) => {
                rl.close();
                resolve(answer);
            });
        });

        const answer = await promise;

        this.outputs.name = answer;
    }
}