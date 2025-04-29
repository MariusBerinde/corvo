import { TestBed } from '@angular/core/testing';

import { GestioneServerService } from './gestione-server.service';

describe('GestioneServerService', () => {
  let service: GestioneServerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestioneServerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
