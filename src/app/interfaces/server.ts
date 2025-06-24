export interface Server {
  id:number,
  ip:string,
  state:boolean,//up true down false
  name?:string,
  descr?:string
}
