import {Injectable} from '@angular/core';
import {filter, map} from 'rxjs';
import {tableOfContents} from '../data/table-of-contents';
import {fromArrayLike} from 'rxjs/internal/observable/innerFrom';

@Injectable({
  providedIn: 'root'
})
export class TableOfContentsService {

  getEntireList() {
    return fromArrayLike(tableOfContents);
  }

  applyFilter(query: string) {
    return this.getEntireList()
      .pipe(
        map((item, _) => {
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
              new RegExp('\b' + queryWord, 'i'),
              (substring) => '<span class="highlighted-text">' + substring + '</span>'
            );
          };
          queryWords.forEach(queryWord => {
            item.title = highlightWord(item.title, queryWord);
            item.description = highlightWord(item.description, queryWord);
          });

          return item;
        }),
        filter(item => item !== undefined)
      )
  }
}
