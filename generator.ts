
type PromiseState = "pending" | "fulfilled" | "rejected";
class TrackablePromise<T = void> extends Promise<T> {
  private _state: PromiseState = "pending";

  constructor(executor: (resolve: (value: T) => void, reject: (reason?: any) => void) => void) {
    super((resolve, reject) => {
      executor(
        (value) => {
          this._state = "fulfilled";
          resolve(value);
        },
        (reason) => {
          this._state = "rejected";
          reject(reason);
        }
      );
    });
  }

  get state(): PromiseState {
    return this._state;
  }
}

let errors = new Set<number>();
let isPaused = false;

function indent(count: number) {
  return '  '.repeat(count);
}

function sleep(log: string) {
  const random = Math.floor(Math.random() * 1000);
  console.log(indent(6),`sleep:${log}:${random}ms`);
  return new Promise((resolve) => setTimeout(resolve, random));
}

async function* step(idx: number, callback: () => void) {
  while (errors.has(idx) || isPaused) {
    console.log(indent(6), `step:before:suspended...`, {errors, isPaused});
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  yield callback();
}
async function* execute(idx: number, source: number[]) {
    console.log(indent(5), `execute:before:${idx}`);
    while (errors.size > 0 || isPaused) {
        console.log(indent(6), `execute:idx:${idx}:suspended...`, {errors, isPaused});
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const availableSteps = [
        async () => {
            await sleep(`execute:idx:${idx}:1/3 idx:${idx}`);
            return `execute:idx:${idx}:1/3 idx = ${idx}`;
        },
        async () => {
            if (idx === 2) {
                console.log('ERROR:idx:', idx);
                errors.add(idx);
                await new Promise((resolve) => {
                    setTimeout(()=>{
                        console.log('RESUMED:idx:', idx);
                        errors.delete(idx);
                        resolve(false);
                    }, idx * 1000);
                });
            }

            await sleep(`execute:idx:${idx}:2/3 source:${idx}`);
            return `execute:idx:${idx}:2/3 source = ${source[idx]}`;
        },
        async () => {
            await sleep(`execute:idx:${idx}:3/3 result:${idx}`);
            return `execute:idx:${idx}:3/3 result = ${idx + source[idx]}`;
        },
    ];
    
    for (const availableStep of availableSteps) {
        yield* step(idx, availableStep);
    }

    console.log(indent(5), `execute:after:${idx}`);
}

async function* concurrent(source: number[]) {
  console.log(indent(3), 'concurrent:before');

  const allResolved = (promises: TrackablePromise<void>[]) => {
    return promises.every((p) => p.state === 'fulfilled');
  }

  const yieldAccumulator: unknown[] = [];

  const promises = source.map((_, idx) => {
    return new TrackablePromise(async (resolve) => {
      console.log(indent(4), `concurrent:idx:${idx}`);
      const gen = execute(idx, source);
      for await (const i of gen) {
        console.log(indent(5), `concurrent:after:${idx}:run:${i}`);
        yieldAccumulator.push(i);
      }
      console.log(indent(4), `concurrent:after:${idx}`);
      resolve();
    });
  });
  
  while (!allResolved(promises)) {
    while (isPaused) {
        console.log(indent(6), `concurrent:suspended...`, {errors, isPaused});
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    yield* yieldAccumulator.splice(0, 1);
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  console.log(indent(3), 'concurrent:after');
}

async function* loop(source: number[]) {
  console.log(indent(3), 'loop:before');
  for (let idx = 0; idx < 5; idx++) {
    console.log(indent(4), `loop:idx:${idx}`);
    yield* execute(idx, source);
    console.log(indent(4), `loop:after:${idx}`);
  }
  console.log(indent(3), 'loop:after');
}

async function run(mode: string) {
  console.log(indent(2), 'run:before');

  const source = [0, 1, 1, 2, 3, 5, 8];

  const runner = mode === 'concurrent' ? concurrent : loop;

  for await (const i of runner(source)) {
    console.log(indent(2), `↳ ${i}`);
  }
  console.log(indent(2), 'run:after');
}

setTimeout(() => {
  console.log('PAUSE');
  isPaused = true;
  setTimeout(() => {
    console.log('RESUME');
    isPaused = false;
  }, 10000);
}, 2000);

console.log('before');
console.log(indent(1), 'main:before');
run(process.argv[2] || 'loop').then(() => {
  console.log(indent(1), 'main:after');
});
console.log('after');