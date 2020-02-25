import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import{MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import {DeleteMusic} from './delete-music.model'

import{AdminZoneService} from '../../admin-zone.service'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-delete-music',
  templateUrl: './delete-music.component.html',
  styleUrls: ['./delete-music.component.scss']
})
export class DeleteMusicComponent implements OnInit {

  public isLoading = false;
  private deleteMusicSuccessListenerSubs: Subscription
  constructor(
    public dialogRef: MatDialogRef<DeleteMusicComponent>,
    private adminZoneService: AdminZoneService, 
    @Inject(MAT_DIALOG_DATA) public data: DeleteMusic
  ) { }

  ngOnInit() {
  }


  exitDeleteMusicDialog(){
    this.dialogRef.close()
  }

  deleteMusic(albumId: number, musicToDelete: string){
    this.isLoading = true
    this.adminZoneService.deleteMusic(albumId, musicToDelete);
    this.deleteMusicSuccessListenerSubs = this.adminZoneService.getDeleteMusicSuceessListener()
      .subscribe(success => {
        if(success){
          this.isLoading= false
          this.exitDeleteMusicDialog()
        }
      }, 
      err => {
        console.log(err)
        this.isLoading = false
        this.exitDeleteMusicDialog();
      })

  }

}
