import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileCheckStepComponent } from './file-check-step.component';

describe('FileCheckStepComponent', () => {
  let component: FileCheckStepComponent;
  let fixture: ComponentFixture<FileCheckStepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileCheckStepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileCheckStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
