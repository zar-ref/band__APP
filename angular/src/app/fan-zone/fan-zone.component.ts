import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import {FanZoneService} from './fan-zone.service';
import {AdminZoneService} from '../admin-zone/admin-zone.service'
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UtilStringsService } from '../util-strings.service';
import { AlbumData } from '../album-data.model';
import { saveAs} from 'file-saver';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-fan-zone',
  templateUrl: './fan-zone.component.html',
  styleUrls: ['./fan-zone.component.scss']
})
export class FanZoneComponent implements OnInit {

  userIsAuthenticated = false;
  private user :string;
  private userSub: Subscription;
  private albunsInfo: AlbumData[] = [];
  private albunsInfoSub: Subscription
  public isGettingAlbumInfo: boolean = false;
  public authInformation;
  private reloadAlbumInfo : Subscription;

  constructor(private authService: AuthService, private fanZoneService: FanZoneService, private router: Router, private utilStrings: UtilStringsService, private sanitizer: DomSanitizer, private adminZoneService: AdminZoneService ) { }
  
  ngOnInit() {
    this.isGettingAlbumInfo = true;
    this.authInformation = this.authService.getAuthData();
    console.log(this.authInformation)
    if(!this.authInformation){
      this.isGettingAlbumInfo = false;
      window.location.href = this.utilStrings.getAngularPath();
      return
    }

    
    this.user = this.fanZoneService.getUserData();
    console.log("user email = ", this.user)
    if(!this.user){
      const userToken = this.authService.getAuthData().token;
      this.fanZoneService.getUserFromToken(userToken);
      this.userSub = this.fanZoneService.getUserFromTokenStatus()
        .subscribe(user=>{
          this.user = user;
          this.userSub.unsubscribe()
          this.fanZoneService.saveUserData(user);
          // console.log("estou no primeiro subscribe")
          this.albunsInfo = this.fanZoneService.getAlbunsInfo();
          // console.log("depois do subscribe")
          if(!this.albunsInfo){
            // console.log("dentro da get albuns info")
            this.fanZoneService.getAlbunsPreview(this.user);
            this.albunsInfoSub = this.fanZoneService.getAlbunsInfoListener()
              .subscribe(albunsInfo=>{
                this.albunsInfo = albunsInfo;
                this.albunsInfoSub.unsubscribe();
                this.isGettingAlbumInfo = false;
              })
          }else{
            this.isGettingAlbumInfo=false
          }
        })
    }else {
      this.albunsInfo = this.fanZoneService.getAlbunsInfo();
      console.log("depois do subscribe")
      if(!this.albunsInfo){
        console.log("dentro da get albuns info")
        this.fanZoneService.getAlbunsPreview(this.user);
        this.albunsInfoSub = this.fanZoneService.getAlbunsInfoListener()
          .subscribe(albunsInfo=>{
            this.albunsInfo = albunsInfo;
            this.albunsInfoSub.unsubscribe();
            this.isGettingAlbumInfo = false;
          })
      }else{
        this.isGettingAlbumInfo=false
      }
    }
    
  }

  reloadGetAlbuns(){
    this.isGettingAlbumInfo = true;
    console.log("estou na reload");
    this.fanZoneService.getAlbunsPreview(this.user);
    this.albunsInfoSub = this.fanZoneService.getAlbunsInfoListener()
      .subscribe(albunsInfo=>{
        this.albunsInfo = albunsInfo;
        this.albunsInfoSub.unsubscribe();
        this.isGettingAlbumInfo = false;
      })
  }

  getSantizeUrl(url : string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  getLinks(albumId:number , file: string){
    let link = this.utilStrings.getSitePath() + '/Albuns/' + albumId.toString() + "/" + file;
    const santizeLink = this.getSantizeUrl(link);
    return santizeLink;
  }

  getAccessToAlbum(albumId:number ){
    console.log(albumId)
    console.log(this.user);
    this.fanZoneService.getAccessToAlbum(albumId, this.user);
    this.reloadAlbumInfo = this.fanZoneService.getAlbumAccessListener()
      .subscribe(res => {
        this.reloadGetAlbuns()
      },
      err => {
        this.reloadGetAlbuns();
      })
    
  }

  //////Métodos que usam AdminZoneService

  getDownloadLink(albumId:number , file: string){
    this.adminZoneService.downloadMusic(albumId, file)
      .subscribe(data => {
        saveAs(data, file);
      },
      err =>{
        console.log(err);
      });
  }

}
