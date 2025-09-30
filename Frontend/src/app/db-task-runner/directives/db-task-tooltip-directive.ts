import {Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {TooltipDirective} from '../../common/tooltip-directive';
import {DbTaskItem} from '../models/db-task-item';
import {DbTaskItemType} from '../models/db-task-item-type';
import {DbTaskItemState} from '../models/db-task-item-state';

@Directive({
  selector: '[db-task-tooltip]'
})
export class DbTaskTooltipDirective extends TooltipDirective {
  @Input('db-task-tooltip')
  task: DbTaskItem | null = null;

  constructor(el: ElementRef, renderer: Renderer2) {
    super(el, renderer);
  }

  protected override createInnerContent(): any {
    if (!this.task)
      return null;

    const containerEl = this.renderer.createElement('div');
    this.renderer.addClass(containerEl, 'container-fluid');

    this.createStateInfo(containerEl);
    this.createResultInfo(containerEl);

    return containerEl;
  }

  private createStateInfo(containerEl: any) {
    const stateRow = this.renderer.createElement('div');
    this.renderer.addClass(stateRow, 'row');
    {
      const state = this.getState();
      const stateEl = this.renderer.createText(state);
      this.renderer.appendChild(stateRow, stateEl);
    }
    this.renderer.appendChild(containerEl, stateRow);
  }

  private getState() {
    if (!this.task)
      throw new Error("task is null");

    switch (this.task.state) {
      case DbTaskItemState.NotStarted:
        return 'Ещё не начато';
      case DbTaskItemState.Running:
        return 'Выполняется';
      case DbTaskItemState.Completed:
        return 'Успешно завершено';
      case DbTaskItemState.Error:
        return 'Ошибка: ' + this.task.exceptionMessage;
    }
  }

  private createResultInfo(containerEl: any) {
    if (!this.task)
      throw new Error("task is null");

    if (this.task.state === DbTaskItemState.Completed && this.task.result !== null) {
      const resultRow = this.renderer.createElement('div');
      this.renderer.addClass(resultRow, 'row');
      if (this.task.type === DbTaskItemType.Scalar) {
        const scalarValue = this.task.result[0][0];
        const scalarValueEl = this.renderer.createText(scalarValue?.toString() ?? 'null');
        this.renderer.appendChild(resultRow, scalarValueEl);
      } else if (this.task.type === DbTaskItemType.Table) {
        const table = this.renderer.createElement('table');
        this.renderer.addClass(table, 'table');
        this.renderer.addClass(table, 'table-bordered');
        this.renderer.addClass(table, 'table-striped');
        this.renderer.addClass(table, 'table-hover');
        {
          const tbody = this.renderer.createElement('tbody');
          {
            for (let i = 0; i < this.task.result.length; i++) {
              const tr = this.renderer.createElement('tr');
              for (let j = 0; j < this.task.result[i].length; j++) {
                const td = this.renderer.createElement('td');
                {
                  const value = this.task.result[i][j]?.toString() ?? 'null';
                  const valueEl = this.renderer.createText(value);
                  this.renderer.appendChild(td, valueEl);
                }
                this.renderer.appendChild(tr, td);
              }
              this.renderer.appendChild(tbody, tr);
            }
          }
          this.renderer.appendChild(table, tbody);
        }
        this.renderer.appendChild(resultRow, table);
      } else {
        const stubEl = this.renderer.createText('Данный тип задач не возвращает значение.');
        this.renderer.appendChild(resultRow, stubEl);
      }
      this.renderer.appendChild(containerEl, resultRow);
    }
  }
}
