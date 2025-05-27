import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UpdateClientComponent } from '../update-client/update-client.component';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-delete-client',
  templateUrl: './delete-client.component.html',
  styleUrls: ['./delete-client.component.css']
})
export class DeleteClientComponent implements OnInit {
  constructor(private refDialog:MatDialogRef<UpdateClientComponent>,private formBuilder:FormBuilder){

  }
    ngOnInit(): void {
      
    }
}
