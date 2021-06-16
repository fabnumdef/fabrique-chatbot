import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainNameUpdateDialogComponent } from './domain-name-update-dialog.component';

describe('DomainNameUpdateDialogComponent', () => {
  let component: DomainNameUpdateDialogComponent;
  let fixture: ComponentFixture<DomainNameUpdateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomainNameUpdateDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainNameUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
