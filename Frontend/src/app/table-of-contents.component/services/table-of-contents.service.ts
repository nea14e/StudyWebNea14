import {Injectable} from '@angular/core';
import {firstValueFrom, of} from 'rxjs';
import {tableOfContents, TableOfContentsItem} from '../data/table-of-contents';
import {DbTaskExampleListItem} from '../../db-task-runner/models/db-task-example-list-item';

@Injectable({
  providedIn: 'root'
})
export class TableOfContentsService {

  async getEntireList(dbExamples: DbTaskExampleListItem[]) {
    let list = await firstValueFrom(of(tableOfContents));
    list = JSON.parse(JSON.stringify(list));  // Не изменяем изначальный список tableOfContents
    const examplesList = this.dbExamplesToItems(dbExamples);
    list.push(...examplesList);
    return JSON.parse(JSON.stringify(list)) as TableOfContentsItem[];  // Не изменяем список dbExamples
  }

  async applyFilter(query: string, dbExamples: DbTaskExampleListItem[]) {
    const entireList = await this.getEntireList(dbExamples);
    const clonedList = JSON.parse(JSON.stringify(entireList)) as TableOfContentsItem[];

    // noinspection UnnecessaryLocalVariableJS
    const searchedList = clonedList.map(item => this.applyFilterToItem(query, item))
      .filter(item => item !== undefined);

    return searchedList;
  }

  private dbExamplesToItems(dbExamples: DbTaskExampleListItem[]) {
    const items = dbExamples.map(example => {
      return {
        id: example.key,
        path: '/db-task-runner',
        queryParams: {example: example.key},
        title: example.title,
        description: example.descriptionHtml
      } as TableOfContentsItem;
    });
    console.log('examples to items:', items);
    return items;
  }

  private applyFilterToItem(query: string, item: TableOfContentsItem) {
    if (!query) {
      return item;
    }

    const queryWords = query.split(/[^A-Za-zА-Яа-я0-9]+/)
      .map(queryWord => queryWord.toUpperCase())
      .filter(queryWord => !!queryWord);
    console.log('applyFilter(): queryWords:', queryWords);

    const itemWords = (item.title + '\n' + item.description).split(/[^A-Za-zА-Яа-я0-9]+/)
      .map(itemWord => itemWord.toUpperCase())
      .filter(itemWord => !!itemWord);
    console.log('applyFilter(): itemWords:', itemWords);

    const hasAllWords = queryWords.every(queryWord => {
      return itemWords.some(itemWord => itemWord.startsWith(queryWord));
    })
    item.childes = !!item.childes
      ? item.childes
        .map(child => this.applyFilterToItem(query, child))
        .filter(child => !!child)
      : undefined;
    const hasPassingChild = !!item.childes && item.childes.length > 0;
    if (!hasAllWords && !hasPassingChild) {
      return undefined;
    }

    const highlightWord = (text: string, queryWord: string) => {
      return text?.replace(
        new RegExp(queryWord, 'ig'),
        (substring) => `<span class="highlighted-text">${substring}</span>`
      );
    };
    for (const queryWord of queryWords) {
      item.title = highlightWord(item.title, queryWord);
      item.description = highlightWord(item.description, queryWord);
    }

    if (hasPassingChild) {
      item.isExpanded = true;  // Автоматически раскрывать группы, внутри у которых есть результаты поиска
    }

    return item;
  }
}
