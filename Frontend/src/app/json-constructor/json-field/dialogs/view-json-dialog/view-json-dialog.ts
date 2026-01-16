import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-view-json-dialog',
  imports: [
    FormsModule
  ],
  templateUrl: './view-json-dialog.html',
  styleUrl: './view-json-dialog.css'
})
export class ViewJsonDialog {
  dialogRef = inject(MatDialogRef<ViewJsonDialog>);
  data = inject<string>(MAT_DIALOG_DATA);

  onCloseDialog() {
    this.dialogRef.close();
  }
}
