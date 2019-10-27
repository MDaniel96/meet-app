import { Directive, Input, Renderer } from '@angular/core';

/**
 * Hiding header when scrolling
 */
@Directive({
  selector: '[hide-header]',
  host: {
    '(ionScroll)': 'onContentScroll($event)'
  }
})
export class HideHeaderDirective {

  @Input("header") header: HTMLElement;

  constructor(
    public renderer: Renderer
  ) {
  }

  ngOnInit() {
    this.renderer.setElementStyle(this.header, 'webkitTransition', 'top 600ms');
  }

  onContentScroll(event) {
    if (event.detail.deltaY > 0) {
      this.renderer.setElementStyle(this.header, 'top', '-56px');
    }
    else {
      this.renderer.setElementStyle(this.header, 'top', '0px');
    }
  }
  
}
