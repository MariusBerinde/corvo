import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailServerComponent } from './detail-server.component';

describe('DetailServerComponent', () => {
  let component: DetailServerComponent;
  let fixture: ComponentFixture<DetailServerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailServerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailServerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
