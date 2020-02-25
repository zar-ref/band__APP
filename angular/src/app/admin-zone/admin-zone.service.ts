import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Subject} from 'rxjs' //
import {map} from 'rxjs/operators'

import {UtilStringsService} from '../util-strings.service'
import {User} from './user.model'
import {AlbumData} from '../album-data.model'

@Injectable({providedIn: "root"})
export class AdminZoneService {
    ///Variáveis de utilizadores
    private users: User[] = [];
    private usersListener = new Subject<User[]>()
    private updateUsersSuceess = new Subject<boolean>()
    private deleteUserSuceess = new Subject<boolean>()

    constructor( private utilStrings: UtilStringsService, private http: HttpClient){}

    ///////////// Funções de utilizadores

    getUsers(){
        
        this.http.get<{users: any}>(this.utilStrings.getAdminZoneUsersPath())
            .pipe( map((usersData)=>{ //pipe vai intercetar os dados obtidos (que neste caso são os dados dos utilizadors) e permite modificá-los através de operadores rxjs (map) de modo a que quando subscrevermos possaamos obter o resulatdos dos dados depois de aplicado, neste caso, o map
                
                return {users: usersData.users.map(user =>{
                    return {
                        email: user.email,
                        name: user.name,
                        date: user.date,
                        role: user.role
                    }
                })}
            }))
            .subscribe(transformedUsersData => {
                this.users = transformedUsersData.users;
                this.saveUsersData(this.users);
                this.usersListener.next(this.users);
                return

        });
    }

    getUsersListener(){
        return this.usersListener.asObservable();
    }


    saveUsersData(users: User[]){
        
        localStorage.setItem('users', JSON.stringify(users));
    }

    deleteUsersData(){
        localStorage.removeItem('users')
    }
    getUsersData(){
        const usersData = localStorage.getItem('users')
        return JSON.parse(usersData);
    }



    updateUserType(email: string, role:string){
        this.http.post(this.utilStrings.getAdminZoneUpdateUserTypePath(), {email: email, role:role} )
            .subscribe(response =>{
                // console.log(response)
                this.updateUsersSuceess.next(true)
            },
            err=> {
                console.log(err)
                this.updateUsersSuceess.next(false)
            })
    }

    getUpdateUserStatus(){
        return this.updateUsersSuceess.asObservable();
    }

    deleteUser(email:string){
        this.http.post(this.utilStrings.getAdminZoneDeleteUserPath(), {email:email})
            .subscribe(response => {
                // console.log(response)
                this.deleteUserSuceess.next(true)
            },
            err =>{
                console.log(err)
                this.deleteUserSuceess.next(false)
            })
    }
    getDeleteUserStatus(){
        return this.deleteUserSuceess.asObservable();
    }

    ///Variáveis de Albuns
    private albumMaxId = new Subject<number>()
    private albunsData: AlbumData[] = [];
    private albunsDataListener = new Subject<AlbumData[]>()
    private deleteMusicSuceess = new Subject<boolean>()
    
    ///Funções de Albuns

    getAlbunsDataListener(){
        return this.albunsDataListener.asObservable();
    }

   

    getAlbunsMaxIdStatus(){
        return this.albumMaxId.asObservable();
    }

    getDeleteMusicSuceessListener(){
        return this.deleteMusicSuceess.asObservable();
    }


    getAlbuns(){
        console.log(this.utilStrings.getBackendAlbunsPath())
        this.http.get<{albuns: any}>(this.utilStrings.getBackendAlbunsPath())
            .pipe( map(albunsInfo =>{
                return {albunsData: albunsInfo.albuns.map(album=>{
                    return {
                        albumId: album.albumId,
                        name: album.name,
                        path: album.path,
                        date: album.date,
                        description: album.description,
                        imgUrl: album.imgUrl,
                        musicsUrls: album.musicsUrls
                    }
                })}
            }))   
            .subscribe(transformedAlbunsData =>{
                console.log(transformedAlbunsData);
                this.albunsData = transformedAlbunsData.albunsData;
                this.albunsDataListener.next(this.albunsData);
                this.saveAlbunsData(this.albunsData);
                return
            },
            err => {
                console.log(err)
        })
    }

