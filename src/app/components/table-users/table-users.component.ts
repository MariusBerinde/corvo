const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\.\,\/\#\!\?\$\%\\\^\&\*\;\:\{\}\=\-\_\(\)\[\]\\\|'&|\`\~@\.])[^]{6,}$/;
import { Component, OnInit,Input } from '@angular/core';
import { LocalWriteService } from '../../services/local-write.service';
import {AuthService } from '../../services/auth.service';
import { ManageLogService } from '../../services/manage-log.service';
import {FormControl, FormGroup, ReactiveFormsModule,Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
@Component({
  selector: 'app-table-users',
  imports: [],
  templateUrl: './table-users.component.html',
  styleUrl: './table-users.component.css'
})
export class TableUsersComponent implements OnInit {

  localMail:string='';
  constructor(
    private gL: ManageLogService,
    private storage: LocalWriteService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const email = this.storage.getData('email') ?? '';
    this.localMail=email;
    if(email.length>0){
      const role = this.auth.getUserRole(email);


    }
  }
}
