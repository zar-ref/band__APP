import { Component, OnInit, Inject  } from '@angular/core';
import{DeleteAlbum} from './delete-album.model';
import{MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import{AdminZoneService} from '../../admin-zone.service'


@Component({
  selector: 'app-delete-album',
  templateUrl: './delete-album.component.html',
  styleUrls: ['./delete-album.component.scss']
})
export class DeleteAlbumComponent implements OnInit {

  public isLoading = false;

  constructor(
    public dialogRef: MatDialogRef<DeleteAlbumComponent>,
    private adminZoneService: AdminZoneService, 
    @Inject(MAT_DIALOG_DATA) public data: DeleteAlbum
  ) { }

  ngOnInit() {

  }

  exitDeleteAlbum(){
    this.dialogRef.close()
  }

  deleteAlbum(albumId: number){
    console.log(albumId)
    this.adminZoneService.deleteAlbum(albumId);
  }

}
