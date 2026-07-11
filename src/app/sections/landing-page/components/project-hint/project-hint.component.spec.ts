import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ProjectHintComponent } from './project-hint.component';

describe('ProjectHintComponent', () => {
  let component: ProjectHintComponent;
  let fixture: ComponentFixture<ProjectHintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectHintComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectHintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
