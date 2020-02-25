import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import{MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { NgForm} from '@angular/forms';

import{AdminZoneService} from '../../admin-zone.service'
import{EditUser} from './edit-user.model'
import { Subscription } from 'rxjs';

@Component({
  selector: 'admin-zone-dialog-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

  @ViewChild('editUserForm', {static: false}) editUserForm: NgForm
  
  public isLoading = false;
  public selectRadio = ""
  private editUserSuccessListenerSubs: Subscription

  constructor(
    public dialogRef: MatDialogRef<EditUserComponent>,
    private adminZoneService: AdminZoneService, 
    @Inject(MAT_DIALOG_DATA) public data: EditUser
  ) { 
  }

  ngOnInit() {
    
    this.selectRadio = this.data.role;
  }
  exitEditUserDialog(){
    this.dialogRef.close()
  }

  submitEditUserForm(editUserForm: NgForm){
   ;
    const roleToUpdate = editUserForm.form.value['radio'];
    this.isLoading = true;
    this.adminZoneService.updateUserType(this.data.email, roleToUpdate )
    this.editUserSuccessListenerSubs=   this.adminZoneService.getUpdateUserStatus()
      .subscribe(success => {
        if(success){
          this.isLoading = false
          console.log(success)
          this.exitEditUserDialog()
        }
      },
      err => {
        this.isLoading = false
        console.log(err)
        this.exitEditUserDialog()

      })
  }

}
