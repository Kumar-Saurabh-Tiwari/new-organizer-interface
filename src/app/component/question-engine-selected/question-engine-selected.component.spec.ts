import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionEngineSelectedComponent } from './question-engine-selected.component';

describe('QuestionEngineSelectedComponent', () => {
  let component: QuestionEngineSelectedComponent;
  let fixture: ComponentFixture<QuestionEngineSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionEngineSelectedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionEngineSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
