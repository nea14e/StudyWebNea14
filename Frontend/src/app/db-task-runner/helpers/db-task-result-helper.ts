import {inject, Injectable, Renderer2} from '@angular/core';
import {DbTaskItem} from '../models/db-task-item';
import {DbTaskItemState} from '../models/db-task-item-state';
import {DbTaskItemType} from '../models/db-task-item-type';
import {CacheHelper} from '../../common/cache-helper';

@Injectable({
  providedIn: 'root'
})
export class DbTaskResultHelper {
  CACHE_REFRESH_INTERVAL = 1000;
  cacheHelper = inject(CacheHelper);

  createInnerContent(task: DbTaskItem, renderer: Renderer2): any {
    const containerEl = renderer.createElement('div');
    renderer.addClass(containerEl, 'container-fluid');

    this.createStateInfo(task, renderer, containerEl);
    this.createTimeInfo(task, renderer, containerEl);
    this.createResultInfo(task, renderer, containerEl);

    return containerEl;
  }

  private createStateInfo(task: DbTaskItem, renderer: Renderer2, containerEl: any) {
    let stateRow = this.cacheHelper.tryGetValue<any>(task.id + '.stateRow');
    if (!!stateRow) {
      renderer.appendChild(containerEl, stateRow);
      return;
    }

    stateRow = renderer.createElement('div');
    renderer.addClass(stateRow, 'row');
    {
      let imgSrc: string;
      let state: string;
      switch (task.state) {
        case DbTaskItemState.NotStarted:
          state = 'Ещё не начато';
          imgSrc = 'from-bootstrap/progress/empty-image.svg';
          break;
        case DbTaskItemState.Running:
          state = 'Выполняется';
          imgSrc = 'from-bootstrap/progress/stopwatch-fill.svg';
          break;
        case DbTaskItemState.Completed:
          state = 'Успешно завершено';
          imgSrc = 'from-bootstrap/progress/check-circle-fill.svg';
          break;
        case DbTaskItemState.Error:
          state = 'Ошибка: ' + task.exceptionMessage;
          imgSrc = 'from-bootstrap/progress/x-octagon-fill.svg';
          break;
      }
      const stateImgCol = renderer.createElement('div');
      renderer.addClass(stateImgCol, 'col-auto');
      renderer.setStyle(stateImgCol, 'padding', '0');
      {
        console.log('src', imgSrc);
        const stateImg = renderer.createElement('img');
        renderer.setAttribute(stateImg, 'src', imgSrc);
        renderer.setStyle(stateImg, 'height', '1rem');
        renderer.setStyle(stateImg, 'margin', '0.3rem');
        renderer.appendChild(stateImgCol, stateImg);
      }
      renderer.appendChild(stateRow, stateImgCol);

      const stateTextCol = renderer.createElement('div');
      renderer.addClass(stateTextCol, 'col');
      renderer.setStyle(stateTextCol, 'padding', '0');
      {
        const stateText = renderer.createText(state);
        renderer.appendChild(stateTextCol, stateText);
      }
      renderer.appendChild(stateRow, stateTextCol);
    }

    this.cacheHelper.setValue(task.id + '.stateRow', stateRow, this.CACHE_REFRESH_INTERVAL);
    renderer.appendChild(containerEl, stateRow);
  }

  private createTimeInfo(task: DbTaskItem, renderer: Renderer2, containerEl: any) {
    if (!task.startTime || !task.processStartTime) {
      return;
    }
    // Не кешируем, чтобы миллисекунды обновлялись быстрее

    const timeRow = renderer.createElement('div');
    renderer.addClass(timeRow, 'row');
    {
      const startTimeCol = renderer.createElement('div');
      renderer.addClass(startTimeCol, 'col');
      renderer.setAttribute(startTimeCol, 'title', 'Время начала');
      {
        const processStartTime = new Date(task.processStartTime).valueOf();
        const startTime = new Date(task.startTime).valueOf();
        const value = (startTime - processStartTime) / 1000;
        const startTimeText = renderer.createText('+' + value + 'сек\t\t');
        renderer.appendChild(startTimeCol, startTimeText);
      }
      renderer.appendChild(timeRow, startTimeCol);
    }
    {
      const durationCol = renderer.createElement('div');
      renderer.addClass(durationCol, 'col');
      renderer.setAttribute(durationCol, 'title', 'Продолжительность');
      {
        const startTime = new Date(task.startTime).valueOf();
        const endTime = task.endTime
          ? new Date(task.endTime).valueOf()
          : Date.now();
        const value = (endTime - startTime) / 1000;
        const durationText = renderer.createText(value + 'сек');
        renderer.appendChild(durationCol, durationText);
      }
      renderer.appendChild(timeRow, durationCol);
    }
    renderer.appendChild(containerEl, timeRow);
  }

  private createResultInfo(task: DbTaskItem, renderer: Renderer2, containerEl: any) {
    if (task.state !== DbTaskItemState.Completed || !task.result) {
      return;
    }
    let resultRow = this.cacheHelper.tryGetValue<any>(task.id + '.resultRow');
    if (!!resultRow) {
      renderer.appendChild(containerEl, resultRow);
      return;
    }

    resultRow = renderer.createElement('div');
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

    this.cacheHelper.setValue(task.id + '.resultRow', resultRow, this.CACHE_REFRESH_INTERVAL);
    renderer.appendChild(containerEl, resultRow);
  }
}
