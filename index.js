const fp = require('lodash/fp');
const { from, Subject, zip } = require('rxjs');

const functions = require('./functions');
const promisify = require('./promisify');
const impure = require('./impure');
const { mergeMap } = require('rxjs/operators');
const { map } = require('rxjs/operators');

const { log, group, groupEnd, error } = console;

const procedural = () => {
  group();
  log('procedural started...');
  functions.turnOn();
  functions.fillMilk();
  functions.steamMilk();
  functions.dispenseMilk();
  functions.loadWater();
  functions.warmWater();
  functions.grindCoffee();
  functions.dispenseCoffee();
  functions.ejectBrewedCoffee();
  functions.descaling();
  functions.clean();
  log('procedural ended');
  groupEnd();
};

const promises = async () => {
  try {
    group();
    log('promises started...');
    await promisify.turnOn();

    // 1
    const prom1 = (async () => {
      await promisify.fillMilk();
      await promisify.steamMilk();
      await promisify.dispenseMilk();
    })();
    // 2.1
    const prom21 = (async () => {
      await promisify.loadWater();
      await promisify.warmWater();
    })();
    // 2.2
    const prom22 = (async () => {
      await promisify.grindCoffee();
    })();

    await prom1;
    await prom21;
    await prom22;

    await promisify.dispenseCoffee();
    await promisify.ejectBrewedCoffee();
    await promisify.descaling();
    await promisify.clean();
    log('promises ended');
    groupEnd();
  } catch (err) {
    error(err);
  }
};

const func = async () => {
    group();
    log('func started...');

    const start = fp.compose(
      impure.turnOn,
    );

    const prepareMilk = fp.compose(
      impure.dispenseMilk,
      impure.steamMilk,
      impure.fillMilk,
    );

    const prepareWater = fp.compose(
      impure.loadWater,
      impure.warmWater,
    );

    const prepareCoffee = fp.compose(
      impure.grindCoffee,
    );

    const prepare = fp.compose(
      prepareCoffee,
      prepareWater,
      prepareMilk,
    );

    const release = fp.compose(
      impure.clean,
      impure.descaling,
      impure.ejectBrewedCoffee,
      impure.dispenseCoffee,
    );

    const final = fp.compose(
      release,
      prepare,
      start,
    );

    log(final(0));

    log('func ended');
    groupEnd();
  }
;

const decla = async () => {
    group();
    log('decla started...');

    const start = fp.compose(
      impure.turnOn,
    );

    const prepareMilk = fp.compose(
      impure.dispenseMilk,
      impure.steamMilk,
      impure.fillMilk,
    );

    const prepareWater = fp.compose(
      impure.loadWater,
      impure.warmWater,
    );

    const prepareCoffee = fp.compose(
      impure.grindCoffee,
    );

    // const fpCompose = (...fcts) => (init) => fcts.reduceRight((acc, fct) => fct(acc), init);

    const fpComposeProm = (...fcts) => async (init) => fcts.reduceRight((acc, fct) => acc.then(fct), Promise.resolve(init));

    const fpConcurrent = (...fcts) => async (init) => {
      const fctsPromises = fcts.map((fct) => fct(init));
      return await Promise.all(fctsPromises);
    };

    const prepare = async (init) => {
      const concurrents = [
        prepareCoffee,
        prepareWater,
        prepareMilk,
      ];
      const rest = await fpConcurrent(...concurrents)(init);
      return rest.reduce((total, item) => total + item) - ((concurrents.length - 1) * init);
    };

    const release = fp.compose(
      impure.clean,
      impure.descaling,
      impure.ejectBrewedCoffee,
      impure.dispenseCoffee,
    );

    const final = fpComposeProm(
      release,
      prepare,
      start,
    );

    log(await final(0));

    log('decla ended');
    groupEnd();
  }
;

const evBased = async () => {
    group();
    log('evBased started...');

    const fpComposeProm = (...fcts) => async (init) => fcts.reduceRight((acc, fct) => acc.then(fct), Promise.resolve(init));

    const info = (id) => fp.curry((val) => {
      console.log({ id, val });
      return val;
    });

    const start = fpComposeProm(
      impure.turnOn,
    );// 1

    const prepareMilk = fpComposeProm(
      info('dispenseMilk'),
      impure.dispenseMilk,
      info('steamMilk'),
      impure.steamMilk,
      info('fillMilk'),
      impure.fillMilk,
    );// 14

    const prepareWater = fpComposeProm(
      info('loadWater'),
      impure.loadWater,
      info('warmWater'),
      impure.warmWater,
    );// 48

    const prepareCoffee = fpComposeProm(
      info('grindCoffee'),
      impure.grindCoffee,
    );// 64

    const release = fpComposeProm(
      impure.clean,
      impure.descaling,
      impure.ejectBrewedCoffee,
      impure.dispenseCoffee,
    );

    const prepare = fpComposeProm(
      prepareCoffee,
      prepareWater,
      prepareMilk,
    );




    // Listen Prepare

    /*
    const final = fpComposeProm(
      release,
      prepare,
      start,
    );
    */

    // log(await final(0));

  // Listen Start
    const startObs = from(start(0));

    startObs.pipe(
      mergeMap(
  // FanOut Start
        x => zip(
          from(prepareCoffee(x)),
          from(prepareWater(x)),
          from(prepareMilk(x)),
        )
      )
    ).subscribe(async (v) => {
      // FanIn Prepare
        console.log('Zipped');
        console.log(v);

        const p = v.reduce((total, item) => total + item) - 2;

        const  out = release(p);
      console.log(await out);
      });

    log('evBased ended');
    groupEnd();
  }
;

(async () => {
  // procedural();
  // await promises();
  // func();
  // await decla();
  await evBased();
})();


