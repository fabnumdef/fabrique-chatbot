import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntranetComponent } from './intranet.component';

describe('IntranetComponent', () => {
  let component: IntranetComponent;
  let fixture: ComponentFixture<IntranetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntranetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntranetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
