import {DbTaskSnippet} from './db-task-snippet';

export interface DbTaskExample {
  key: string;
  descriptionHtml: string;
  snippets: DbTaskSnippet[];
}
