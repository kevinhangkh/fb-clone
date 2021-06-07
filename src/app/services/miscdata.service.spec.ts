import { TestBed } from '@angular/core/testing';

import { MiscdataService } from './miscdata.service';

describe('MiscdataService', () => {
  let service: MiscdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MiscdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
