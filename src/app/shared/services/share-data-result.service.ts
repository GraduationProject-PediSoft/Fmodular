import { Injectable } from '@angular/core';

/**
 * Shared service for sharinfg data between the FormView and the ResultView
 */
@Injectable({
  providedIn: 'root'
})
export class ShareDataResultService {

  sharedData: Map<string, any> = new Map

  /**
   * Add data to the service
   * @param key 
   * @param value 
   */
  addData(key: string, value: any){
    this.sharedData.set(key, value)
  }

  /**
   * Get data by the fiven key
   * @param key key of the data
   * @returns Data as an any object
   */
  getData(key: string): any{
    return this.sharedData.get(key);
  }
}
