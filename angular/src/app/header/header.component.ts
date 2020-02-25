import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  userIsAuthenticated = false;
  isAdmin = false;
  private authListenerSubs: Subscription
  private authAdminListenerSubs: Subscription

  constructor(private authService: AuthService ) { }

  ngOnInit() {
       
    const authInformation = this.authService.getAuthData();
    if(authInformation){
       
      this.userIsAuthenticated = true;
      if(authInformation.role === "admin"){
        this.isAdmin = true;
      }
      const now = new Date()
      const expiresIn = authInformation.expirationDate.getTime() - now.getTime()
      if (expiresIn < 0) {
        this.authService.logout();
      }
    }
    this.authListenerSubs = this.authService.getAuthStatusListener()
      .subscribe((isAuthenticated => {
        console.log("estou no header com user = ", isAuthenticated)
        this.userIsAuthenticated = isAuthenticated
    }))
    this.authAdminListenerSubs = this.authService.getAdminStatusListener()
      .subscribe((isAdmin)=> {
        this.isAdmin = isAdmin;
    })
  }

  onLogout(){
    this.isAdmin= false
    this.authService.logout()
   
  }
  ngOnDestroy(){
    this.isAdmin = false
    this.authListenerSubs.unsubscribe()
    this.authAdminListenerSubs.unsubscribe()
  }

}
