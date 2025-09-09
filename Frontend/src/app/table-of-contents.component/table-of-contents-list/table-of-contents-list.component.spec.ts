import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TableOfContentsListComponent} from './table-of-contents-list.component';

describe('TableOfContentsListComponent', () => {
  let component: TableOfContentsListComponent;
  let fixture: ComponentFixture<TableOfContentsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableOfContentsListComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TableOfContentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
