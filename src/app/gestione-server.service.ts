import { Injectable } from '@angular/core';
import { Server } from './interfaces/server';

@Injectable({
  providedIn: 'root'
})
export class GestioneServerService {
  protected listaServer:Server[]=[
    {
      id:"0",
      ip:"193.168.111.111",
      state:true,
      name:"database"
    },

    {
      id:"1",
      ip:"193.168.111.112",
      state:true,
      name:"database1"
    },

    {
      id:"2",
      ip:"193.168.111.111",
      state:true,
      name:"calc"
    },
    {
      id:"3",
      ip:"193.168.111.112",
      state:false,
      name:"backup-calc",
      descr:"server di backup di calcolo"
    }
  ];
  constructor() { }
  public getAllServers():Server[]{
    return this.listaServer;
  }
}
