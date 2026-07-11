import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { RedirectButtonComponent } from './redirect-button.component';

describe('RedirectButtonComponent', () => {
  let component: RedirectButtonComponent;
  let fixture: ComponentFixture<RedirectButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RedirectButtonComponent],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(RedirectButtonComponent);
    component = fixture.componentInstance;
    component.label = 'Read more';
    component.href = '/about';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
