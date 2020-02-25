import { Injectable, Pipe, PipeTransform  } from '@angular/core';

@Injectable({providedIn: "root"})
export class UtilStringsService {


    private angularPath = 'http://localhost:4200/';
    getAngularPath(){
        return this.angularPath;
    }

    ////SITE PATH
    private sitePath = 'http://localhost:8080'//';///3000  , //'http://localhost:8080'http://151.236.38.223:8080
    
    getSitePath(){
        return this.sitePath;
    }
    
    ////USER PATHS 
    private userPath = this.sitePath + '/api/user/';
    private loginPath = this.userPath + 'login';
    private signUpPath = this.userPath + 'signup';
    private confirmationPath = this.userPath + 'confirmation'

    

    getUserPath(){
        return this.userPath;
    }

    getLoginPath() {
        return this.loginPath;
    }

    getSignUpPath(){
        return this.signUpPath;
    }

    getConfirmationPath(){
        return this.confirmationPath;
    }

    ///ADMIN ZONE PATHS -- USERS
    private adminZonePath = this.sitePath + '/api/admin-zone/';
    private adminUsersPath = this.adminZonePath + 'users';
    private adminUpdateUserTypePath = this.adminZonePath + 'update-user-type';
    private adminDeleteUserPath = this.adminZonePath + 'delete-user';

    getAdminZonePath(){
        return this.adminZonePath;
    }

    getAdminZoneUsersPath(){
        return this.adminUsersPath;
    }
    getAdminZoneUpdateUserTypePath(){
        return this.adminUpdateUserTypePath;
    }
    
    getAdminZoneDeleteUserPath(){
        return this.adminDeleteUserPath;
    }

    //ADMIN ZONE PATHS -- ALBUNS
    private backendAlbunsPath = this.adminZonePath + 'albuns';
    private albunsMaxIdPath = this.adminZonePath + 'get-album-max-id'
    private createNewAlbumPath = this.adminZonePath +'create-new-album'
    private musicUploadPath = this.adminZonePath + 'upload-music';
    private imageUploadPath = this.adminZonePath + 'upload-image';
    private deleteMusicPath = this.adminZonePath + 'delete-music';
    private deleteAlbumPicture = this.adminZonePath + 'delete-album-picture';
    private downloadMusicPath = this.adminZonePath + 'download-music';
    private updateAlbumDescriptionPath = this.adminZonePath + 'update-album-description'
    private updateAlbumNamePath = this.adminZonePath + 'update-album-name'
    private deleteAlbumPath = this.adminZonePath + 'delete-album';
    


    getBackendAlbunsPath(){
        return this.backendAlbunsPath;
    }

    getAlbunsMaxIdPath(){
        return this.albunsMaxIdPath;
    }

    getCreateNewAlbumPath(){
        return this.createNewAlbumPath;
    }

    getMusicUploadPath(){
        return this.musicUploadPath;
    }

    getImageUploadPath(){
        return this.imageUploadPath
    }

    getDeleteMusicPath(){
        return this.deleteMusicPath
    }

    getDeleteAlbumPicturePath(){
        return this.deleteAlbumPicture
    }

    getDownloadMusicPath(){
        return this.downloadMusicPath;
    }

    getUpdateAlbumDescriptionPath(){
        return this.updateAlbumDescriptionPath
    }

    getUpdateAlbumNamePath(){
        return this.updateAlbumNamePath;
    }

    getDeleteAlbumPath(){
        return this.deleteAlbumPath;
    }





    ////////////////////FAN ZONE PATHS

    private fanZonePath = this.sitePath + '/api/fan-zone/';
    private userEmailFromTokenPath = this.fanZonePath + 'get-user-email/';
    private albunsPreviewPath = this.fanZonePath + 'get-albuns-preview/';
    private getAccessToAlbumPath = this.fanZonePath +  'post-access-to-album';

    getUserEmailFromTokenPath(){
        return this.userEmailFromTokenPath;
    }

    getAlbunsPreviewPath (){
        return this.albunsPreviewPath;
    }

    postGetAccessToAlbumPath(){
        return this.getAccessToAlbumPath;
    }
    
}


