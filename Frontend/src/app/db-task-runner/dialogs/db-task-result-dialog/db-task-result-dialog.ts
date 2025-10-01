import {Component, inject, OnInit} from '@angular/core';
import {DbTaskResultHelper} from '../../helpers/db-task-result-helper';
import {DbTaskItem} from '../../models/db-task-item';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-db-task-result-dialog',
  imports: [],
  templateUrl: './db-task-result-dialog.html',
  styleUrl: './db-task-result-dialog.css'
})
export class DbTaskResultDialog implements OnInit {
  dialogRef = inject(MatDialogRef<DbTaskResultDialog>);
  task = inject<DbTaskItem>(MAT_DIALOG_DATA);

  helper = inject(DbTaskResultHelper);

  ngOnInit(): void {

  }

}
