import { BaseStep } from "./base.ts";

export class LinkedInSearch extends BaseStep {
    inputs = {
        query: ""
    };

    outputs = {
        company: "",
        ceo: {
            name: "",
            title: "",
            location: "",
            url: ""
        }
    };

    async run() {
        // Fake LinkedIn Search
        this.outputs.company = "Company";
        this.outputs.ceo.name = "CEO";
        this.outputs.ceo.title = "CEO";
        this.outputs.ceo.location = "Location";
        this.outputs.ceo.url = "https://linkedin.com/in/ceo";
    }
}