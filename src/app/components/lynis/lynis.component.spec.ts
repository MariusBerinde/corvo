import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LynisComponent } from './lynis.component';

describe('LynisComponent', () => {
  let component: LynisComponent;
  let fixture: ComponentFixture<LynisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LynisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LynisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
