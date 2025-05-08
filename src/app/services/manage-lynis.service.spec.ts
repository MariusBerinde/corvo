import { TestBed } from '@angular/core/testing';

import { ManageLynisService } from './manage-lynis.service';

describe('ManageLynisService', () => {
  let service: ManageLynisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageLynisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
