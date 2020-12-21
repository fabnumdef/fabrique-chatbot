import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotPreviewComponent } from './chatbot-preview.component';

describe('ChatbotPreviewComponent', () => {
  let component: ChatbotPreviewComponent;
  let fixture: ComponentFixture<ChatbotPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatbotPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatbotPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
