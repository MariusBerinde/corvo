import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {LoginComponent } from './login/login.component';
import {RegistrazioneComponent} from './registrazione/registrazione.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'corvo';
constructor(private _router: Router) { }
navigateToLogin(){
  this._router.navigate(['./login/']);
}
navigateToReg(){
  this._router.navigate(['./registrazione/']);

}
}
