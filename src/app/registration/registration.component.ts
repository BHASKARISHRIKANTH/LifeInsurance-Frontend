import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RegistrationService } from '../services/registration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent {
  registrationForm = new FormGroup({
    customerFirstName: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z]+$')]),
    customerLastName: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z]+$')]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]{10}$'),
    ]),
    houseNo: new FormControl('', Validators.required),
    apartment: new FormControl('', Validators.required),
    pincode: new FormControl('', [
      Validators.required,
      Validators.pattern('^[1-9][0-9]{5}$'),
    ]),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    userName: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#\\$%\\^&\\*\\.\\-_])[A-Za-z\\d!@#\\$%\\^&\\*\\.\\-_]{8,}$'
      ),
    ]),
    confirmPassword: new FormControl('', Validators.required),
  });

  hidePassword = true;
  hideConfirmPassword = true;

  indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharastra', 'Tamilnadu', 'Telangana', 'Andhra Pradesh' ]

  constructor(
    private registrationService: RegistrationService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }

  isInvalid(controlName: string): boolean {
    const control = this.registrationForm.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  onSubmitData(): void {
    console.log('Form Submitted:', this.registrationForm.valid); // Debug form validity
    console.log('Form Errors:', this.registrationForm.errors); // Debug form errors
    console.log('Form Data:', this.registrationForm.value); // Debug form data

    if (this.registrationForm.valid) {
      const { confirmPassword, ...formData } = this.registrationForm.value; // Remove confirmPassword
      const finalData = { ...formData, status: true }; // Add status

      console.log('Submitting data to API:', finalData); // Debug API payload

      this.registrationService.registerUser(finalData).subscribe(
        (response) => {
          console.log('API Response:', response); // Debug API response
          this.snackBar.open('Customer registered successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });

          // Navigate to login page after successful registration
          this.router.navigate(['/login']);
        },
        (error) => {
          console.error('API Error:', error); // Debug API error
          this.snackBar.open('Registration failed. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
        }
      );
    } else {
      this.registrationForm.markAllAsTouched();
      console.warn('Form is invalid!'); // Debug invalid form
    }
  }
}