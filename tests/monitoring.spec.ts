import { expect } from 'chai';
import { describe, it } from 'mocha';

import { MonitoringService } from '../src/lib/monitoring';

const monitoringService = new MonitoringService();

global['console'].log = (value => ({ method: 'LOG', value })) as any;
global['console'].info = (value => ({ method: 'INFO', value })) as any;
global['console'].warn = (value => ({ method: 'WARN', value })) as any;
global['console'].error = (value => ({ method: 'ERROR', value })) as any;

describe('(Monitoring) MonitoringService', () => {

  it('#logging', () => {
    const result1 = monitoringService.logging('xxx', 'DEBUG');
    const result2 = monitoringService.logging('xxx', 'INFO');
    const result3 = monitoringService.logging('xxx', 'WARNING');
    const result4 = monitoringService.logging('xxx', 'ERROR');
    expect(result1).eql({ method: 'LOG', value: 'xxx' });
    expect(result2).eql({ method: 'INFO', value: 'xxx' });
    expect(result3).eql({ method: 'WARN', value: 'xxx' });
    expect(result4).eql({ method: 'ERROR', value: 'xxx' });
  });

  it('#log', () => {
    const result = monitoringService.log('xxx');
    expect(result).eql({ method: 'LOG', value: 'xxx' });
  });

  it('#info', () => {
    const result = monitoringService.info('xxx');
    expect(result).eql({ method: 'INFO', value: 'xxx' });
  });

  it('#warn', () => {
    const result = monitoringService.warn('xxx');
    expect(result).eql({ method: 'WARN', value: 'xxx' });
  });

  it('#error', () => {
    const result = monitoringService.error('xxx');
    expect(result).eql({ method: 'ERROR', value: 'xxx' });
  });

});