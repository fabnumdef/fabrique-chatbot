import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotUserFormComponent } from './chatbot-user-form.component';

describe('ChatbotUserFormComponent', () => {
  let component: ChatbotUserFormComponent;
  let fixture: ComponentFixture<ChatbotUserFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatbotUserFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatbotUserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
