import {Injectable, Renderer2} from '@angular/core';
import {DbTaskItem} from '../models/db-task-item';
import {DbTaskItemState} from '../models/db-task-item-state';
import {DbTaskItemType} from '../models/db-task-item-type';
import {CacheHelper} from '../../common/cache-helper';

@Injectable({
  providedIn: 'root'
})
export class DbTaskResultHelper {
  CACHE_REFRESH_INTERVAL = 1000;
  cacheHelper = new CacheHelper<any>();

  createInnerContent(task: DbTaskItem, renderer: Renderer2): any {
    const cachedResult = this.cacheHelper.tryGetValue();
    if (!!cachedResult) {
      return cachedResult;
    }

    const containerEl = renderer.createElement('div');
    renderer.addClass(containerEl, 'container-fluid');

    this.createStateInfo(task, renderer, containerEl);
    this.createResultInfo(task, renderer, containerEl);

    this.cacheHelper.setValue(containerEl, this.CACHE_REFRESH_INTERVAL);
    return containerEl;
  }

  private createStateInfo(task: DbTaskItem, renderer: Renderer2, containerEl: any) {
    const stateRow = renderer.createElement('div');
    renderer.addClass(stateRow, 'row');
    {
      const state = this.getState(task);
      const stateEl = renderer.createText(state);
      renderer.appendChild(stateRow, stateEl);
    }
    renderer.appendChild(containerEl, stateRow);
  }

  private getState(task: DbTaskItem) {
    switch (task.state) {
      case DbTaskItemState.NotStarted:
        return 'Ещё не начато';
      case DbTaskItemState.Running:
        return 'Выполняется';
      case DbTaskItemState.Completed:
        return 'Успешно завершено';
      case DbTaskItemState.Error:
        return 'Ошибка: ' + task.exceptionMessage;
    }
  }

  private createResultInfo(task: DbTaskItem, renderer: Renderer2, containerEl: any) {
    if (task.state === DbTaskItemState.Completed && task.result !== null) {
      const resultRow = renderer.createElement('div');
      renderer.addClass(resultRow, 'row');
      if (task.type === DbTaskItemType.Scalar) {
        const scalarValue = task.result[0][0];
        const scalarValueEl = renderer.createText(scalarValue?.toString() ?? 'null');
        renderer.appendChild(resultRow, scalarValueEl);
      } else if (task.type === DbTaskItemType.Table) {
        const table = renderer.createElement('table');
        renderer.addClass(table, 'table');
        renderer.addClass(table, 'table-bordered');
        renderer.addClass(table, 'table-striped');
        renderer.addClass(table, 'table-hover');
        {
          const tbody = renderer.createElement('tbody');
          {
            for (let i = 0; i < task.result.length; i++) {
              const tr = renderer.createElement('tr');
              for (let j = 0; j < task.result[i].length; j++) {
                const td = renderer.createElement('td');
                {
                  const value = task.result[i][j]?.toString() ?? 'null';
                  const valueEl = renderer.createText(value);
                  renderer.appendChild(td, valueEl);
                }
                renderer.appendChild(tr, td);
              }
              renderer.appendChild(tbody, tr);
            }
          }
          renderer.appendChild(table, tbody);
        }
        renderer.appendChild(resultRow, table);
      } else {
        const stubEl = renderer.createText('Данный тип задач не возвращает значение.');
        renderer.appendChild(resultRow, stubEl);
      }
      renderer.appendChild(containerEl, resultRow);
    }
  }
}
