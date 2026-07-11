import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MainSkillsHintComponent } from './main-skills-hint.component';

describe('MainSkillsHintComponent', () => {
  let component: MainSkillsHintComponent;
  let fixture: ComponentFixture<MainSkillsHintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainSkillsHintComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainSkillsHintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
