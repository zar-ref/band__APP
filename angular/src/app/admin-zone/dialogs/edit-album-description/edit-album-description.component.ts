import { Component, OnInit, Inject  } from '@angular/core';
import{EditDescription} from './edit-album-description.model';
import{MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import{AdminZoneService} from '../../admin-zone.service'

@Component({
  selector: 'app-edit-album-description',
  templateUrl: './edit-album-description.component.html',
  styleUrls: ['./edit-album-description.component.scss']
})
export class EditAlbumDescriptionComponent implements OnInit {

  public isLoading = false;
  public oldDescription: string = ""
  public newDescription = "";

  constructor(
    public dialogRef: MatDialogRef<EditAlbumDescriptionComponent>,
    private adminZoneService: AdminZoneService, 
    @Inject(MAT_DIALOG_DATA) public data: EditDescription
  ) { }

  ngOnInit() {
    this.oldDescription = this.data.albumDescription;
    console.log(this.data);
  }


  exitEditAlbumDescription(){
    this.dialogRef.close()
  }

  handleNewDescriptionInput(newDescription: string){
    this.newDescription = newDescription;
    console.log(this.newDescription);
  }

  changeAlbumDescription(albumId: number){
    console.log(albumId);
    this.adminZoneService.updateAlbumDescription(albumId, this.newDescription);
  }


}
