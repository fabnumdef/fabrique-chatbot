import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaunchChatbotUpdateDialogComponent } from './launch-chatbot-update-dialog.component';

describe('LaunchChatbotUpdateDialogComponent', () => {
  let component: LaunchChatbotUpdateDialogComponent;
  let fixture: ComponentFixture<LaunchChatbotUpdateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaunchChatbotUpdateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaunchChatbotUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
