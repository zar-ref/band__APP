import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {ReactiveFormsModule ,FormsModule} from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'

//Componentes
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { FanZoneComponent } from './fan-zone/fan-zone.component';
import { AdminZoneComponent } from './admin-zone/admin-zone.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ConfirmationComponent } from './auth/confirmation/confirmation.component';
import { EditUserComponent } from './admin-zone/dialogs/edit-user/edit-user.component';
import { DeleteUserComponent } from './admin-zone/dialogs/delete-user/delete-user.component';

//Pipes
import {aspasOut} from './aspas.pipe' ;
import {fileTypeOut} from './music-filename-splitter.pipe'
//Angular material
import {MatInputModule, MatCardModule, MatButtonModule, MatToolbarModule, MatExpansionModule, MatProgressSpinnerModule, MatPaginatorModule, MatTableModule, MatTooltipModule, MatDialogModule,   MatRadioModule, MatSelectModule} from '@angular/material';
import { DeleteMusicComponent } from './admin-zone/dialogs/delete-music/delete-music.component';
import { AddMusicToAlbumComponent } from './admin-zone/dialogs/add-music-to-album/add-music-to-album.component';
import { EditAlbumImageComponent } from './admin-zone/dialogs/edit-album-image/edit-album-image.component';
import { EditAlbumDescriptionComponent } from './admin-zone/dialogs/edit-album-description/edit-album-description.component';
import { DeleteAlbumComponent } from './admin-zone/dialogs/delete-album/delete-album.component';
import { EditAlbumNameComponent } from './admin-zone/dialogs/edit-album-name/edit-album-name.component';
//ng2-file-upload

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    MainComponent,
    FanZoneComponent,
    AdminZoneComponent,
    SignupComponent,
    aspasOut,
    fileTypeOut,
    ConfirmationComponent,
    EditUserComponent,
    DeleteUserComponent,
    DeleteMusicComponent,
    AddMusicToAlbumComponent,
    EditAlbumImageComponent,
    EditAlbumDescriptionComponent,
    DeleteAlbumComponent,
    EditAlbumNameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTableModule,
    MatTooltipModule,
    MatDialogModule,
    MatRadioModule,
    MatSelectModule,
    HttpClientModule
  ],
  entryComponents: [
    EditUserComponent,
    DeleteUserComponent,
    DeleteMusicComponent,
    AddMusicToAlbumComponent,
    EditAlbumImageComponent,
    EditAlbumDescriptionComponent,
    DeleteAlbumComponent,
    EditAlbumNameComponent
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]

})
export class AppModule { }
