import {Injectable} from '@angular/core';
import {firstValueFrom, of} from 'rxjs';
import {tableOfContents, TableOfContentsItem} from '../data/table-of-contents';

@Injectable({
  providedIn: 'root'
})
export class TableOfContentsService {

  async getEntireList() {
    const list = await firstValueFrom(of(tableOfContents));
    const clonedList = JSON.parse(JSON.stringify(list)) as TableOfContentsItem[];
    return clonedList.map(item => {
      item.title = `<span><!--<span class="one-lined-text">-->${item.title}</span>`;
      item.description = `<span><!--<span class="one-lined-text">-->${item.description}</span>`;
      return item;
    });
  }

  async applyFilter(query: string) {
    const entireList = await this.getEntireList();
    const clonedList = JSON.parse(JSON.stringify(entireList)) as TableOfContentsItem[];

    // noinspection UnnecessaryLocalVariableJS
    const searchedList = clonedList.map(item => {
      if (!query) {
        return item;
      }

      const queryWords = query.split(/\s+/)
        .map(queryWord => queryWord.toUpperCase());
      const itemWords = (item.title + '\n' + item.description).split(/[\b\s]+/)
        .map(itemWord => itemWord.toUpperCase());

      const willPass = itemWords.some(itemWord => {
        return queryWords.some(queryWord => itemWord.startsWith(queryWord));
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
