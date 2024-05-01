import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {
  private socket: Socket;
  observable: Observable<any> | any;

  serviceHost = 'http://localhost:3000/';


  constructor(private http: HttpClient) {
    // this.socket = io('http://localhost:3000/'); // Connect to Socket.IO server
    this.socket = io(this.serviceHost, { transports: ['websocket', 'polling'] });
    console.log(this.socket, "this.socket")

    this.socket.on('connect', () => {
      console.log('Connected to Socket.io server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Socket.io server');
    });

    this.socket.on('connect_error', (error: any) => {
      console.error('Connection error:', error);
    });

  }



  getMessage(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('chatmessage', (data: any) => {
        observer.next(data);
        console.log(data, 'datadata')
      });
    });
  }

 

  // GET FUNCTION 
  getFunction(url: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.get(this.serviceHost + url, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // Get one FUNCTION
  GetFunction(url: any, _id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put(this.serviceHost + url + _id, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // POST FUNCTION
  postFunction(url: any, data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post(this.serviceHost + url, data, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // PUT FUNCTION
  putFunction(url: any, _id: any, data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.put(this.serviceHost + url + _id, data, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  // DELETE FUNCTION
  deleteFunction(url: any, id: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.delete(this.serviceHost + url + id, { headers }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}
