import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { SignUpData } from './signup-data.model';

import { Subject , Observable} from 'rxjs';
// import { Observable } from 'rxjs/Observable'
import { Router } from '@angular/router';
import {UtilStringsService} from '../util-strings.service'
import {FanZoneService} from '../fan-zone/fan-zone.service'


@Injectable({providedIn: "root"})
export class AuthService {

    
    private token: string;
    private authStatusListener = new Subject<boolean>()
    private authAdminListener = new Subject<boolean>()
    private loginErrorListener = new Subject<string>()
    private signUpErrorListener = new Subject<string>()
    private signUpSuccessListener = new Subject<boolean>()
    private confirmationSuccessListener = new Subject<boolean>()

    private userRole: string;
    private isAuthenticated = false;
    private tokenTimer: any

    constructor( private utilStrings: UtilStringsService, private http: HttpClient, private router: Router, private fanZoneService: FanZoneService){}



    getToken() {
        return this.token;
    }

    getIsAuth() {
        // this.autoAuthUser()
        return this.isAuthenticated
    }

    getAuthStatusListener() {
      return this.authStatusListener.asObservable();
    }

    getAdminStatusListener() {
      return this.authAdminListener.asObservable();
    }

    getLoginErrorStatusListener() {
      return this.loginErrorListener.asObservable();
    }

    getSignUpErrorStatusListener(){
      return this.signUpErrorListener.asObservable();
    }

    getSignUpSuccessListener(){
      return this.signUpSuccessListener.asObservable();
    }

    getConfirmationSuccessListener(){
      return this.confirmationSuccessListener.asObservable();
    }

    login(email: string, password: string) {
        const authData: AuthData = {email: email, password: password};
        // console.log(authData);
        console.log(this.utilStrings.getLoginPath())
        this.http.post<{token: string , expiresIn: number , role: string}>(this.utilStrings.getLoginPath() , authData)
          .subscribe(response => {
            // console.log(response);
            const token = response.token
            this.token = token;
            this.userRole = response.role
            // console.log(token)
            

            if(token) {              
              const expiresInDuration = response.expiresIn
              this.setAuthTimer(expiresInDuration)
              this.isAuthenticated = true
              this.authStatusListener.next(true);
              if(this.userRole === "admin"){
                this.authAdminListener.next(true);
              }
              const now = new Date();
              const expirationDate =  new Date (now.getTime() + expiresInDuration * 1000)
              this.saveAuthData(token , expirationDate, this.userRole )
              this.router.navigate(['/'])              
            }
            
        }, err => {
          // console.log("estou no erro");
          // console.log(err.error.message);
          this.loginErrorListener.next(err.error.message);
        });       
    }

    logout(){
      this.token = null;
      this.isAuthenticated = false
      this.userRole = "none"
      this.authStatusListener.next(false)
      this.authAdminListener.next(false);
      this.fanZoneService.deleteAlbunsInfo();
      this.fanZoneService.deleteUserData();
      clearTimeout(this.tokenTimer)
      this.clearAuthData()
      this.router.navigate(['/'])
      
    }

    signUp(email: string, name:string, password: string){
      const signUpData: SignUpData = {email: email, name: name,  password: password};
      this.http.post(this.utilStrings.getSignUpPath() , signUpData)
        .subscribe(response => {
          if(response){
            this.signUpSuccessListener.next(true);
          }

        },
        err => {
          console.log("stou no erro")
          this.signUpErrorListener.next(err.error.message);
        });

    }

    confirmation(emailToken: string){
      console.log("estou na confirmation", emailToken)
      this.http.post(this.utilStrings.getConfirmationPath(), {emailToken: emailToken})
        .subscribe(response => {
          if(response){
            console.log("tudo correu be,")
            this.confirmationSuccessListener.next(true)
          }
        },
        err => {
          console.log("erro na confirmation", err);
          this.confirmationSuccessListener.next(false)
        })
    }



    private setAuthTimer(duration: number) {
      this.tokenTimer = setTimeout(()=> {
        this.logout()
      }, duration * 1000) 
    }
  
    private saveAuthData(token: string , expirationDate: Date, role:string) {
      localStorage.setItem('token' , token)
      localStorage.setItem('expiration' , expirationDate.toISOString())
      localStorage.setItem('role' , role)
  
    }
  
    private clearAuthData(){
      localStorage.removeItem('token')
      localStorage.removeItem('expiration')
    }
  
    public getAuthData() {
      const token = localStorage.getItem("token")
      const expirationDate = localStorage.getItem("expiration")
      const role = localStorage.getItem("role")
      if( !token && !expirationDate) {
        return 
      }
      return {
        token: token,
        expirationDate: new Date(expirationDate),
        role: role
      }
  }



}