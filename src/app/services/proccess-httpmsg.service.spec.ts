import { TestBed } from '@angular/core/testing';

import { ProccessHTTPMsgService } from './proccess-httpmsg.service';

describe('ProccessHTTPMsgService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProccessHTTPMsgService = TestBed.get(ProccessHTTPMsgService);
    expect(service).toBeTruthy();
  });
});
