const {log, group, groupEnd} = console;

const turnOn = ()=>{
  group();
  log('1. turnOn started...');
  log('1x turnOn ended');
  groupEnd();
};

const fillMilk = ()=>{
  group();
  log('2. fillMilk started...');
  log('2x fillMilk ended');
  groupEnd();
};

const steamMilk = ()=>{
  group();
  log('3. steamMilk started...');
  log('3x steamMilk ended');
  groupEnd();
};

const dispenseMilk = ()=>{
  group();
  log('4. dispenseMilk started...');
  log('4x dispenseMilk ended');
  groupEnd();
};

const loadWater = ()=>{
  group();
  log('5. loadWater started...');
  log('5x loadWater ended');
  groupEnd();
};

const warmWater = ()=>{
  group();
  log('6. warmWater started...');
  log('6x warmWater ended');
  groupEnd();
};

const grindCoffee = ()=>{
  group();
  log('7. grindCoffee started...');
  log('7x grindCoffee ended');
  groupEnd();
};

const dispenseCoffee = ()=>{
  group();
  log('8. dispenseCoffee started...');
  log('8x dispenseCoffee ended');
  groupEnd();
};

const ejectBrewedCoffee = ()=>{
  group();
  log('9. ejectBrewedCoffee started...');
  log('9x ejectBrewedCoffee ended');
  groupEnd();
};

const descaling = ()=>{
  group();
  log('10. descaling started...');
  log('10x descaling ended');
  groupEnd();
};

const clean = ()=>{
  group();
  log('11. clean started...');
  log('11x clean ended');
  groupEnd();
};

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
