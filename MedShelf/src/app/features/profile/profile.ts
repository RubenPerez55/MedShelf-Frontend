import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  profile = {
    name: 'John Doe',
    age: 30,
    bloodtype: 'O+',
    alergies: ['Peanuts', 'Shellfish'],
    email: 'john@doe.com',
    phone: '123-456-7890',
    emergencyContact: {
      name: 'Jane Doe',
      phone: '098-765-4321',
    },
    address: '123 Main St, Anytown, USA',
  };

  familyProfiles = [
    {
      id: 1,
      name: 'Jane Doe',
      initials: 'JD',
      relation: 'Spouse',
    },
    {
      id: 2,
      name: 'Jack Doe',
      initials: 'JD',
      relation: 'Child',
    },
  ];
}