    saveAlbunsData(albunsData: AlbumData[]){
        
        localStorage.setItem('albunsData', JSON.stringify(albunsData));
    }

    deleteAlbunsData(){
        localStorage.removeItem('albunsData')
    }
    getAlbunsData(){
        const albunsData = localStorage.getItem('albunsData')
        return JSON.parse(albunsData);
    }


    createNewAlbum(newAlbumName: string, newAlbumDir:string, newAlbumDescription: string){
        console.log("estou na create new Album")
        this.http.post(this.utilStrings.getCreateNewAlbumPath(), {newAlbumName: newAlbumName, newAlbumDir: newAlbumDir, newAlbumDescription:newAlbumDescription})
            .subscribe(response =>{
                console.log(response)
            },
            err =>{
                console.log(err)
            })
    }

    getAlbunsMaxId(){
        
        this.http.get<{message: string, maxAlbumId:number}>(this.utilStrings.getAlbunsMaxIdPath())
            .subscribe(response =>{
                console.log("max Id = ",response);
                if(response.maxAlbumId == null){ //criação do primeiro album
                    this.albumMaxId.next(0);
                    return 
                }
                else {
                    console.log("enviei o maxId e tenho max id = ", response.maxAlbumId)
                    this.albumMaxId.next(response.maxAlbumId);
                    return 
                }
                
            },
            err => {
                console.log(err); //erro
                this.albumMaxId.next(-1);
                return
            })
            
    }


    uploadMusic(fileToUpload:File, albumDir:string){
        const formData = new FormData();
        formData.append('file', fileToUpload, fileToUpload.name )
        formData.append('dir', albumDir); 
        this.http.post(this.utilStrings.getMusicUploadPath(), formData )
            .subscribe(response=>{
                console.log(response)
            },
            err=>{
                console.log(err)
            })
    }

    deleteMusic(albumId: number, musicToDelete: string){
        this.http.post(this.utilStrings.getDeleteMusicPath(), {albumId: albumId, musicToDelete:musicToDelete})
            .subscribe(response => {
                this.deleteMusicSuceess.next(true)
            },
            err => {
                console.log(err)
                this.deleteMusicSuceess.next(false)
            })
    }

    downloadMusic(albumId: number, musicToDownload: string){
        const path = albumId.toString() + '/' + musicToDownload;
        console.log(path);
        const dir = albumId.toString();
        const music = musicToDownload;
        return this.http.post(this.utilStrings.getDownloadMusicPath(), {dir: dir, music: music},  {
            responseType: 'blob',
            headers:new HttpHeaders().append('Content-Type','application/json')
        });
    }

    uploadImage(fileToUpload:File, albumDir:string){
        const formData = new FormData();
        formData.append('image', fileToUpload, fileToUpload.name )
        formData.append('dir', albumDir); 
        this.http.post(this.utilStrings.getImageUploadPath() , formData )
            .subscribe(response => {
                console.log(response)
            },
            err => {
                console.log(err)
            })
    }

    deleteImage(albumId:number, imgToDelete: string){
        
        this.http.post(this.utilStrings.getDeleteAlbumPicturePath(), {albumId: albumId, imgToDelete:imgToDelete})
            .subscribe(response => {
                console.log(response)
            },
            err => {
                console.log(err);
            })
    }

    updateAlbumDescription(albumId:number, newAlbumDescription){
        this.http.post(this.utilStrings.getUpdateAlbumDescriptionPath(), {albumId: albumId, newAlbumDescription:newAlbumDescription})
            .subscribe(response => {
                console.log(response)
            },
            err => {
                console.log(err);
            })
    }

    updateAlbumName(albumId:number, newAlbumName){
        this.http.post(this.utilStrings.getUpdateAlbumNamePath(), {albumId: albumId, newAlbumName:newAlbumName})
            .subscribe(response => {
                console.log(response)
            },
            err => {
                console.log(err);
            })
    }

    deleteAlbum(albumId:number){
        this.http.post(this.utilStrings.getDeleteAlbumPath(), {albumId: albumId})
        .subscribe(response => {
            console.log(response)
        },
        err => {
            console.log(err);
        })
    }
}