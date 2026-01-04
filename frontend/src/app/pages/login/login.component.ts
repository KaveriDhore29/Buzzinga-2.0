import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  name: string = '';
  isLoginMode: boolean = true;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  returnUrl: string = '';

  constructor(
    private authService: AuthService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get return URL from route parameters or default to '/ask-room'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/ask-room';
    
    // If already logged in, redirect
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.successMessage = '';
    this.email = '';
    this.password = '';
    this.name = '';
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    if (this.isLoginMode) {
      this.login();
    } else {
      this.register();
    }
  }

  login(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.user) {
          this.successMessage = 'Login successful!';
          // Navigate to room-setup page as owner with user's name after showing success message briefly
          setTimeout(() => {
            this.router.navigate(['/room-setup'], {
              queryParams: { 
                role: 'owner', 
                name: response.user?.name || 'User' 
              }
            });
          }, 500);
        } else {
          this.errorMessage = response.message || 'Login failed. Please try again.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'An error occurred. Please try again.';
        console.error('Login error:', error);
      }
    });
  }

  register(): void {
    this.authService.register(this.email, this.password, this.name).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Only show success if user was successfully saved to database (has ID)
        if (response.success && response.user && response.user.id) {
          // Clear authentication so user needs to login explicitly
          this.authService.logout();
          this.successMessage = 'Registration successful! Please login.';
          // Preserve email for easier login
          const registeredEmail = this.email;
          // Clear form fields
          this.name = '';
          this.email = registeredEmail;
          this.password = '';
          // Switch to login mode after a brief delay
          setTimeout(() => {
            this.isLoginMode = true;
            this.successMessage = '';
          }, 2000);
        } else {
          this.errorMessage = response.message || 'Registration failed. User could not be saved to database. Please try again.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'An error occurred while saving to database. Please try again.';
        console.error('Registration error:', error);
      }
    });
  }
}

