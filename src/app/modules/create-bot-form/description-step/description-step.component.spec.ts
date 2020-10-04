import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionStepComponent } from './description-step.component';

describe('DescriptionStepComponent', () => {
  let component: DescriptionStepComponent;
  let fixture: ComponentFixture<DescriptionStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DescriptionStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DescriptionStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
