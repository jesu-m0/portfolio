import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ProjectCardV3Component } from './project-card-v3.component';
import { Project } from '../../../core/models/project.model';

const mockProject: Project = {
  title: 'Test Project',
  images: [],
  date: 'jan 2025',
  tech: ['Angular'],
  description: 'A test project.',
};

describe('ProjectCardV3Component', () => {
  let component: ProjectCardV3Component;
  let fixture: ComponentFixture<ProjectCardV3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCardV3Component],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectCardV3Component);
    component = fixture.componentInstance;
    component.project = mockProject;
    component.index = '3a';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
