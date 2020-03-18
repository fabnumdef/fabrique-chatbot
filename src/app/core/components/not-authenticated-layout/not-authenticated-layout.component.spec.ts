import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotAuthenticatedLayoutComponent } from './not-authenticated-layout.component';

describe('NotAuthenticatedLayoutComponent', () => {
  let component: NotAuthenticatedLayoutComponent;
  let fixture: ComponentFixture<NotAuthenticatedLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotAuthenticatedLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotAuthenticatedLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
