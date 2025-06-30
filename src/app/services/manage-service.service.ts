import { Injectable } from '@angular/core';
import { Service } from '../interfaces/service';
import { HttpStatusCode } from '@angular/common/http';
import {LocalWriteService} from './local-write.service';
import {HttpClient,HttpHeaders } from '@angular/common/http';
import { BehaviorSubject,  Observable,map, throwError } from 'rxjs';
import { catchError, tap, switchMap } from 'rxjs/operators';
import {ManageLogService } from './manage-log.service';

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

  private readonly API_BASE = 'http://localhost:8083';
  private actualUsername:string='';

  private servicesByIpSb = new BehaviorSubject<Service []>([]);
  public servicesByIp$ = this.servicesByIpSb.asObservable();
  constructor(
    private storage:LocalWriteService,
    private http:HttpClient
  ) {

      const username = this.storage.getData("username")??'';
      if(username.length>0)
        this.actualUsername = username;
  }



  getServiceByIp(ip:string):Service[]{
    const serverServicies = this.serviceList.filter(service=>service.ip===ip);
    if(serverServicies.length  >= 1){
      return serverServicies;
    }else{
      return [];
    }
  }

  getServiceByIpO(ip:String):Observable<Service[]>{

    const url = `${this.API_BASE}/getServiceByIp`;
    const body = {
      "username":this.actualUsername,
      "ip":ip
    }
    return this.http.post<Service []>(url,body).pipe(

      tap((services)=>{
        this.servicesByIpSb.next(services);
      }),
      catchError(this.handleError)
    )
  }


  private handleError(error:any):Observable<never>{
    console.error("problema con getSeviceByIp:",error);
    let errorMsg = "errore sconosciuto";
    if(error.error instanceof ErrorEvent){
      errorMsg = `Errore ${error.error.message}`;
    }else{

      errorMsg = `Errore ${error.status}:${error.message}`
    }
    return throwError(()=>new Error(errorMsg));
  }




  /*
  getAllServices():Service[]{
    return this.serviceList;
  }
  getServiceByName(name:string){

    const serverServicies = this.serviceList.filter(service=>service.name===name);
    if(serverServicies.length >= 1){
      return serverServicies;
    }else{
      return [];
    }
  }
  */


}
