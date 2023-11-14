import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * Service for downloading images or files for the result view
 */
@Injectable({
  providedIn: 'root'
})
export class ImageDownloaderService {

  constructor(private http: HttpClient) { }

  /**
   * Downloads file from the backend
   * @param fileName unique file resource identifier
   * @returns Observable with the downloaded file as a js File object
   */
  downloadFile(fileName: string): Observable<File> {
    return this.http.get(`${environment.backendApi}/files/${fileName}`, { responseType: 'blob', observe: 'response' })
    .pipe(
      map((response: HttpResponse<Blob>) => {
        const blob = response.body as Blob;
        const file = new File([blob], fileName);
        return file;
      })
    );
    
  }
}
