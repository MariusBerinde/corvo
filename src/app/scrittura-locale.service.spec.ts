import { TestBed } from '@angular/core/testing';

import { ScritturaLocaleService } from './scrittura-locale.service';

describe('ScritturaLocaleService', () => {
  let service: ScritturaLocaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScritturaLocaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
