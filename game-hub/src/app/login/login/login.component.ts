import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Authervice } from '../../services/authService';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(Authervice);
  error = signal('');
  router = inject(Router);
  private destroRef = inject(DestroyRef);

  form = new FormGroup({
    username: new FormControl('', { validators: [Validators.required] }),
    password: new FormControl('', { validators: [Validators.required] }),
  });

  get userName() {
    return this.form.get('username');
  }

  get password() {
    return this.form.get('password');
  }

  onSubmit() {
    if (this.userName && this.password && this.form.valid) {
      const subscription = this.authService
        .onSubmit(this.userName?.value!, this.password?.value!)
        .subscribe({
          next: (response) => {
            console.log(response);
            this.authService.setLoggedIn(true);
            this.authService.saveToken(response.token);
            this.router.navigate(['/']);
          },
          error: (error: Error) => {
            this.error.set(error.message);
          },
        });
      this.form.reset();

      this.destroRef.onDestroy(() => {
        subscription.unsubscribe();
      });
    }
  }
}
