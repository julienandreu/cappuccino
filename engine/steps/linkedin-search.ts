import { BaseStep } from "./base.ts";

export class LinkedInSearch extends BaseStep {
    inputs = {
        query: ""
    };

    outputs = {
        data: {}
    };

    async run() {
        const response = await fetch(process.env.LINKEDIN_SEARCH_URL || '');
        const data = await response.json();

        this.outputs.data = data;
    }
}