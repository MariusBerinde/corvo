import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('test password cripate con hash', () => {
    const plain1="lol";
    const plain2="lol";
    const hash1=service.creaHash(plain1);
    const hash2=service.creaHash(plain2);
    console.log('Parola in chiaro 1:', plain1);
    console.log('Hash 1:', hash1);
    console.log('Parola in chiaro 2:', plain2);
    console.log('Hash 2:', hash2);
    const ris=service.cmpPlainPwd(plain2,hash1);
    expect(ris).toBeTruthy();
  });
});
