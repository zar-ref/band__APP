import {AlbumData} from '../album-data.model'
import {UtilStringsService} from '../util-strings.service'
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Subject} from 'rxjs' //
import {map} from 'rxjs/operators'
import {User} from '../admin-zone/user.model'
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({providedIn: "root"})
export class FanZoneService {

    private userEmailListener = new Subject<string>()
    private albunsInfo: AlbumData[] = [];
    private albunsInfoListener = new Subject<AlbumData[]>()
    private albumAccessListener = new Subject<boolean>()

    constructor(private utilStrings: UtilStringsService, private http: HttpClient, private sanitizer: DomSanitizer){}

    getUserFromToken(token:string){
        this.http.get<{message: string, email: string}>(this.utilStrings.getUserEmailFromTokenPath() + token)
            .subscribe(response => {
                console.log(response)
                this.userEmailListener.next(response.email)
            },
            err => {
                console.log(err);
            })
    }

    getUserFromTokenStatus(){
        return this.userEmailListener.asObservable()
    }

    saveUserData(userData: string){
        
        localStorage.setItem('userEmail', JSON.stringify(userData));
    }

    deleteUserData(){
        localStorage.removeItem('userEmail')
    }

    getUserData(){
        const UserData = localStorage.getItem('userEmail')
        return JSON.parse(UserData);
    }

    getAlbunsPreview(user:string){
        this.http.get<{albuns: any}>(this.utilStrings.getAlbunsPreviewPath() + user)
        .pipe( map(albunsInfo =>{
            return {albunsData: albunsInfo.albuns.map(album=>{
                return {
                    albumId: album.albumId,
                    name: album.name,
                    path: album.path,
                    date: album.date,
                    description: album.description,
                    imgUrl: album.imgUrl ,
                    musicsUrls: album.musicsUrls,
                    hasAccess: album.hasAccess
                }
            })}
        }))   
        .subscribe(transformedAlbunsData =>{
            console.log(transformedAlbunsData);
            this.deleteAlbunsInfo();
            this.albunsInfo = transformedAlbunsData.albunsData;
            this.albunsInfoListener.next(this.albunsInfo);
            this.saveAlbunsInfo(this.albunsInfo);
            return
        },
        err => {
            console.log(err)
    })
    }

    getAlbunsInfoListener(){
        return this.albunsInfoListener.asObservable();
    }

    saveAlbunsInfo(albunsInfo: AlbumData[]){
        
        localStorage.setItem('albunsInfo', JSON.stringify(albunsInfo));
    }

    deleteAlbunsInfo(){
        localStorage.removeItem('albunsInfo')
    }
    getAlbunsInfo(){
        const albunsInfo = localStorage.getItem('albunsInfo')
        return JSON.parse(albunsInfo);
    }

    getAccessToAlbum(albumId:number, user:string){
        this.http.post(this.utilStrings.postGetAccessToAlbumPath(), {albumId:albumId, user:user})
            .subscribe(response => {
                console.log(response)
                this.albumAccessListener.next(true)

            },
            err => {
                console.log(err)
                this.albumAccessListener.next(false)
            })
    }

    getAlbumAccessListener(){
        return this.albumAccessListener.asObservable()
    }



}