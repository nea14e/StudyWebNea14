import {Component, OnInit} from '@angular/core';
import {tableOfContents} from './data/table-of-contents';

@Component({
  selector: 'app-table-of-contents',
  imports: [],
  templateUrl: './table-of-contents.component.html',
  styleUrl: './table-of-contents.component.css'
})
export class TableOfContentsComponent implements OnInit {
  listItems = tableOfContents;

  ngOnInit() {
  }
}
