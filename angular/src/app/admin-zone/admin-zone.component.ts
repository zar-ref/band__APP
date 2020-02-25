import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import{MatDialog} from '@angular/material/dialog'
import { saveAs} from 'file-saver';
import {User} from './user.model'
import { AuthService } from '../auth/auth.service';
import{AdminZoneService} from './admin-zone.service'
import { Subscription } from 'rxjs';

import{EditUserComponent} from './dialogs/edit-user/edit-user.component'
import {DeleteUserComponent} from './dialogs/delete-user/delete-user.component'
import{UtilStringsService} from '../util-strings.service'
import {AlbumData} from '../album-data.model'
import { DomSanitizer } from '@angular/platform-browser';
import {DeleteMusicComponent} from './dialogs/delete-music/delete-music.component'
import{AddMusicToAlbumComponent} from './dialogs/add-music-to-album/add-music-to-album.component';
import {EditAlbumImageComponent} from './dialogs/edit-album-image/edit-album-image.component'
import {EditAlbumDescriptionComponent} from './dialogs/edit-album-description/edit-album-description.component'
import {DeleteAlbumComponent} from './dialogs/delete-album/delete-album.component'
import {EditAlbumNameComponent} from './dialogs/edit-album-name/edit-album-name.component'

interface Music {
	name: string;
  filename: string;
  file: File;
}

interface AlbumPicture {	
  filename: string;
  file: File;
}




@Component({
  selector: 'app-admin-zone',
  templateUrl: './admin-zone.component.html',
  styleUrls: ['./admin-zone.component.scss']
})
export class AdminZoneComponent implements OnInit {
  ///Variáveis de Uilizadores
  isViewingUsers = false
  users: User[] = []
  private usersSub: Subscription
  usersColumnsToDisplay = ['email', 'name', 'date' , 'role' ,'action'];

  

  constructor(
      private authService: AuthService, 
      private router: Router, 
      private adminZoneService: AdminZoneService, 
      private matDialog:MatDialog ,
      private utilStrings: UtilStringsService, 
      private sanitizer: DomSanitizer     
    ) {
      this.albumForm = {musics: [] , albumPicture: { filename: "" ,file: null} , albumName: ""}
      this.addMusicToNewAlbum();
     }

  ngOnInit() {
    const authInformation = this.authService.getAuthData();
    if(!authInformation){
      // this.router.navigate(['/']) 
      // window.location.reload() 
    }
    this.users = this.adminZoneService.getUsersData();  
    this.albunsData = this.adminZoneService.getAlbunsData(); 
    console.log(this.albunsData);
  }

  viewUsers(){
    
    this.isViewingUsers = true
    if(!this.users){
      this.adminZoneService.getUsers();
      this.usersSub = this.adminZoneService.getUsersListener()
        .subscribe((users)=> {
          this.users = users;
          
        },
        err =>{
          console.log(err)
        })
    }    
  }

  hideUsers(){
    this.isViewingUsers = false    
  }

  showEditUserDialog(email:string, role:string){
    const dialogRef = this.matDialog.open( EditUserComponent, {
      width: '250px',
      height: '300px',
      data: {email: email, role: role}
    });
  }

  updateUsers(){
    this.adminZoneService.deleteUsersData()
    this.users = null
    this.viewUsers();
  }

  showDeleteUserDialog(email:string, name:string){
    const dialogRef = this.matDialog.open( DeleteUserComponent, {
      width: '250px',
      height: '300px',
      data: {email: email ,name:name}
    });
  }

  /// Variáveis de Albuns
  public fileToUpload: File = null;
  public isCreatingAlbum = false;
  public isViewingAlbuns = false;
  public albumImageSelection = "Sim";
  public newAlbumName = "";
  public newAlbumDescription = "";
  public albumForm: {
    musics: Music[];
    albumPicture: AlbumPicture;
    albumName: string;
  }
  public flagCorrectForm = true
  public incorrectFormCause = "";
  private albumMaxIdSub: Subscription
  private imageTypes = ['jpeg', 'png'];
  public albunsData: AlbumData[] = [];
  public isGettingAlbumData = false;
  private albunsDataSub: Subscription
  

  ////Funções de Albuns
  viewAlbumCreation(){
      this.isCreatingAlbum = true
    }

