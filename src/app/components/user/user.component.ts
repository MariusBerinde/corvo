import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ScritturaLocaleService } from '../../services/scrittura-locale.service';

import {User,Role} from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  actualUser:User;

  constructor( private authService: AuthService, private router: Router,
    private storage: ScritturaLocaleService
  ){
    const email = this.storage.getData('email') ?? 'default';
    const defaultUser:User={
      email:'Default@gmail.com',
      username:'defaultUsername',
      pwd:'defaultPassword',
      role:Role.Worker
    };

    this.actualUser =  this.authService.getUserData(email)??defaultUser;
  }

  //TODO: da finire

}
