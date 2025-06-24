import { Component, OnInit,Input,signal  } from '@angular/core';
import { Log } from '../../interfaces/log';
import { ManageLogService } from '../../services/manage-log.service';
import { Role } from '../../interfaces/user';
import { AuthService } from '../../services/auth.service';
import { LocalWriteService } from '../../services/local-write.service';
import { Sort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'table-log',
  standalone: true,
  imports: [MatSortModule],
  templateUrl: './table-log.component.html',
  styleUrl: './table-log.component.css'
})
export class TableLogComponent implements OnInit {
  //sortedLogs: Log[] = [];

  sortedLogs = signal<Log []>([]);
  localMail:string='';
  @Input() allData:boolean = false;

  constructor(
    private gL: ManageLogService,
    private storage: LocalWriteService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const email = this.storage.getData('email') ?? '';
    this.localMail=email;
    if(email.length>0){
      //const role = this.auth.getUserRole(email);

     var actualRoleUser:Role = Role.Worker;
      if(this.storage.getData('role')==="SUPERVISOR")
        actualRoleUser = Role.Supervisor;
      const role = actualRoleUser;
      console.log("Table log TableLogComponent ruolo utente=",role);
      if(this.allData)
      console.log("devo caricare tutto")
        else
        console.log("devo caricare solo i miei")

      //this.sortedLogs=(this.allData && role===Role.Supervisor)?(this.gL.getAllLogs()):(this.gL.getUserLog(email));
      //if(this.allData && role===Role.Supervisor){

      console.log("TableLogComponent role =",role);
      console.log("TableLogComponent all data=",this.allData);
      if(this.allData && role===Role.Supervisor){

        console.log("tentativo di caricamento getAllLogs");
        this.gL.getAllLogsO().subscribe( {
        next:(tmp:Log[]) => {
          console.log("loading all logs = ",tmp);

          //this.servers = tmp;
          this.sortedLogs.set(tmp);
        },
        error: (error)=>{
          console.log("error loading all logs =",error);
        }

      }
        );

      }
      else{
        console.log("email usata per getUser O =",email);

        this.gL.getUserLogO(email).subscribe( {
        next:(tmp:Log[]) => {
          console.log("loading user log = ",tmp);

          //this.servers = tmp;
          this.sortedLogs.set(tmp)
        },
        error: (error)=>{
          console.log("error loading user log=",error);
        }

      }
        );
      }


    }
  }

  sortData(sort: Sort){
    const data = this.sortedLogs().slice();

    if (!sort.active || sort.direction === '') {
      //this.sortedLogs = data;
      this.sortedLogs.set(data);
      return;
    }
    /*
    this.sortedLogs = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id': return this.compare(a.id, b.id, isAsc);
        case 'data': return this.compare(a.data, b.data, isAsc);
        case 'user': return this.compare(a.user, b.user, isAsc);
        case 'server':return this.compare(a.server,b.server,isAsc);
        case 'service':return this.compare(a.service,b.service,isAsc);
        case 'desc': return this.compare(a.desc, b.desc, isAsc);
        default: return 0;
      }
    });
    */
    this.sortedLogs.set(
data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'id': return this.compare(a.id, b.id, isAsc);
        case 'data': return this.compare(a.data, b.data, isAsc);
        case 'userEmail': return this.compare(a.userEmail, b.userEmail, isAsc);
        case 'ip':return this.compare(a.ip,b.ip,isAsc);
        case 'service':return this.compare(a.service,b.service,isAsc);
        case 'descr': return this.compare(a.descr, b.descr, isAsc);
        default: return 0;
      }
    })
    );
  }

private compare(a: number | string | undefined, b: number | string | undefined, isAsc: boolean): number {
  if (a === undefined && b === undefined) {
    return 0;
  }
  if (a === undefined) {
    return isAsc ? 1 : -1;
  }
  if (b === undefined) {
    return isAsc ? -1 : 1;
  }
  if (typeof a === 'number' && typeof b === 'number') {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b) * (isAsc ? 1 : -1);
  }
  return 0;
}
}
