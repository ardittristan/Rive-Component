/* eslint-disable no-undef */
let RiveModule = null;
let isLoadingModule = false;
const callbacks = [];

async function loadRiveModule(cb) {
  let running = true;
  while (running) {
    if(typeof Rive !== "undefined") running = false;
    if (running) await sleep(250);
  }

  if (isLoadingModule) {
    callbacks.push(cb);
  } else if (RiveModule) {
    cb(RiveModule);
  } else {
    isLoadingModule = true;
    Rive({
      locateFile: (file) => `https://unpkg.com/rive-canvas@0.6.5/${file}`,
    }).then((module) => {
      isLoadingModule = false;
      RiveModule = module;
      cb(RiveModule);
      for (let cb of callbacks) {
        cb(RiveModule);
      }
    });
  }
}

export default function loadRive(url) {
  return new Promise((resolve) => {
    loadRiveModule(async (rive) => {
      const { load } = rive;
      const assetRequest = new Request(url);
      fetch(assetRequest)
        .then((response) => {
          return response.arrayBuffer();
        })
        .then((buffer) => {
          // Load Rive file from buffer.
          const file = load(new Uint8Array(buffer));
          resolve({ rive, file });
        });
    });
  });
}

async function sleep(ms) {
  return new Promise((resolve) => {
      setTimeout(resolve, ms);
  });
}
