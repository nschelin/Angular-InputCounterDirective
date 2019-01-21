import {
  Directive,
  ElementRef,
  Renderer2,
  Self,
  HostListener
} from "@angular/core";
import { NgControl } from "@angular/forms";

@Directive({
  selector: "[inputCounter]"
})
export class InputCounter {
  private defaultColor: any;
  private MAX_NOTIFY = 0.8;
  private maxLength: number;
  private counterDiv: HTMLDivElement;
  private isTextBox: Boolean = false;
  private hasMaxLength: Boolean = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Self() private ngControl: NgControl
  ) {
    this.isTextBox =
      (el.nativeElement instanceof HTMLInputElement && 
       el.nativeElement.type === "text") ||
       el.nativeElement instanceof HTMLTextAreaElement);
    this.hasMaxLength = el.nativeElement.maxLength && el.nativeElement.maxLength > 0;

    if (this.isTextBox && this.hasMaxLength) {
      this.maxLength = el.nativeElement.maxLength;
      this.defaultColor = window.getComputedStyle(document.body, null).getPropertyValue('color');
      this.counterDiv = this.renderer.createElement("span");
      this.counterDiv.textContent = `0/${this.maxLength}`;
      this.counterDiv.style.textAlign = "right";
      this.counterDiv.style.marginLeft = "5px";
      this.renderer.addClass(this.counterDiv, "counter");
      this.renderer.appendChild(el.nativeElement.parentNode, this.counterDiv);
    }
  }

  @HostListener("keyup", ["$event"])
  inputChanged() {
    if(this.isTextBox && this.hasMaxLength) {
      const length = this.ngControl.value.length;
      const maxLength = this.maxLength;
      this.counterDiv.textContent = `${length}/${maxLength}`;
      
      if(length / maxLength >= this.MAX_NOTIFY) {
        this.counterDiv.style.color = 'red';
      }
      else {
        this.counterDiv.style.color = this.defaultColor;
      }
    }
    
  }
}
