import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import{ Router, ActivatedRoute, Params, ParamMap } from '@angular/router'
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {

  private confirmationSuccessListenerSubs: Subscription
  public isConfirming = true; 
  public errorConfirming = false;

  constructor(public authService: AuthService , private activatedRoute: ActivatedRoute, private router: Router ) { }

  ngOnInit() {

    let emailToken
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('emailToken')){
        emailToken = paramMap.get('emailToken');
        // console.log(emailToken);
        this.authService.confirmation(emailToken)
        this.confirmationSuccessListenerSubs = this.authService.getConfirmationSuccessListener()
          .subscribe(success => {
            if(success){
              this.isConfirming = false;
              setTimeout(()=> {this.router.navigate(['/login'])} , 3000)
            }

          }, err => {
            if(err){
              this.isConfirming = false;
              this.errorConfirming = true
            }
            
          })
      }
    })

  }

  ngOnDestroy(){
    this.confirmationSuccessListenerSubs.unsubscribe();
    this.isConfirming = true;
    this.errorConfirming = false;
  }

}
