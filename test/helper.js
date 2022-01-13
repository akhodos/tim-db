Object.freeze(Object.prototype);
global.assert = require('assert');
global.fs = require('fs');
global.Step = require('../infra/step');
global.timDB = require('../tim-db');


// A mini expectations module to ensure expected callback fire at all.
var expectations = {};
global.expect = function expect(message) {
  expectations[message] = new Error("Missing expectation: " + message);
}
global.fulfill = function fulfill(message) {
  delete expectations[message];
}
process.addListener('exit', function () {
  Object.keys(expectations).forEach(function (message) {
    throw expectations[message];
  });
});


function clean() {
  fs.writeFileSync("./fixtures/toDelete.db", fs.readFileSync("./fixtures/sample.db", "binary"), "binary");
  try {
    fs.unlinkSync('fixtures/new.db');
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }
}

// Clean the test environment at startup
clean();