
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Contact } from './model/contact.model';
import { ContactService } from './service/contact.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-contact-me',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-me.component.html',
  styleUrl: './contact-me.component.css',
})
export class ContactMeComponent {
  contactMe: FormGroup;

  loading: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private contactService: ContactService) {
    this.contactMe = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
      subject: ['', [Validators.required, Validators.maxLength(150)]],
      message: ['', [Validators.required, Validators.maxLength(5000)]],
      // Honeypot: hidden from real visitors, bots tend to fill it in.
      // The API silently drops submissions where it has a value.
      company: [''],
    });
  }

  onSubmit() {
    this.successMessage = this.errorMessage = null;
    if (this.contactMe.invalid) {
      this.contactMe.markAllAsTouched();
      this.errorMessage =
        'Oops! Please fill out all fields correctly before sending.';
      return;
    }

    this.loading = true;
    const payload: Contact = this.contactMe.value;

    this.contactService.send(payload)
    .pipe(
      finalize (() => {
        this.loading = false;
      })
    )
    .subscribe({
      next: (res) => {
        // on success
        this.successMessage =
          'Message sent! A confirmation email has also been sent to your inbox (remember checking spam).';
        this.contactMe.reset();
      },
      error: (err) => {
        // on failure
        console.error(err);
        this.errorMessage =
          'Oops! There was an issue sending your message. Please double-check your details and try again.';
      }
    });
  }


}
