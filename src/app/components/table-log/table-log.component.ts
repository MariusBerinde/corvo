import { Component, OnInit,Input } from '@angular/core';
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
  sortedLogs: Log[] = [];
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
      const role = this.auth.getUserRole(email);
      if(this.allData)
      console.log("devo caricare tutto")
        else
        console.log("devo caricare solo i miei")

      this.sortedLogs=(this.allData && role===Role.Supervisor)?(this.gL.getAllLogs()):(this.gL.getUserLog(email));

    }
  }

  sortData(sort: Sort){
    const data = this.sortedLogs.slice();

    if (!sort.active || sort.direction === '') {
      this.sortedLogs = data;
      return;
    }
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
