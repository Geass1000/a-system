import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth.service';

import { UserLogin } from './user-login';

@Component({
	moduleId: module.id,
  selector: 'as-login',
	templateUrl: 'login.component.html',
  styleUrls: [ 'login.component.css' ]
})
export class LoginComponent implements OnInit  {
	title = 'Login';

	user : UserLogin = new UserLogin('', '');

	constructor (private authService : AuthService) { ; }

	ngOnInit (): void {
    ;
  }

	onSubmit() {
		this.authService.addUser(this.user)
				.subscribe(
					(data) => { console.log("Success"); },
					(error) => { console.log(error);
				});
	}
}
