import { Component, OnInit  } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})



export class LoginComponent implements OnInit {

  private loginErrorListenerSubs: Subscription
  private flagLogin = false

  constructor(public authService: AuthService  ) { }

  ngOnInit() {     
  }


  onLogin(loginForm: NgForm){
    
    if(loginForm.invalid){
      return;
    }
    
    if( loginForm.value.email.indexOf("@") < 0){
      loginForm.form.controls['email'].setErrors({'incorrect': true , message: `Por favor insira um Email válido`});
      return;
    }
  
    this.authService.login(loginForm.value.email, loginForm.value.password)
    this.loginErrorListenerSubs = this.authService.getLoginErrorStatusListener()
      .subscribe( errorMessage => {
        this.flagLogin = true;
        if(errorMessage === "Autenticação Falhou no Email"){        
          loginForm.form.controls['email'].setErrors({'incorrect': true , message: `Não temos esse email na nossa Base de Dados. Inscrever!`});
          setTimeout( ()=> { 
            loginForm.form.controls['email'].setValue("");
            loginForm.form.controls['password'].setValue("");
          } , 1500);  
          
        }
        else if(errorMessage ===  "Autenticação Falhou na Password"){
          loginForm.form.controls['password'].setErrors({'incorrect': true , message: `Password Incorreta`});
          setTimeout( ()=> { loginForm.form.controls['password'].setValue(""); } , 1500);          
        }
        else if(errorMessage === "Autenticação Falhou no Email por estar Inativo"){
          loginForm.form.controls['email'].setErrors({'incorrect': true , message: `O Utilizador ainda não validou o registo`});        

        }
      })
      
      
  }

  ngOnDestroy(){   
    if(this.flagLogin) {
      this.loginErrorListenerSubs.unsubscribe()
      this.flagLogin = false
    }
    
  }

}
