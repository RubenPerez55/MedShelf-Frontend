import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-edit-profile',
  imports: [],
  template: './edit-profile.html',
  styleUrl: './edit-profile.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProfile { }
