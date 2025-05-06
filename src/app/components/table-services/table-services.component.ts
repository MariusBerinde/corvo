import { Component,OnInit,Input  } from '@angular/core';
import { Service } from '../../interfaces/service';
import { ManageServiceService } from '../../services/manage-service.service'
import { Sort, MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'table-services',
  imports: [MatSortModule],
  templateUrl: './table-services.component.html',
  styleUrl: './table-services.component.css'
})
export class TableServicesComponent implements OnInit {
  @Input() ip:string='';
  serviceList:Service[]=[];
  constructor(
    private gS: ManageServiceService,
  ) {}

  ngOnInit():void{
    if(this.ip.length>0){
      this.serviceList = this.gS.getServiceByIp(this.ip);
    }

  }

  sortData(sort: Sort){
    const data = this.serviceList.slice();

    if (!sort.active || sort.direction === '') {
      this.serviceList = data;
      return;
    }
    this.serviceList = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return this.compare(a.name, b.name, isAsc);
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
