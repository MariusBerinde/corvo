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
import { finalize, Subject ,takeUntil,interval } from 'rxjs';
import { error } from 'console';

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

  isLoadingApprovedUsers = false;
  isLoadingUsers = false;
  approvedUsersError: string | null = null;

  private destroy$ = new Subject<void>(); // NUOVO per gestire unsubscribe

  constructor(
    private storage: LocalWriteService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const email = this.storage.getData('username') ?? '';
    this.localMail = email;
    if (email.length > 0) {

      //const role = this.auth.getUserRole(email);
      //const role = this.auth.getLoggedUser().role;
      this.loadApprovedUsers();
      this.loadAllUsers();
      //this.users = this.auth.getAllUsersInfo();

      interval(300000) // 5 minuti
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.loadApprovedUsers();
          this.loadAllUsers();
        });
    }
  }


  private loadApprovedUsers():void{
    this.isLoadingApprovedUsers = true;
    this.approvedUsersError = null;
    this.auth.getApprovedUsersO(this.localMail).pipe(
      takeUntil(this.destroy$),
      finalize(()=>this.isLoadingApprovedUsers=false)
    ).subscribe(
        {
          next: (users )=> {
            this.approvedUsers = users;
          console.log('Approved users caricati:', users);
          },
          error:(error)=>{

          console.error('Errore nel caricamento approved users:', error);
          this.approvedUsersError = 'Errore nel caricamento degli utenti approvati';
            //fallback in caso di errore
            this.approvedUsers = this.auth.getApprovedUsers();
          }
        }
      )

  }

  private loadAllUsers():void{
    this.isLoadingUsers = true;
    const localUsername = this.storage.getData("username")??"";
    this.auth.getAllUsersInfoO(localUsername).pipe(
      takeUntil(this.destroy$),
      finalize(() => this.isLoadingUsers = false)
    ).subscribe(
        {
          next: (users)=>{
            console.log("loading data with getAllUsersInfoO");
            this.users = users;
          },
          error : (error)=> {
            console.error("problem with loading data from getAllUsersInfoO")
          }
        }
      );

  }




  /*
  deleteMail(email: string): void {
    this.approvedUsers = this.approvedUsers.filter(u => u !== email);
    console.log(` ${email} eliminato.`);
    this.auth.removeApprovedUser(email);
  }
  */


deleteMail(email: string): void {
  this.isLoadingApprovedUsers = true;
  this.approvedUsersError = null;
  console.log("Provo a cancellare la mail:", email);

  this.auth.deleteEnabledUser(email).pipe(
    takeUntil(this.destroy$),
    finalize(() => this.isLoadingApprovedUsers = false)
  ).subscribe({
    next: (deletedItems) => {
      console.log("Risposta server - elementi cancellati:", deletedItems);
      if (deletedItems > 0) {
        // Il service ha già aggiornato la lista tramite BehaviorSubject
        // Aggiorna solo la lista locale del componente
        this.approvedUsers = this.auth.getCurrentApprovedUsers();
        console.log("Lista aggiornata nel componente:", this.approvedUsers);

        // Rimuovi la doppia chiamata - fai solo una volta
        this.auth.removeApprovedUser(email); //TODO:check
      } else {
        console.warn("Nessun elemento cancellato - email non trovata nel database");
        this.approvedUsersError = `Email ${email} non trovata nel database`;
      }
    },
    error: (error) => {
      console.error('Errore nell\'eliminazione:', error);
      this.approvedUsersError = `Errore nell'eliminazione di ${email}`;
    }
  });
}


  /*
  deleteUser(email:string){
    this.deleteMail(email);
    this.auth.removeApprovedUser(email);
  }
  */

  deleteUser(email:string):void{
    console.log("Delete user email=",email);
    this.auth.deleteUserP(email).then(
      (status)=>{
        if(status){
          console.log("delete user ok in table-users");

          this.loadAllUsers();
            this.deleteMail(email);

        }
      }
    );
  }

  mostraFormAggiungiEmail(): void {
    this.showAddEmailForm = true;
  }


  /*
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
  */

  aggiungiNuovoUtente(): void {

    if (this.newEmailControl.valid && this.newEmailControl.value) {
      const newEmail = this.newEmailControl.value!;
      if (this.auth.isUserApproved(newEmail)) {
        this.approvedUsersError = 'Questo utente è già presente nella lista';
        return;
      }

      this.isLoadingApprovedUsers = true;
      this.approvedUsersError = null;
      this.auth.enableUserRegistration(newEmail).pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoadingApprovedUsers = false)
      ).subscribe(
          {
            next: ()=>{

            // La lista si aggiorna automaticamente tramite il BehaviorSubject nel service
            this.approvedUsers = this.auth.getCurrentApprovedUsers();
            this.newEmailControl.reset();
            this.showAddEmailForm = false;
            console.log(`${newEmail} aggiunto con successo.`);

            // Mantieni sincronizzazione con auth service per compatibilità
            this.auth.setApprovedUser(newEmail); //TODO:check
            },
            error : (error)=>{

            console.error('Errore nell\'aggiunta:', error);
            this.approvedUsersError = 'Errore nell\'aggiunta dell\'utente';
            }
          }
        );
    }
  }

  reloadApprovedUsers(): void {
    this.loadApprovedUsers();
  }
  reloadAllUsers():void{
    this.loadAllUsers();
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

    this.auth.updateUserRole(email,newRole).then(
      (value)=>{
        if(value){
          console.log("user role changed with success");

          const iEmail=this.users.findIndex(e=>e.email===email);
          if(iEmail>=0 && iEmail<this.users.length){
            this.users[iEmail].role=newRole;
            //this.user[iEmail].role=newRole;
          }

        }
      }
    );

    //this.auth.setNewRole(email, newRole); // Chiama il servizio auth per aggiornare il ruolo
  }

  ngOnDestroy():void{
    this.destroy$.next();
    this.destroy$.complete();
  }
}
