import { Component, OnInit, Inject } from '@angular/core';
import{MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import{AdminZoneService} from '../../admin-zone.service'
import {EditImage} from './edit-image.model'

interface AlbumPicture {	
  filename: string;
  file: File;
}


@Component({
  selector: 'app-edit-album-image',
  templateUrl: './edit-album-image.component.html',
  styleUrls: ['./edit-album-image.component.scss']
})
export class EditAlbumImageComponent implements OnInit {


  public isLoading = false;
  public flagCorrectForm = true
  public error = "";
  public newImage: AlbumPicture = null
  private imageTypes = ['jpeg', 'png'];

  constructor(
    public dialogRef: MatDialogRef<EditAlbumImageComponent>,
    private adminZoneService: AdminZoneService, 
    @Inject(MAT_DIALOG_DATA) public data: EditImage
  ) { }

  ngOnInit() {
    console.log(this.data);
  }

  exitEditAlbumImage(){
    this.newImage = null
    this.dialogRef.close()

  }

  handleNewAlbumPictureInput(files: FileList){ 
    this.newImage = {
      file: files.item(0),
      filename: files.item(0).name
    }
    
    
  }

  changeAlbumPicture(albumId: number){
    if(this.newImage == null) {
      this.flagCorrectForm = false
      this.error="Falta submeter uma imagem";
      setTimeout(()=>{this.flagCorrectForm=true}, 3000);
      return
    }
    if(!this.imageTypes.includes( this.newImage.file.type.split('/')[1]) ){
      this.flagCorrectForm = false
      this.error="O ficheiro não é suportado";
      setTimeout(()=>{this.flagCorrectForm=true}, 3000);
      return
    }
    if( this.newImage.filename === this.data.albumImageUrl){
      this.flagCorrectForm = false
      this.error="O ficheiro tem o mesmo nome";
      setTimeout(()=>{this.flagCorrectForm=true}, 3000);
      return
    }
    if(this.data.albumImageUrl !== ""){
      this.adminZoneService.deleteImage(albumId, this.data.albumImageUrl);
    
    }
    this.adminZoneService.uploadImage(this.newImage.file, albumId.toString());



  }


}
