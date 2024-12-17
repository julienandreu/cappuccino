const fp = require('lodash/fp');

const { log, group, groupEnd } = console;

const matchFlag = [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];

const turnOn = fp.curry( async (flag) => await flag + matchFlag[0]);
const fillMilk = fp.curry( async (flag) => await flag + matchFlag[1]);
const steamMilk = fp.curry( async (flag) => await flag + matchFlag[2]);
const dispenseMilk = fp.curry( async (flag) => await flag + matchFlag[3]);
const loadWater = fp.curry( async (flag) => await flag + matchFlag[4]);
const warmWater = fp.curry( async (flag) => await flag + matchFlag[5]);
const grindCoffee = fp.curry( async (flag) => await flag + matchFlag[6]);
const dispenseCoffee = fp.curry( async (flag) => await flag + matchFlag[7]);
const ejectBrewedCoffee = fp.curry( async (flag) => await flag + matchFlag[8]);
const descaling = fp.curry( async (flag) => await flag + matchFlag[9]);
const clean = fp.curry( async (flag) => await flag + matchFlag[10]);

module.exports = {
  matchFlag,
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
