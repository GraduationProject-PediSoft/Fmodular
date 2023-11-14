import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Manage Intercomunnication with the tag popup
 */
@Injectable({
  providedIn: 'root'
})
export class TagsService {

  constructor() { }

  private tagsDataSubject = new BehaviorSubject<Map<string, string>>(new Map<string, string>());
  tagsData = this.tagsDataSubject.asObservable();

  /**
   * Set dicom tags as a BehaviourSubject for better performance
   * @param tagsData dicom tags info
   */
  setTagsData(tagsData: Map<string, string>) {
    this.tagsDataSubject.next(tagsData);
  }
}
