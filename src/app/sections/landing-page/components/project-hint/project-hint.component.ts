import { Component, OnInit } from '@angular/core';
import { RedirectButtonComponent } from '../../../../shared/elements/redirect-button/redirect-button.component';
import { ProjectCardV3Component } from '../../../../shared/elements/project-card-v3/project-card-v3.component';
import { TitleComponent } from '../../../../shared/elements/title/title.component';
import { Project } from '../../../../core/models/project.model';
import { ProjectService } from '../../../../core/services/project.service';


@Component({
  selector: 'app-project-hint',
  imports: [
    RedirectButtonComponent,
    ProjectCardV3Component,
    TitleComponent
],
  templateUrl: './project-hint.component.html',
  styleUrl: './project-hint.component.css',
})
export class ProjectHintComponent implements OnInit{
  projects: Project[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.projects = this.projectService.get2Projects();
  }
}
