import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalWriteService {

  constructor() { }
  /* Saves a value in local storage under the specified key.
   * @param key - A string representing the key to associate with the value
   * @param value - The value to be stored in local storage.
  */
  public saveData(key:string,value:string):void{
    localStorage.setItem(key,value);
  }
  /* Retrieves the stored value present in  local storage for the specified key
  *@param key - The key to search for in local storage.
  *@returns The stored value if found; otherwise, null.
   */
  public getData(key:string):string | null{
    return localStorage.getItem(key);
  }

/**
 * Removes the key-value pair associated with the specified key from local storage.
 * @param key - The key of the item to remove from local storage.
 */
  public removeData(key:string):void{
    localStorage.removeItem(key);
  }
  /* Wipe out all the data in the local storage
   * */
  public clearData():void{
    localStorage.clear();
  }
}
