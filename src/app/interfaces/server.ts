export interface Server {
  id:string,
  ip:string,
  state:boolean,//up true down false
  name?:string,
  descr?:string
}
