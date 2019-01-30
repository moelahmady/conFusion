import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/base'

import { Feedback } from '../shared/feedback';
import { ProcessHTTPMsgService } from './process-httpmsg.service';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private processHTTPMsgService: ProcessHTTPMsgService, private http: HttpClient) { }

  submitFeedback(feedback: Feedback): Observable<Feedback[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    
    this.http.post<Feedback>(baseURL+'feedback', feedback, httpOptions)
      .pipe(catchError(this.processHTTPMsgService.handleError));

      return this.http.get<Feedback[]>(baseURL + 'feedback').pipe(catchError(this.processHTTPMsgService.handleError));
    }
}
