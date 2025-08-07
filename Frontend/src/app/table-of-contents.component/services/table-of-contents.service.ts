import {Injectable} from '@angular/core';
import {firstValueFrom, of} from 'rxjs';
import {tableOfContents, TableOfContentsItem} from '../data/table-of-contents';

@Injectable({
  providedIn: 'root'
})
export class TableOfContentsService {

  async getEntireList() {
    const list = await firstValueFrom(of(tableOfContents));
    return JSON.parse(JSON.stringify(list)) as TableOfContentsItem[];
  }

  async applyFilter(query: string) {
    const entireList = await this.getEntireList();
    const clonedList = JSON.parse(JSON.stringify(entireList)) as TableOfContentsItem[];

    // noinspection UnnecessaryLocalVariableJS
    const searchedList = clonedList.map(item => {
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

      const willPass = queryWords.every(queryWord => {
        return itemWords.some(itemWord => itemWord.startsWith(queryWord));
      })
      if (!willPass) {
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

      return item;
    })
      .filter(item => item !== undefined);

    return searchedList;
  }
}
