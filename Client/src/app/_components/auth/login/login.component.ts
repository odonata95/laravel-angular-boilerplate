import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../_services/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private email: string = '';
  private password: string = '';
  private warningMessage: string;

  constructor(private authService: AuthenticationService, private router: Router) { 
  }

  ngOnInit() {
  }

  onLogIn() {
    this.authService.login(this.email, this.password)
    .subscribe(res => {
      //check for errors
      let err = JSON.parse(res._body);
      this.warningMessage = '';
      if(Array.isArray(err)) {
        this.warningMessage += err[0];
      } 
      // if not errors - navigate to home
      if(!this.warningMessage)
        this.router.navigate(['home']);
    }, error => {
      this.warningMessage = "Invalid Credentials!";
      console.error(error);
    } );
  }

  /*
  refreshToken(time=3000000) {
    setInterval( () => {this.authService.refreshToken();}, time); 
  }
  */

}
