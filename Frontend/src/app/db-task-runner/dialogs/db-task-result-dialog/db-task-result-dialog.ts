import {Component, ElementRef, inject, OnInit, Renderer2, ViewChild} from '@angular/core';
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
  renderer = inject(Renderer2);
  helper = inject(DbTaskResultHelper);

  @ViewChild('resultView', {static: true})
  resultView: ElementRef | null = null;

  ngOnInit(): void {
    const resultHtml = this.helper.createInnerContent(this.task, this.renderer);
    if (!this.resultView)
      throw new Error('Не найден родительский элемент в диалоге результата');
    this.renderer.appendChild(this.resultView.nativeElement, resultHtml);
  }
}