  hideAlbumCreation(){
    this.isCreatingAlbum = false
  }

  addMusicToNewAlbum(){
    this.albumForm.musics.push({
      name: "",
      filename: "",
      file: null
    })
  } 

  public removeMusicFromNewAlbum( index: number ) {
    if(index === 0){
      this.flagCorrectForm = false
      this.incorrectFormCause="O Novo Album tem de conter pelo menos uma música"
      setTimeout(()=>{this.flagCorrectForm=true}, 3000);
      return;
    }
		this.albumForm.musics.splice( index, 1 );

	}
  
  handleNewAlbumNameInput(newAlbumName: string){
    this.newAlbumName = newAlbumName;
    // console.log(this.newAlbumName);
  }

  handleNewAlbumPictureInput(files: FileList){
    this.albumForm.albumPicture.file = files.item(0);
    this.albumForm.albumPicture.filename =  files.item(0).name;
    // console.log(this.albumForm.albumPicture.file.type.split('/')[1])

  }

  handleNewAlbumMusicInput( files: FileList, index:number){
      const musicName = files.item(0).name.split(".")[0];
      // console.log(files.item(0).type.split("/")[1])
      this.albumForm.musics[index] = {
        name: musicName,
        filename: files.item(0).name,
        file: files.item(0)
      }      
      
  }

  handleNewAlbumDescription(description: string){
    // console.log(description);
    this.newAlbumDescription = description;
  }

  checkNewAlbumFormErrors(){
    if(this.newAlbumName ===""){
      this.flagCorrectForm = false
      this.incorrectFormCause="Falta submeter, pelo menos, o nome do Album";
      return this.flagCorrectForm;
    }

    if(this.albumImageSelection ==="Sim" && this.albumForm.albumPicture === null){
      this.flagCorrectForm = false
      this.incorrectFormCause="Falta submeter, pelo menos, a Capa do Album";
      return this.flagCorrectForm;
    }
    if(this.albumImageSelection ==="Sim" && !this.imageTypes.includes( this.albumForm.albumPicture.file.type.split('/')[1]) ){
      this.flagCorrectForm = false
      this.incorrectFormCause="O ficheiro da Capa do Album não é suportado ";
      return this.flagCorrectForm;
    }

    for (let [index, music] of this.albumForm.musics.entries() ) {
      if(music.name="") {
        this.flagCorrectForm = false
        const errorIndex = index+1;
        this.incorrectFormCause="Falta submeter, pelo menos, a música nº" + errorIndex;
        break;
        
      }
      if(music.file.type.split('/')[1] !== "mpeg"){
        this.flagCorrectForm = false
        const errorIndex = index+1;
        this.incorrectFormCause="Pelo menos, o ficheiro da  a música nº" + errorIndex + " não é suportado";
        break;
      }
    }

    return this.flagCorrectForm;
  }

  cleanNewAlbumForm(){
    this.albumForm.musics = []
    this.albumForm.albumPicture.file =null
    this.albumForm.albumPicture.filename =""
    this.albumForm.albumName = "";
    this.newAlbumName = "";
    this.albumImageSelection = "Sim"
    this.addMusicToNewAlbum()

  }

  subimtNewAlbumForm(){
    // console.log("na submit Album Form");
    const errors = this.checkNewAlbumFormErrors()
    if(!errors){
      setTimeout(()=>{this.flagCorrectForm=true}, 3000);
      return
    }
    let albumDir: number
    this.adminZoneService.getAlbunsMaxId();    
    this.albumMaxIdSub = this.adminZoneService.getAlbunsMaxIdStatus()
      .subscribe((albumMaxId : number )=>{
        if(albumMaxId == -1){
          this.flagCorrectForm = false
          this.incorrectFormCause="Erro na Base de Dados, por favor contactar o administrador"
          setTimeout(()=>{this.flagCorrectForm=true}, 3000);
        }
        albumDir = albumMaxId
        // console.log("no subscibe", albumMaxId);
        this.adminZoneService.createNewAlbum(this.newAlbumName, albumDir.toString() , this.newAlbumDescription)
        this.albumForm.musics.forEach((music)=>{
            // console.log(music);
            this.uploadMusic(music.file , albumDir.toString());
        })
        if(this.albumForm.albumPicture.file != null ){
          // console.log("estou no uload image");
          this.uploadImage(this.albumForm.albumPicture.file ,albumDir.toString() )
        }
        
        this.albumMaxIdSub.unsubscribe();
        this.cleanNewAlbumForm();
        this.isCreatingAlbum = false;
      },
      err=>{
        this.flagCorrectForm = false
        this.incorrectFormCause="Erro na sumissão do álbum, por favor contactar o administrador"
        this.albumMaxIdSub.unsubscribe();
        setTimeout(()=>{this.flagCorrectForm=true}, 3000);
        return
    })  
  }

  



