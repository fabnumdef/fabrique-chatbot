import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordSuccessComponent } from './forgot-password-success.component';

describe('ForgotPasswordSuccessComponent', () => {
  let component: ForgotPasswordSuccessComponent;
  let fixture: ComponentFixture<ForgotPasswordSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotPasswordSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
