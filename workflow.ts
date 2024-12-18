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
            throw new Error(`Field ${String(key)} not found in input:\n${JSON.stringify(data, null, 2)}`);
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
    return (input: Record<PropertyKey, unknown>) => {
        console.debug('AutomationWeb', scenarioName, input);
        return {
            data: {
                input,
                scenarioName,
            },
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

// Sequential

const _start = start();
const _value = value(_valueDefinition);
const _userInput = userInput(_value)(_start)({ names: ['Elon Musk', 'Tim Cook'] });
const _field = field<_ValueDefinition>('names')(_userInput);
const _linkedInSearch = automationWeb('LinkedInSearch')

const _closure = (item) => _linkedInSearch({ searchQuery: item });

const _loop = loop(_closure)(_field);
const _end = end(_loop);

console.group('Static');
console.log("1. Start:", _start);
console.log("2. Value:", _value);
console.log("3. UserInput:", _userInput);
console.log("4. Field:", _field);
console.log("5. AutomationWeb:", _linkedInSearch);
console.log("6. Closure:", _closure);
console.log("7. Loop:", _loop);
console.log("8. End:", _end);
console.groupEnd();

// Chained

const _chained = end(
    loop
        (
            (item) => automationWeb
                ('LinkedInSearch')
                ({ searchQuery: item })
        )
        (
            field<_ValueDefinition>('names')
                (
                    userInput
                        (value
                            (_valueDefinition)
                        )
                        (start
                            ()
                        )
                        ({ names: ['Elon Musk', 'Tim Cook'] })
                )
        )
);

console.group('Chained');
console.log("1. _chained:", _chained);
console.groupEnd();

// Piped

const _profiles = pipe(
    start,
    pipe(
        () => _valueDefinition,
        value,
        userInput,
        () => ({ names: ['Elon Musk', 'Tim Cook'] }),
    ),
    field<_ValueDefinition>('names'),
)

// const _loopProfiles = pipe(
//     loop(_closure),
// );

// const _piped = pipe(
//     () => _loopProfiles,
//     _profiles,
//     end,
// );

// // const _piped = pipe(
// //     () => loop(_closure)(_profiles()),
// //     end,
// // );

const _piped = () => loop(_closure)(_profiles());

// const _piped = pipe(
//     loop,
//     pipe(
//         start,
//         pipe(
//             () => _valueDefinition,
//             value,
//             userInput,
//             () => ({ names: ['Elon Musk', 'Tim Cook'] }),
//         ),
//         field<_ValueDefinition>('names'),
//     ),
//     (item) => automationWeb('LinkedInSearch')({ searchQuery: item }),
//     end,
// );

console.group('Piped');
console.log("1. _piped:", _piped(JSON.stringify({ names: ['Elon Musk', 'Tim Cook'] })));
console.groupEnd();

// Workflow

const workflow = pipe(
    start,
    userInput<{ people: { name: string }[] }>({ people: [{ name: '' }] }),
    field('people'),
    loop((person) =>
        pipe(
            automationWeb('LinkedInSearch'),
            field('data'),
            field('ceoName')
        )(person)
    ),
    end
);

const input = JSON.stringify({
    people: [
        { name: "Alice Johnson" },
        { name: "Bob Smith" }
    ]
});

const ceoList = workflow(input);
console.log(ceoList); 