// Functional Programming

// Types
function pipe<A>(a: () => A): () => A;
function pipe<A, B>(a: (arg: A) => B): (arg: A) => B;
function pipe<A, B, C>(a: (arg: A) => B, b: (arg: B) => C): (arg: A) => C;
function pipe<A, B, C, D>(
    a: (arg: A) => B,
    b: (arg: B) => C,
    c: (arg: C) => D
): (arg: A) => D;
function pipe<A, B, C, D, E>(
    a: (arg: A) => B,
    b: (arg: B) => C,
    c: (arg: C) => D,
    d: (arg: D) => E
): (arg: A) => E;
function pipe<A, B, C, D, E, F>(
    a: (arg: A) => B,
    b: (arg: B) => C,
    c: (arg: C) => D,
    d: (arg: D) => E,
    e: (arg: E) => F
): (arg: A) => F;
function pipe<A, B, C, D, E, F, G>(
    a: (arg: A) => B,
    b: (arg: B) => C,
    c: (arg: C) => D,
    d: (arg: D) => E,
    e: (arg: E) => F,
    f: (arg: F) => G
): (arg: A) => G;
function pipe<A, B, C, D, E, F, G, H>(
    a: (arg: A) => B,
    b: (arg: B) => C,
    c: (arg: C) => D,
    d: (arg: D) => E,
    e: (arg: E) => F,
    f: (arg: F) => G,
    g: (arg: G) => H
): (arg: A) => H;
function pipe<A, B, C, D, E, F, G, H, I>(
    a: (arg: A) => B,
    b: (arg: B) => C,
    c: (arg: C) => D,
    d: (arg: D) => E,
    e: (arg: E) => F,
    f: (arg: F) => G,
    g: (arg: G) => H,
    h: (arg: H) => I
): (arg: A) => I;

// Implementation
function pipe(...fns: Array<(arg: unknown) => unknown>): (arg: unknown) => unknown {
    return (input: unknown) => fns.reduce((acc, fn) => fn(acc), input);
}

// Framework

const start = (source?: string): string => {
    console.debug('Start');
    return source ?? '{}';
};

const value = (input: string): string => {
    console.debug('Value', input);
    return input;
};

const userInput = <T>(fieldDefinition: T) => {
    console.debug('UserInput', fieldDefinition);
    return (initialValue: T) => {
        const castedInitialValue = (() => {
            try {
                if (typeof initialValue === 'string') {
                    return JSON.parse(initialValue) as T;
                }

                return initialValue as T;
            } catch (error) {
                return {} as T;
            }
        })();
        console.debug('UserInput', fieldDefinition, initialValue, castedInitialValue);
        return (input: unknown): T => {
            console.debug('UserInput', fieldDefinition, initialValue, castedInitialValue, input);
            return input as T || castedInitialValue;
        };
    };
};

const field = <T extends Record<string, unknown>, K extends keyof T = keyof T>(key: K) => {
    console.debug('Field', key);
    return (input: string): T[K] => {
        console.debug('Field', key, input);
        const data = (() => {
            try {
                if (typeof input === 'string') {
                    return JSON.parse(input);
                }

                return input;
            } catch (error) {
                return {};
            }
        })();
        console.debug('Field', key, input, data);
        if (!(key in data)) {
            console.error(`Field ${String(key)} not found in input:`, JSON.stringify(data, null, 2));
            throw new Error('Field execution failed!');
        }
        console.debug('Field', key, input, data, data[key]);
        return data[key];
    };
};

const loop = <T extends unknown[]>(closure: (item: T[number], index: number, context: unknown) => unknown) => {
    console.debug('Loop', closure);
    return (array: T): unknown[] => {
        console.debug('Loop', closure, array);
        const { results } = array.reduce(
            ({ context, results }, item, index) => {
                console.debug('Loop', closure, array, context, item, index);
                results.push(closure(item, index, context));
                return {
                    context,
                    results,
                };
            },
            {
                context: null,
                results: []
            }
        );
        return results;
    };
};

const automationWeb = (scenarioName: string) => {
    console.debug('AutomationWeb', scenarioName);
    return <T>(input: Record<PropertyKey, unknown>) => {
        console.debug('AutomationWeb', scenarioName, input);
        return {
            data: {
                input,
                scenarioName,
            },
            output: {
                input: input.split('').reverse().join(''),
            } as T,
            content: '_content_',
            url: '_url_'
        };
    };
};

const end = <T>(input: T): T => {
    console.debug('End', input);
    return input;
};

// Workflow

type _ValueDefinition = {
    names: string[];
};
const _valueDefinition = JSON.stringify({
    "$schema": "http://json-schema.org/draft-07/schema#",
    "type": "object",
    "properties": {
        "names": {
            "type": "array",
            "items": {
                "type": "string"
            }
        }
    },
    "required": ["names"]
});

// Disabling

console.debug = () => { };

// Workflow

// Workflow Implementation
const retrieveCEOs = pipe(
    start,
    value,
    userInput<{ names: string[] }>(_valueDefinition)('{"names": []}'),
    field<{ names: string[] }, 'names'>('names'),
    loop((person: string) =>
        pipe(
            automationWeb<{ input: { name: string } }>('LinkedInSearch'),
            field<{ output: Record<string, unknown> }, 'output'>('output'),
            field<{ input: string }, 'input'>('input'),
        )(person)
    ),
    end
);

// Example Usage
const input = JSON.stringify({
    names: ["Person A", "Person B", "Person C"]
});

const result = retrieveCEOs(input);
console.log(result);