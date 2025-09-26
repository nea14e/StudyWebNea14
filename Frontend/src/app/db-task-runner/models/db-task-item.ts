import {DbTaskItemState} from './db-task-item-state';
import {DbTaskItemType} from './db-task-item-type';

export interface DbTaskItem {
  sql: string;
  frontendHtml: string;
  type: DbTaskItemType;
  state: DbTaskItemState;
  exceptionMessage: string | null;
  result: (object | null)[][] | null;
}