  handleFileInput(files: FileList){
    this.fileToUpload = files.item(0);
    console.log(this.fileToUpload);
  }

  uploadMusic(fileToUpload: File, albumDir: string){
    if(fileToUpload == null){
      return;
    }
    this.adminZoneService.uploadMusic(fileToUpload, albumDir);
  }

  showDeleteMusicDialog(albumId: number, musicToDelete:string, albumName: string){
    console.log(albumId);
    const dialogRef = this.matDialog.open( DeleteMusicComponent, {
      width: '250px',
      height: '300px',
      data: {albumId: albumId ,musicToDelete: musicToDelete, albumName: albumName}
    });
  }

  showAddMusicToAlbumDialog(albumId: number, albumName: string, musicsInAlbum: string[]){
    console.log(albumId);
    const dialogRef = this.matDialog.open( AddMusicToAlbumComponent, {
      width: '550px',
      height: '380px',
      data: {albumId: albumId, albumName: albumName , musicsInAlbum: musicsInAlbum}
    });
  }

  showEditAlbumImageDialog(albumId: number, albumImageUrl: string, albumName: string){
    const dialogRef = this.matDialog.open( EditAlbumImageComponent, {
      width: '550px',
      height: '380px',
      data: {albumId: albumId, albumImageUrl: albumImageUrl, albumName: albumName}
    });
  }

  showEditAlbumDescriptionDialog(albumId: number, albumDescription:string, albumName: string){
    const dialogRef = this.matDialog.open( EditAlbumDescriptionComponent, {
      width: '550px',
      height: '380px',
      data: {albumId: albumId,albumDescription: albumDescription , albumName: albumName}
    });
  }

  showEditAlbumNameDialog(albumId: number,albumName: string){
    const dialogRef = this.matDialog.open( EditAlbumNameComponent, {
      width: '550px',
      height: '180px',
      data: {albumId: albumId, albumName: albumName}
    });
  }

  showDeleteAlbum(albumId: number,albumName: string) {
    const dialogRef = this.matDialog.open( DeleteAlbumComponent, {
      width: '350px',
      height: '300px',
      data: {albumId: albumId, albumName: albumName}
    });
  }


  uploadImage(fileToUpload: File, albumDir: string){
    if(fileToUpload == null){
      return;
    }
    this.adminZoneService.uploadImage(fileToUpload, albumDir);
  }

  showAlbuns(){
   
    // this.adminZoneService.deleteAlbunsData();
    // this.albunsData = null;
    this.isViewingAlbuns = true
    if(!this.albunsData){
        this.getAlbuns();
    }
  }


  hideAlbuns(){
      this.isViewingAlbuns = false
  
  
  }

  getSantizeUrl(url : string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  getLinks(albumId:number , file: string){
    const link = this.utilStrings.getSitePath() + '/Albuns/' + albumId.toString() + "/" + file;
    return this.getSantizeUrl(link);
  }

  getDownloadLink(albumId:number , file: string){
    this.adminZoneService.downloadMusic(albumId, file)
      .subscribe(data => {
        saveAs(data, file);
      },
      err =>{
        console.log(err);
      });
  }


  updateAlbuns(){
    this.getAlbuns();
  }
  

  getAlbuns(){
    console.log("estou na get albuns");
    this.adminZoneService.deleteAlbunsData();
    this.albunsData = null;
    this.isGettingAlbumData = true

    this.adminZoneService.getAlbuns();
    this.albunsDataSub = this.adminZoneService.getAlbunsDataListener()
      .subscribe(albunsData =>{
        this.albunsData = albunsData
        console.log(this.albunsData);
        this.albunsDataSub.unsubscribe();
        this.isGettingAlbumData = false;

      },
      err => {
        console.log(err)
      })
    
   
  }
}
