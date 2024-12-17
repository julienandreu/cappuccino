const {log, group, groupEnd} = console;

const turnOn = ()=> new Promise((res)=>{
  group();
  log('1. turnOn started...');
  setTimeout(()=>{
    log('1x turnOn ended');
    res();
    groupEnd();
  }, Math.random() * 250);
});

const fillMilk = ()=> new Promise((res)=>{
  group();
  log('3. fillMilk started...');
  setTimeout(()=>{
    log('3x fillMilk ended');
    res();
    groupEnd();
  }, Math.random() * 250);
});

const steamMilk = ()=> new Promise((res)=>{
  group();
  log('4. steamMilk started...');
  setTimeout(()=>{
    log('4x steamMilk ended');
    res();
    groupEnd();
  }, Math.random() * 250);
});

const dispenseMilk = ()=> new Promise((res)=>{
  group();
  log('5. dispenseMilk started...');
  setTimeout(()=>{
    log('5x dispenseMilk ended');
    res();
    groupEnd();
  }, Math.random() * 250);
});

const loadWater = ()=> new Promise((res)=>{
  group();
  log('6. loadWater started...');
  setTimeout(()=>{
    log('6x loadWater ended');
    res();
    groupEnd();
  }, Math.random() * 250);
});

const warmWater = ()=> new Promise((res)=>{
  group();
  log('7. warmWater started...');
  setTimeout(()=>{
    log('7x warmWater ended');
    res();
    groupEnd();
  }, Math.random() * 250);
});

const grindCoffee = ()=> new Promise((res)=>{
  group();
  log('8. grindCoffee started...');
  setTimeout(()=>{
    log('8x grindCoffee ended');
    res();
    groupEnd();
  }, Math.random() * 250);
});

const dispenseCoffee = ()=> new Promise((res)=>{
  group();
  log('9. dispenseCoffee started...');
  setTimeout(()=>{
    log('9x dispenseCoffee ended');
    res();
    groupEnd();
  }, Math.random() * 250);
});

const ejectBrewedCoffee = ()=> new Promise((res)=>{
  group();
  log('10. ejectBrewedCoffee started...');
  setTimeout(()=>{
    log('10x ejectBrewedCoffee ended');
    res();
    groupEnd();
  }, Math.random() * 250);
});

const descaling = ()=> new Promise((res)=>{
  group();
  log('11. descaling started...');
  setTimeout(()=>{
    log('11x descaling ended');
    res();
    groupEnd();
  }, Math.random() * 250);
});

const clean = ()=> new Promise((res)=>{
  group();
  log('12. clean started...');
  setTimeout(()=>{
    log('12x clean ended');
    res();
    groupEnd();
  }, Math.random() * 250);
});

module.exports = {
  turnOn,
  fillMilk,
  steamMilk,
  dispenseMilk,
  loadWater,
  warmWater,
  grindCoffee,
  dispenseCoffee,
  ejectBrewedCoffee,
  descaling,
  clean,
};
