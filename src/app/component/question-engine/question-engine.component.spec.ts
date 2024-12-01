import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionEngineComponent } from './question-engine.component';

describe('QuestionEngineComponent', () => {
  let component: QuestionEngineComponent;
  let fixture: ComponentFixture<QuestionEngineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionEngineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
