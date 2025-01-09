import { BaseStep } from "./base.ts";

export class Log extends BaseStep {
    inputs = {
        data: ""
    };

    async run() {
        console.log("LOG", this.inputs.data);
    }
}