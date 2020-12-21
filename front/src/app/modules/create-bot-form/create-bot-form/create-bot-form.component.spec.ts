import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBotFormComponent } from './create-bot-form.component';

describe('CreateBotFormComponent', () => {
  let component: CreateBotFormComponent;
  let fixture: ComponentFixture<CreateBotFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateBotFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateBotFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
