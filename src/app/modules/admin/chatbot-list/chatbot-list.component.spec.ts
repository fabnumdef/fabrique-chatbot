import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotListComponent } from './chatbot-list.component';

describe('ChatbotListComponent', () => {
  let component: ChatbotListComponent;
  let fixture: ComponentFixture<ChatbotListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatbotListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatbotListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
