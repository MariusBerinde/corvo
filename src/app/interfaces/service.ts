export interface Service {
  id:number,
  ip:string,
  name:string,
  desc:string,
  porta?:number,
  automaticStart:boolean,
  state:boolean
}
