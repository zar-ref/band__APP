import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  private signUpErrorListenerSubs: Subscription
  private signUpSuccessListenerSubs: Subscription
  public flagSignUpSucceeded = false;
  public flagSignUpError = false

  constructor(public authService: AuthService) { }

  ngOnInit() {
  }

  onSignUp(signUpForm: NgForm){
    if(signUpForm.invalid){
      return;
    }   
    console.log("cheguei aqui" , signUpForm.value.email,  signUpForm.value.emailConfirmation, signUpForm.value.password);
    if( signUpForm.value.email.indexOf("@") < 0){
      signUpForm.form.controls['email'].setErrors({'incorrect': true , message: `Por favor insira um Email válido`});
      return;
    }
    if( signUpForm.value.emailConfirmation.indexOf("@") <0){
      signUpForm.form.controls['emailConfirmation'].setErrors({'incorrect': true , message: `Por favor insira um Email válido`});
      return;
    }
    if( signUpForm.value.email !== signUpForm.value.emailConfirmation){
      signUpForm.form.controls['email'].setErrors({'incorrect': true , message: `Os Emails não coincindem`});
      signUpForm.form.controls['emailConfirmation'].setErrors({'incorrect': true , message: `Os Emails não coincindem`});
      return
    }

    this.authService.signUp(signUpForm.value.email, signUpForm.value.nome ,signUpForm.value.password);
    this.signUpErrorListenerSubs= this.authService.getSignUpErrorStatusListener()
      .subscribe(errorMessage => {
        this.flagSignUpError = true;
        if(errorMessage === "Utilizador já se inscreveu"){
          signUpForm.form.controls['email'].setErrors({'incorrect': true , message: `Este Utilizador já se inscreveu`});
          signUpForm.form.controls['emailConfirmation'].setErrors({'incorrect': true , message: `Este Utilizador já se inscreveu`});
          setTimeout( ()=> { 
            signUpForm.form.controls['nome'].setValue(""); 
            signUpForm.form.controls['email'].setValue("");
            signUpForm.form.controls['emailConfirmation'].setValue("");
            signUpForm.form.controls['password'].setValue("");
          } , 1500);  
        }
      })
    this.signUpSuccessListenerSubs = this.authService.getSignUpSuccessListener()
      .subscribe(success => {
        if(success){
          this.flagSignUpSucceeded = true
        }
      })




  }

  ngOnDestroy(){   
    if(this.flagSignUpError) {
      this.signUpErrorListenerSubs.unsubscribe()
      this.flagSignUpError = false
    }
    if(this.flagSignUpSucceeded){
      this.signUpSuccessListenerSubs.unsubscribe()
      this.flagSignUpSucceeded = false
    }
  }

}
