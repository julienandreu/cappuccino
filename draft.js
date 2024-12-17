const fp = require('lodash/fp');

const functions = require('./functions');
const promisify = require('./promisify');
const impure = require('./impure');

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

    const fpComposeProm = (fcts) => fcts.reduceRight((acc, fct) => acc.then(fct));

    const fpConcurrent = (...fcts) => async (init) => {
      const fctsPromises = fcts.map( (fct) => fct(init));
      return await fpComposeProm(fctsPromises);
    };

    const prepare = fpConcurrent(
      prepareCoffee,
      prepareWater,
      prepareMilk,
    );

  console.log(await prepare(0));

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

    // log(final(0));

    log('decla ended');
    groupEnd();
  }
;

const evBased = () => {
    group();
    log('evBased started...');

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

    const release = fp.compose(
      impure.clean,
      impure.descaling,
      impure.ejectBrewedCoffee,
      impure.dispenseCoffee,
    );

    const prepare = fp.compose(
      prepareCoffee,
      prepareWater,
      prepareMilk,
    );

    const final = fp.compose(
      release,
      prepare,
      start,
    );

    log(final(0));

    log('evBased ended');
    groupEnd();
  }
;

(async () => {
  /*
  procedural();
  await promises();
  func();
  */
  await decla();
  // evBased();
})();


