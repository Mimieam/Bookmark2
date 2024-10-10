// // 'use strict';

// export const stylesYellow = [
//   'background: #FFC82C',
//   'border-radius: 3px',
//   'color: white',
//   'font-weight: bold',
//   'padding: 2px 5px',
//   'margin: 1px'
//   ].join(';')
// export const stylesBlue = [
//   'background: #0E9CCC',
//   'border-radius: 3px',
//   'color: white',
//   'font-weight: bold',
//   'padding: 2px 5px'
// ].join(';')
// export const stylesRed = [
//   'background: #FF612C',
//   'border-radius: 3px',
//   'color: white',
//   'font-weight: bold',
//   'padding: 2px 5px'
// ].join(';')
// export const stylesGreen = [
//   'background: #05E340',
//   'border-radius: 3px',
//   'color: white',
//   'font-weight: bold',
//   'padding: 2px 5px'
// ].join(';')

// export const stylesBold = [
//     'border-radius: 3px',
//   'padding: 2px',
//   'font-weight: bold',
// ].join(';')



// // export const _log = console.log;
// export const _log = console.log

// const _warn = console.warn;
// const _error = console.error;
// const _debug = console.debug;
// const _info = console.info;


// const formated_prefix = (type, fn_name) => {
//     // return `%cReco%c${type}%c`
//     return `%cReco%c${type}%c%s`
//     //%s is for string substitutions and allows 'copy of the runtime args here... for coloring without loosing line #'
//      //caveat - can't do console.log({port, args}) anymore.. the first argument needs to be a string... well it will force me to name this correctly i guess  :D
// }


// const log = function () {
//     // const args = Array.from(arguments);
//     const msg = formated_prefix('LOG')
//     // return Function.prototype.bind.call(_log, console, "%c>>1 %c%s", ...[stylesYellow, stylesRed, stylesBlue], ">>2", ">>3");
//     // return Function.prototype.bind.call(_log, console, "%c>>1 %c>>2 %c>>%s", stylesYellow, ...[ stylesRed, stylesBlue] );
//     // return Function.prototype.bind.call(_log, console, "%c>>1 %c>>2 %s", stylesYellow, ...[ stylesRed] );
//     return Function.prototype.bind.call(_log, console, msg, stylesYellow, ...[ stylesRed, stylesBold] );
// }

// const info = function () {
//   const msg = formated_prefix('INFO')
//     return Function.prototype.bind.call(_info, console, msg,stylesYellow, stylesBlue);
// }

// const debug = function () {
//   const msg = formated_prefix('DEBUG')
//   return Function.prototype.bind.call(_debug, console, msg, stylesYellow, stylesGreen);
// }

// const warn = function () {
//   const msg = formated_prefix('WARN')
//   return Function.prototype.bind.call(_warn, console, msg, stylesYellow, stylesRed);
// }

// const error = function () {
//   const msg = formated_prefix('ERROR')
//   return Function.prototype.bind.call(_error, console, "%cReco%cERROR", stylesYellow, stylesRed);
// }


// // console.log =log()
// console.warn = warn()
// console.error = error()
// console.debug = debug()
// console.info = info()



// export const printCurrentFile = (meta_filename, useDefault=true) => {
//     // if (useDefault && !globalThis.rebind){
//     //     console.log = _log
//     // } else {
//     //     console.log = log
//     // }
//     // const calling_filename = module.parents[module.parents.length - 1] || new URL(meta_filename).pathname
//     const calling_filename = new URL(meta_filename).pathname
//     const filename = calling_filename.split("/").pop()

//     return Function.prototype.bind.call(_log, console, `%c❱❱ Module [${filename}] loaded.`, 'background:#fb8990;color:white;padding:2px;border-radius:3px;');

//     // use this is you want this to be decorated with reco/Log too ...
//     // return Function.prototype.bind.call(console.log, console, `%c❱❱ Module [${filename}] loaded.`, 'background:#fb8990;color:white;padding:2px;border-radius:3px;');
// }


// export function applyCustomConsoleLog() {
//   const evalString = `
//         const original = console.log;
//         console.log = Function.prototype.bind.call(original, console, '%c❱❱ %c%s', 'background:#fb8990;color:white;padding:2px;border-radius:3px;', 'background:#9ba6d1;color:white;padding:2px;border-radius:3px;');
//     `;
//   eval(evalString);
// }content: '';position: absolute;bottom: 0.2rem;width: 100%;height: 0;border-bottom: 2px dotted;
const original = console.log;
export const customLogOptions = [
  original, console, `%c❱❱%c%s`, 'background:#fb8990;color:white;padding:2px;margin-right:3px;border-radius:3px;', 'background:#9dd5c1;color:white;padding:2px;border-radius:3px;width:100vw'
]