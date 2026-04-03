import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {
    this.router = router;
  }

  onSubmit() {
    if (this.email == "admin" && this.password == "admin") {
      this.router.navigate(['']);
    }
    console.log("intenta poniendo admin a ver si jala");
  }
}
