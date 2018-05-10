import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthenticationService {
    public token: string;
    private headers: Headers;
    private readonly apiUrl = environment.apiUrl;
    private readonly baseUrl = environment.baseUrl;

    constructor(private http: Http) {
        //append headers
        this.headers = new Headers();
        this.headers.append("Content-Type", 'application/json');
        this.headers.append("Access-Control-Allow-Origin", "*");
        this.headers.append("Access-Control-Allow-Headers", "Origin, Authorization, Content-Type, Accept");
        
        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem('user'));
        this.token = currentUser && currentUser.token;
    }

    login(email: string, password: string): Observable<any> {
        let request = JSON.stringify({ email: email, password: password });
        let options = new RequestOptions({ headers: this.headers }); // Create a request option
        return this.http.post(this.apiUrl+'/login', request, options)
            .pipe(
                map((response: Response) => {
                    // login successful if there's a jwt token in the response
                    this.token = response.json().token;
                    let email = response.json().email;
                    if (this.token) {
                        // store email and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('user', 
                            JSON.stringify({ email: email, token: this.token }));
                    }
                    return response;
                })
            );
    }

    register(username: string, email: string, password: string): Observable<any> {
        let request = JSON.stringify({ email: email, name: username, password: password });
        let options = new RequestOptions({ headers: this.headers }); // Create a request option
        return this.http.post(this.apiUrl+'/register', request, options)
            .pipe(
                map((response: Response) => {
                    // register successful if there's a jwt token in the response
                    this.token = response.json().token;
                    let email = response.json().email;
                    if (this.token) {
                        // store email and jwt token in local storage to keep user logged in between page refreshes
                        localStorage.setItem('user', 
                            JSON.stringify({ email: email, token: this.token }));
                    }
                    return response;
                })
            );
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('user');
    }

    sendPasswordResetEmail(email: string): Observable<boolean>  {
        let url = this.baseUrl+'/reset-password';
        let request = JSON.stringify({ email: email, url:  url });
        let options = new RequestOptions({ headers: this.headers });
        return this.http.post(this.apiUrl+'/password-reset-email', request, options)
            .pipe(
                map((response: Response) => {
                    return response.json();
                })
            );
    }

    resetPassword(newPassword: string, confirmedPassword: string, token: string): Observable<boolean> {
        let request = JSON.stringify({ password: newPassword, 
          confirm_password: confirmedPassword, token: token });
        let options = new RequestOptions({ headers: this.headers });
        return this.http.post(this.apiUrl+'/reset-password', request, options)
            .pipe(
                map((response: Response) => {
                    return response.json();
                })
            );
    }

}