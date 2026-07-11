import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ContactMeComponent } from './contact-me.component';

describe('ContactMeComponent', () => {
  let component: ContactMeComponent;
  let fixture: ComponentFixture<ContactMeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactMeComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid while required fields are empty', () => {
    expect(component.contactMe.valid).toBeFalse();
  });

  it('should be valid once all fields are filled correctly', () => {
    component.contactMe.setValue({
      name: 'Jane Doe',
      email: 'jane@example.com',
      subject: 'Hello',
      message: 'Just saying hi!',
      company: '',
    });
    expect(component.contactMe.valid).toBeTrue();
  });

  it('should reject an invalid email', () => {
    component.contactMe.get('email')!.setValue('not-an-email');
    expect(component.contactMe.get('email')!.hasError('email')).toBeTrue();
  });
});
