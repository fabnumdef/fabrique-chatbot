import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeStepComponent } from './resume-step.component';

describe('ResumeStepComponent', () => {
  let component: ResumeStepComponent;
  let fixture: ComponentFixture<ResumeStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumeStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
