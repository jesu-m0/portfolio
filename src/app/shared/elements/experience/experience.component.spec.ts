import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceComponent } from './experience.component';
import { Experience } from '../../../core/models/experience.model';

const mockExperience: Experience = {
  company: 'Acme Corp',
  role: 'Software Engineer',
  period: 'Jan 2024 - Present',
  location: 'Málaga, Spain',
  roleHighlights: ['Built things', 'Shipped things'],
};

describe('ExperienceComponent', () => {
  let component: ExperienceComponent;
  let fixture: ComponentFixture<ExperienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperienceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExperienceComponent);
    component = fixture.componentInstance;
    component.experience = mockExperience;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
