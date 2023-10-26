import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManageUserService } from '../../services/manage-user.service';
import { DeleteUserRequest } from '../../entity/delete-user-request';
import { finalize } from 'rxjs';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.scss']
})
export class DeleteUserComponent {
  deleteUserForm: FormGroup
  loading = false

  constructor(private formBuilder: FormBuilder, private manageUser: ManageUserService,
    private messageService: MessageService){
    this.deleteUserForm = this.formBuilder.group({
      username: ['',[Validators.required]]
    })
  }

  deleteUser(){
    this.deleteUserForm.disable()
    this.loading = true
    this.manageUser.deleteUser(this.deleteUserForm.value as DeleteUserRequest)
    .pipe(finalize(()=>{
      this.loading = false
      this.deleteUserForm.enable()
    }))
    .subscribe({
      next: (_)=>{
        this.messageService.add({
          severity: "success",
          summary: "Usuario eliminado"
        })
      },
      error: (e: HttpErrorResponse) =>{
        if(e.status === 404){
          this.messageService.add({
            severity: "error",
            summary: "El usuario no existe"
          })
        }else{
          this.messageService.add({
            severity: "error",
            summary: e.message
          })
        }
      }
    })
  }
}
