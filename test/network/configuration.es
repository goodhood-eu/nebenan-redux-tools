import { assert } from 'chai';

import {
  configureNetwork,
  getApiRoot,
  getTrustedDomainRegex,
} from '../../../client/modules/network/configuration';

const API = 'awesomeapi';
const DOMAIN = 'wowzor.com';
configureNetwork({ api: API, trustedDomain: DOMAIN });


describe('modules/network/configuration', () => {
  it('getApiRoot', () => {
    assert.equal(getApiRoot(), API, 'setting api works');
  });

  it('getTrustedDomainRegex', () => {
    const regex = getTrustedDomainRegex();
    assert.typeOf(regex, 'regexp', 'correct type');
    assert.match('https://wow.wowzor.com', regex, 'regex works');
  });
});
