import { Inject,Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class LocalWriteService {
  private isBrowser: boolean;
constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  /* Saves a value in local storage under the specified key.
   * @param key - A string representing the key to associate with the value
   * @param value - The value to be stored in local storage.
  */
  public saveData(key:string,value:string):void{
    if(this.isBrowser)
      localStorage.setItem(key,value);
  }
  /* Retrieves the stored value present in  local storage for the specified key
  *@param key - The key to search for in local storage.
  *@returns The stored value if found; otherwise, null.
   */
  public getData(key:string):string | null{
    if(this.isBrowser)
      return localStorage.getItem(key);
    return null;
  }

/**
 * Removes the key-value pair associated with the specified key from local storage.
 * @param key - The key of the item to remove from local storage.
 */
  public removeData(key:string):void{
    if(this.isBrowser)
      localStorage.removeItem(key);
  }
  /* Wipe out all the data in the local storage
   * */
  public clearData():void{
    if(this.isBrowser)
      localStorage.clear();
  }
}
