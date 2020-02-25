import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import{MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';

import{AdminZoneService} from '../../admin-zone.service'
import{DeleteUser} from './delete-user.model'
import { Subscription } from 'rxjs';


@Component({
  selector: 'admin-zone-dialog-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent implements OnInit {

  public isLoading = false;
  private deleteUserSuccessListenerSubs: Subscription

  constructor(
    public dialogRef: MatDialogRef<DeleteUserComponent>,
    private adminZoneService: AdminZoneService, 
    @Inject(MAT_DIALOG_DATA) public data: DeleteUser
  ) { 
  }

  ngOnInit() {

  }

  exitDeleteUserDialog(){
    this.dialogRef.close()
  }

  deleteUser(email:string){
    this.isLoading=true;
    this.adminZoneService.deleteUser(email)
    this.deleteUserSuccessListenerSubs = this.adminZoneService.getDeleteUserStatus()
      .subscribe(success =>{
        if(success) {
          this.isLoading = false
          this.exitDeleteUserDialog()
        }
      },
      err=> {
        console.log(err);
        this.isLoading = false
        this.exitDeleteUserDialog()
      })
    
  }

}
