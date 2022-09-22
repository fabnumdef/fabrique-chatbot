import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicPreFooterComponent } from './public-pre-footer.component';

describe('PublicPreFooterComponent', () => {
  let component: PublicPreFooterComponent;
  let fixture: ComponentFixture<PublicPreFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicPreFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicPreFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
