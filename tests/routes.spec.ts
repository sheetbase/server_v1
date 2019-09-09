import { expect } from 'chai';
import { describe, it } from 'mocha';

import { registerRoutes as routesBuilder } from '../src/lib/routes';

// mocked montoring
class MockedMonitoringService {
  logging(...args) {
    return args;
  }
}

// mocked router
const routerRecorder = {};
let setDisabledArgs;
let setErrorsArgs;
class MockedRouter {
  get(endpoint, ...handlers) {
    return routerRecorder['GET:' + endpoint] = handlers;
  }
  put(endpoint, ...handlers) {
    return routerRecorder['PUT:' + endpoint] = handlers;
  }
  setDisabled(...args) {
    return setDisabledArgs = args;
  }
  setErrors(...args) {
    return setErrorsArgs = args;
  }
}

// mocked res
class MockedRes {
  success(...args) {
    return args;
  }
}

// browser
function browse(method: string, endpoint: string, req = {}) {
  const handler = routerRecorder[method + ':' + endpoint].pop();
  return handler(req, new MockedRes());
}

// register routes
const registerRoutes = routesBuilder(
  new MockedMonitoringService() as any,
);
registerRoutes({
  router: new MockedRouter() as any,
});

describe('Server routes', () => {

  it('register routes', () => {
    expect(Object.keys(routerRecorder)).eql([
      'GET:/system',
      'PUT:/logging',
    ]);
    expect(routerRecorder['GET:/system'].length).equal(2);
    expect(routerRecorder['PUT:/logging'].length).equal(2);
    expect(setDisabledArgs).eql([[]]);
    expect(setErrorsArgs).eql([{}]);
  });

  it('GET /system', () => {
    const result = browse('GET', '/system');
    expect(result).eql([{ sheetbase: true }]);
  });

  it('PUT /logging', () => {
    const result = browse(
      'PUT', '/logging', { body: { value: 'xxx', level: 'ERROR' } },
    );
    expect(result).eql([{ done: true }]);
  });

});