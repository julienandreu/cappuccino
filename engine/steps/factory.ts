import { LinkedInSearch } from "./linkedin-search.ts";
import { Log } from "./log.ts";
import { ManualInput } from "./manual-input.ts";

export function build(code: string) {
    switch (code) {
        case "LinkedInSearch":
            return LinkedInSearch;
        case "Log":
            return Log;
        case "ManualInput":
            return ManualInput;
        default:
            throw new Error(`Unknown step: ${code}`);
    }
}