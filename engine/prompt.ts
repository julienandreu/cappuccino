import { execSync } from "node:child_process";
import { readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

function copyToClipboard(text: string) {
    const tmpFile = resolve("/tmp", `${process.pid}.txt`);
    writeFileSync(tmpFile, text);
    execSync(`pbcopy < ${tmpFile}`);
    unlinkSync(tmpFile);
}

const availableStepFiles = Object.fromEntries(
    readdirSync(resolve(import.meta.dirname, "steps"))
        .filter(file => file.endsWith(".ts") && !["base.ts", "factory.ts"].includes(file))
        .map((file) => [
            file,
            readFileSync(resolve(import.meta.dirname, "steps", file), "utf-8")
        ])
);

const types = readFileSync(resolve(import.meta.dirname, "types.ts"), "utf-8");

const initialPrompt = `
I'm working on a Workflow engine in Typescript. The idea is to setup a YAML file to shape and orchestrate the run.

So I've built the "engine" and different steps available:

Here are the different steps:

${Object.entries(availableStepFiles).map(([file, content]) => `
- ${file}

\`\`\`typescript
${content}
\`\`\`
`).join("\n")}

---

Here is the Type Definition for the YAML that should materialize the Workflow:

\`\`\`typescript
${types}
\`\`\`

You could use variables from a previous step execution using this pattern: "\${{ ask-profile-name.outputs.name }}"

This will get the outputs from the with the id "ask-profile-name" and get the name from the run.

Please read, understand, analyze and then prepare yourself.Don't answer yet, I'll send you a Workflow description and I want you to build the YAML file entirely.
`;

console.log(initialPrompt);
copyToClipboard(initialPrompt);
