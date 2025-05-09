import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LynisRulesComponent } from './lynis-rules.component';

describe('LynisRulesComponent', () => {
  let component: LynisRulesComponent;
  let fixture: ComponentFixture<LynisRulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LynisRulesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LynisRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
