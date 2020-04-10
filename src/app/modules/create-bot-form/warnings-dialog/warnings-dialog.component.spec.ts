import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarningsDialogComponent } from './warnings-dialog.component';

describe('DetailsDialogComponent', () => {
  let component: WarningsDialogComponent;
  let fixture: ComponentFixture<WarningsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarningsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
