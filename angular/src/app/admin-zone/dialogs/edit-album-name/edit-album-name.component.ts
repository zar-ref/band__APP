import { Component, OnInit, Inject  } from '@angular/core';
import{EditName} from './edit-name.model';
import{MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import{AdminZoneService} from '../../admin-zone.service'
@Component({
  selector: 'app-edit-album-name',
  templateUrl: './edit-album-name.component.html',
  styleUrls: ['./edit-album-name.component.scss']
})
export class EditAlbumNameComponent implements OnInit {

  public isLoading = false;
  public oldName: string = ""
  public newName = "";

  constructor(
    public dialogRef: MatDialogRef<EditAlbumNameComponent>,
    private adminZoneService: AdminZoneService, 
    @Inject(MAT_DIALOG_DATA) public data: EditName
  ) { }

  ngOnInit() {

   
    this.newName = this.data.albumName
  }

  exitEditAlbumName(){
    this.dialogRef.close()
  }

  handleNewNameInput(newName: string){
    this.newName = newName;
    console.log(this.newName);
  }

  changeAlbumName(albumId: number){
    this.adminZoneService.updateAlbumName(albumId, this.newName);
  }

}
