import { Routes } from '@angular/router';
import { LandingPageComponent } from './sections/landing-page/landing-page.component';
import { AboutMeComponent } from './sections/about-me/about-me.component';
import { CareerComponent } from './sections/career/career.component';

export const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    title: 'Jesus Moreno - Full Stack Software Engineer',
  },
  {
    path: 'about',
    component: AboutMeComponent,
    title: 'About Me | Jesus Moreno',
  },
  {
    path: 'career',
    component: CareerComponent,
    title: 'Career | Jesus Moreno',
  },
  // Projects → lazy load:
  {
    path: 'projects',
    loadComponent: () =>
      import('./sections/projects/projects.component').then(
        (m) => m.ProjectsComponent
      ),
    title: 'Projects | Jesus Moreno',
  },
  { path: '**', redirectTo: '' },
];
