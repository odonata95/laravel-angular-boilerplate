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
      this.warningMessage = '';
      if(Array.isArray(res)) {
        this.warningMessage += res[0];
      } 
      // if not errors - navigate to home
      if(!this.warningMessage)
        this.router.navigate(['home']);
    }, error => {
      this.warningMessage = "Invalid Credentials!";
      console.error(error);
    } );
  }

}
