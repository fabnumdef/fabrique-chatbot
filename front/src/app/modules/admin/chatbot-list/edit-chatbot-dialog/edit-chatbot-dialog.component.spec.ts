import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditChatbotDialogComponent } from './edit-chatbot-dialog.component';

describe('EditChatbotDialogComponent', () => {
  let component: EditChatbotDialogComponent;
  let fixture: ComponentFixture<EditChatbotDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditChatbotDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditChatbotDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
