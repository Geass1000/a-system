import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

/* App Feature - Component */
import { SignupComponent } from './signup.component';
import { LoginComponent } from './login.component';

/* App Feature - Service */
import { AuthService } from './auth.service';

@NgModule({
  imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		HttpModule
	],
  declarations: [
		SignupComponent,
		LoginComponent
	],
  exports: [
		SignupComponent,
		LoginComponent
	],
  providers: [
		AuthService
	]
})
export class AuthModule { }
