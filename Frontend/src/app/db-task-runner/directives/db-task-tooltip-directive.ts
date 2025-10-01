import {Directive, ElementRef, Input, Renderer2} from '@angular/core';
import {TooltipDirective} from '../../common/tooltip-directive';
import {DbTaskItem} from '../models/db-task-item';
import {DbTaskResultHelper} from '../helpers/db-task-result-helper';

@Directive({
  selector: '[db-task-tooltip]'
})
export class DbTaskTooltipDirective extends TooltipDirective {
  @Input('db-task-tooltip')
  task: DbTaskItem | null = null;

  constructor(el: ElementRef, renderer: Renderer2, private resultHelper: DbTaskResultHelper) {
    super(el, renderer);
  }

  protected override createInnerContent(): any {
    if (!this.task)
      return null;

    return this.resultHelper.createInnerContent(this.task, this.renderer);
  }
}
