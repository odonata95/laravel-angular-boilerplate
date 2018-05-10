import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../_services/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  private email: string = '';
  private name: string = '';
  private password: string = '';
  private warningMessage: string;

  constructor(private authService: AuthenticationService, private router: Router) { }

  ngOnInit() {
  }

  onRegister() {
    this.authService.register(this.name, this.email, this.password)
    .subscribe(res => {
      //check for errors
      let err = JSON.parse(res._body);
      this.warningMessage = '';
      if(Array.isArray(err.email)) {
        this.warningMessage += err.email[0];
      } 
      if(Array.isArray(err.name)) {
        this.warningMessage += err.name[0];
      } 
      if(Array.isArray(err.password)) {
        this.warningMessage += err.password[0];
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
