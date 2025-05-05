import { Injectable } from '@angular/core';
import { Service } from '../interfaces/service';

@Injectable({
  providedIn: 'root'
})
export class ManageServiceService {
  private serviceList:Service[]=[
    {
      "id":1,
      "ip":"193.168.111.111",
      "name":"db",
      "desc":"the database",
      "automaticStart":true,
      "state":true
    },
    {
      "id":2,
      "ip":"193.168.111.112",
      "name":"docker",
      "desc":"docker service",
      "automaticStart":true,
      "state":true
    },
    {
      "id":3,
      "ip":"193.168.111.113",
      "name":"ha",
      "desc":"corosync. pacemaker, pcs, haproxy e glusterfs",
      "automaticStart":true,
      "state":true
    }

  ];

  constructor() { }
  getServiceByIp(ip:string):Service[]{
    const serverServicies = this.serviceList.find(service=>service.ip===ip);
    if(serverServicies.length >= 1){
      return serverServicies;
    }else{
      return [];
    }
  }
  getAllServices():Service[]{
    return this.serviceList;
  }
  getServiceByName(name:string){

    const serverServicies = this.serviceList.find(service=>service.name===name);
    if(serverServicies.length >= 1){
      return serverServicies;
    }else{
      return [];
    }
  }


}
