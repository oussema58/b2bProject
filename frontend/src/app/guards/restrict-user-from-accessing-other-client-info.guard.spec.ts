import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { restrictUserFromAccessingOtherClientInfoGuard } from './restrict-user-from-accessing-other-client-info.guard';

describe('restrictUserFromAccessingOtherClientInfoGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => restrictUserFromAccessingOtherClientInfoGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
