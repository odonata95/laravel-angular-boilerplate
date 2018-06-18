import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthenticationService {
    public token: string;
    private headers: HttpHeaders;
    private readonly apiUrl = environment.apiUrl;
    private readonly baseUrl = environment.baseUrl;

    constructor(private http: HttpClient) {
        //append headers
        this.headers = new HttpHeaders();
        this.headers.append("Content-Type", 'application/json');
        this.headers.append("Access-Control-Allow-Origin", "*");
        this.headers.append("Access-Control-Allow-Headers", "Origin, Authorization, Content-Type, Accept");
        
        // set token if saved in local storage
        var currentUser = JSON.parse(localStorage.getItem('user'));
        this.token = currentUser && currentUser.token;
    }

    login(email: string, password: string): Observable<any> {
        return this.http.post(this.apiUrl+'/login', { email: email, password: password }, { headers: this.headers } )
            .pipe(
                map((response: Response) => {
                    // login successful if there's a jwt token in the response
                    this.token = response['token'];
                    let email = response['email'];
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
        return this.http.post(this.apiUrl+'/register', { email: email, name: username, 
                password: password }, { headers: this.headers } )
            .pipe(
                map((response: Response) => {
                    // register successful if there's a jwt token in the response
                    this.token = response['token'];
                    let email = response['email'];
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

    sendPasswordResetEmail(email: string): Observable<any>  {
        let url = this.baseUrl+'/reset-password';
        return this.http.post(this.apiUrl+'/password-reset-email', 
                { email: email, url:  url }, { headers: this.headers } )
            .pipe(
                map((response: Response) => {
                    return response;
                })
            );
    }

    resetPassword(newPassword: string, confirmedPassword: string, token: string): Observable<any> {
        return this.http.post(this.apiUrl+'/reset-password', { password: newPassword, 
                confirm_password: confirmedPassword, token: token }, { headers: this.headers } )
            .pipe(
                map((response: Response) => {
                    return response;
                })
            );
    }

}