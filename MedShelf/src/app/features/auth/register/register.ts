import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  fullname: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private router: Router) {}

  onSubmit() {
    if (this.fullname && this.email && this.password && this.confirmPassword) {
      if (this.password !== this.confirmPassword) {
        console.log('Las contraseñas no coinciden');
        return;
      }
      
      console.log('Registro exitoso:', {
        fullname: this.fullname,
        email: this.email,
        password: this.password
      });
      
      // Aquí irá la lógica de registro con el backend
      // this.router.navigate(['/login']);
    } else {
      console.log('Por favor completa todos los campos');
    }
  }
}

