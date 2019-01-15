const { assert } = require('chai');

const {
  configureNetwork,
  getBaseUrl,
  getTrustedDomainRegex,
  getGlobalHooks,
} = require('../../lib/network/configuration');

const API = 'awesomeapi';
const DOMAIN = 'wowzor.com';
const requestHook = () => 'hookity';
configureNetwork({ baseUrl: API, trustedDomain: DOMAIN, requestHook });


describe('network/configuration', () => {
  it('getBaseUrl', () => {
    assert.equal(getBaseUrl(), API, 'setting api works');
  });

  it('getTrustedDomainRegex', () => {
    const regex = getTrustedDomainRegex();
    assert.typeOf(regex, 'regexp', 'correct type');
    assert.match('https://wow.wowzor.com', regex, 'regex works');
  });

  it('getGlobalHooks', () => {
    const hooks = getGlobalHooks();
    assert.typeOf(hooks, 'object', 'correct type');
    assert.equal(hooks.requestHook, requestHook, 'returns correct result');
  });
});
