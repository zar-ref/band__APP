import { Component, OnInit, Inject } from '@angular/core';
import{MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import{AdminZoneService} from '../../admin-zone.service'
import {AddMusic} from './add-music.model'

interface Music {
	name: string;
  filename: string;
  file: File;
}


@Component({
  selector: 'app-add-music-to-album',
  templateUrl: './add-music-to-album.component.html',
  styleUrls: ['./add-music-to-album.component.scss']
})



export class AddMusicToAlbumComponent implements OnInit {

  public isLoading = false;
  public flagCorrectForm = true
  public newMusic: Music = null;
  public error = "";
  constructor(
    public dialogRef: MatDialogRef<AddMusicToAlbumComponent>,
    private adminZoneService: AdminZoneService, 
    @Inject(MAT_DIALOG_DATA) public data: AddMusic
  ) { }

  ngOnInit() {
  }

  exitAddMusicToAlbumDialog(){
    this.newMusic = null
    this.dialogRef.close()
  }

  handleMusicInput( files: FileList){
    const musicName = files.item(0).name.split(".")[0];
    this.newMusic = {
        name: musicName,
        filename: files.item(0).name,
        file: files.item(0)
    }
    
}

  addMusicToAlbum(albumId: number){


    if(this.newMusic == null) {
      this.flagCorrectForm = false
      this.error="Falta submeter uma música";
      setTimeout(()=>{this.flagCorrectForm=true}, 3000);
      return
    }
    if(this.newMusic.file.type.split('/')[1] !== "mpeg"){
        this.flagCorrectForm = false
        this.error="O tipo de ficheiro não é suportado";
        setTimeout(()=>{this.flagCorrectForm=true}, 3000);
        return
      }

    if(this.data.musicsInAlbum.includes(this.newMusic.filename)){
      this.flagCorrectForm = false
        this.error="O ficheiro tem o mesmo nome";
        setTimeout(()=>{this.flagCorrectForm=true}, 3000);
        return
    }
    this.adminZoneService.uploadMusic(this.newMusic.file, albumId.toString());
    this.exitAddMusicToAlbumDialog();
  }

}
