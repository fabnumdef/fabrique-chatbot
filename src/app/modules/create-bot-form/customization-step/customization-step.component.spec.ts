import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizationStepComponent } from './customization-step.component';

describe('CustomizationStepComponent', () => {
  let component: CustomizationStepComponent;
  let fixture: ComponentFixture<CustomizationStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomizationStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizationStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
