import { Component, OnInit } from '@angular/core';
import { LocalWriteService } from '../../services/local-write.service';
import { AuthService } from '../../services/auth.service';
import { ManageLogService } from '../../services/manage-log.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgFor } from '@angular/common'; // Importa NgIf e NgFor
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import {User,Role} from '../../interfaces/user';
import { isMap } from 'util/types';
@Component({
  selector: 'table-users',
  imports: [
    MatTabsModule,
    MatListModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule ,
    NgIf, // Assicurati di includere NgIf nei imports se stai usando Angular Standalone
    ReactiveFormsModule,
  ],
  templateUrl: './table-users.component.html',
  styleUrl: './table-users.component.css',
  standalone: true, // Aggiungi standalone: true se il componente è standalone
})
export class TableUsersComponent implements OnInit {

  Role=Role;
  localMail: string = '';
  approvedUsers: string[] = [];
  showAddEmailForm: boolean = false;
  users:Omit<User, 'pwd'>[]=[];
  newEmailControl = new FormControl('', [Validators.required, Validators.email]);
   displayedColumns: string[] = ['username', 'email', 'ruolo', 'operazioni'];
  constructor(
    private gL: ManageLogService,
    private storage: LocalWriteService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const email = this.storage.getData('email') ?? '';
    this.localMail = email;
    if (email.length > 0) {
      const role = this.auth.getUserRole(email);
      this.approvedUsers = this.auth.getApprovedUsers() ?? [];
      this.users = this.auth.getAllUsersInfo();
    }
  }

  deleteMail(email: string): void {
    this.approvedUsers = this.approvedUsers.filter(u => u !== email);
    console.log(` ${email} eliminato.`);
    this.auth.removeApprovedUser(email);
  }
  deleteUser(email:string){
    this.deleteMail(email);
    this.auth.deleteUser(email);
  }

  mostraFormAggiungiEmail(): void {
    this.showAddEmailForm = true;
  }

  aggiungiNuovoUtente(): void {
    if (this.newEmailControl.valid) {
      const newEmail = this.newEmailControl.value!;
      if (!this.approvedUsers.includes(newEmail)) {
        this.approvedUsers = [...this.approvedUsers, newEmail];
        this.auth.setApprovedUser(newEmail);
        this.newEmailControl.reset();
        this.showAddEmailForm = false;
        console.log(`${newEmail} aggiunto agli utenti abilitati.`);
        // Qui potresti chiamare un servizio per aggiornare il backend
      } else {
        console.warn(`${newEmail} è già presente nella lista.`);
        // Potresti mostrare un messaggio all'utente
      }
    }
  }

  annullaAggiungiEmail(): void {
    this.showAddEmailForm = false;
    this.newEmailControl.reset();
  }
toggleUserRole(email: string, currentRole: Role): void {

    var newRole:Role=Role.Worker;
    if(currentRole===Role.Worker){
      newRole = Role.Supervisor;
    }
    if(currentRole==Role.Supervisor){
      newRole == Role.Worker;
    }
    const iEmail=this.users.findIndex(e=>e.email===email);
    if(iEmail>=0 && iEmail<this.users.length){
      this.users[iEmail].role=newRole;
    }

    this.auth.setNewRole(email, newRole); // Chiama il servizio auth per aggiornare il ruolo
  }

}
