import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/input';
import {Component, inject, OnDestroy} from '@angular/core';
import {DbTaskRunnerService} from './services/db-task-runner.service';
import {Guid} from 'guid-typescript';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import {DbTaskExample} from './models/db-task-example';
import {getIndicesList, maxInList} from '../common/list-helper';
import {getPlainTextFromHtml} from '../common/text-helper';
import {CdkCopyToClipboard} from '@angular/cdk/clipboard';
import {DbTaskItemState} from './models/db-task-item-state';
import {Subscription, switchMap, timer} from 'rxjs';

@Component({
  selector: 'app-db-task-runner',
  imports: [
    FormsModule,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    MatSelectModule,
    CdkCopyToClipboard,
  ],
  templateUrl: './db-task-runner.component.html',
  styleUrl: './db-task-runner.component.css'
})
export class DbTaskRunnerComponent implements OnDestroy {
  example?: DbTaskExample;
  protected service = inject(DbTaskRunnerService);
  protected instanceId = Guid.create();
  protected updateProgressSubscription?: Subscription;

  protected readonly DbTaskItemState = DbTaskItemState;

  async onExampleChanged($event: MatSelectChange<string>) {
    const exampleKey = $event.value;
    await this.service.loadExample(this.instanceId, exampleKey);
    this.example = await this.service.getProgress(this.instanceId);
    console.log('new example:', this.example);  // TODO
  }

  getProcessIndices(snippetIndex: number) {
    const snippet = this.example!.snippets[snippetIndex];
    const count = snippet.processes.length;
    return getIndicesList(count)
  }

  getProcessByIndex(snippetIndex: number, processIndex: number) {
    const snippet = this.example!.snippets[snippetIndex];
    return snippet.processes[processIndex];
  }

  getTaskIndices(snippetIndex: number) {
    const snippet = this.example!.snippets[snippetIndex];
    const maxLength = maxInList(snippet.processes.map(proc => proc.taskItems.length));
    return getIndicesList(maxLength);
  }

  getTaskByIndices(snippetIndex: number, processIndex: number, taskIndex: number) {
    const snippet = this.example!.snippets[snippetIndex];
    return snippet.processes[processIndex].taskItems[taskIndex];
  }

  getCodeToCopy(snippetIndex: number, processIndex: number) {
    const snippet = this.example!.snippets[snippetIndex];
    const process = snippet.processes[processIndex];
    return process.taskItems.map(item => item.frontendHtml)
      .map(html => getPlainTextFromHtml(html))
      .join('\n\n');
  }

  async runSnippet(snippetIndex: number) {
    const snippet = this.example!.snippets[snippetIndex];
    await this.service.runSnippet(this.instanceId, snippet.key);
    if (!!this.updateProgressSubscription) {
      this.updateProgressSubscription.unsubscribe();
    }
    this.updateProgressSubscription = timer(1000, 1000)
      .pipe(
        switchMap(_ => this.service.getProgress(this.instanceId)),
      )
      .subscribe(data => {
        this.example = data;
      });
  }

  ngOnDestroy(): void {
    if (!!this.updateProgressSubscription) {
      this.updateProgressSubscription.unsubscribe();
    }
  }

  isRunning() {
    return this.example?.runningSnippet !== null;
  }
}
