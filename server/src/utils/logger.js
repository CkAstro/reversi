'use strict';

const logger = (...args) => console.log(Date().split('(')[0].trim()+':', ...args);

export default logger;