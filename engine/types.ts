export type Inputs = Record<string, unknown>;

export type Step = {
    name: string;
    uses: string;
    id?: string;
    inputs?: Inputs;
};

export type Workflow = {
    name: string;
    steps: Step[];
};