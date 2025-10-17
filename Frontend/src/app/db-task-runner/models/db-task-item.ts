import {DbTaskItemState} from './db-task-item-state';
import {DbTaskItemType} from './db-task-item-type';
import {Guid} from 'guid-typescript';

export interface DbTaskItem {
  id: Guid;
  sql: string | null;
  frontendHtml: string | null;
  type: DbTaskItemType;
  state: DbTaskItemState;
  exceptionMessage: string | null;
  result: (object | null)[][] | null;
  processStartTime: string | null;
  startTime: string | null;
  endTime: string | null;
}
