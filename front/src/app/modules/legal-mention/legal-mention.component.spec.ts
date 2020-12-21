import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalMentionComponent } from './legal-mention.component';

describe('LegalMentionComponent', () => {
  let component: LegalMentionComponent;
  let fixture: ComponentFixture<LegalMentionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalMentionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalMentionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
