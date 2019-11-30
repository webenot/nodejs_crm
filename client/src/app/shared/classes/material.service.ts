import { ElementRef } from '@angular/core';

declare var M;

export interface MaterialInstance {

  open?(): void,
  close?(): void,
  destroy?(): void,

}

export interface MaterialDatepicker extends MaterialInstance {
  date?: Date
}

export class MaterialService {

  static toast(message: string) {
    M.toast({html: message});
  }

  static initializeFloatingButton(ref: ElementRef) {
    M.FloatingActionButton.init(ref.nativeElement);
  }

  static updateTextFields() {
    M.updateTextFields();
  }

  static initModal(ref: ElementRef, options = null): MaterialInstance {
    return M.Modal.init(ref.nativeElement, options);
  }

  static tooltip(ref: ElementRef, options = null): MaterialInstance {
    return M.Tooltip.init(ref.nativeElement, options);
  }

  static datepicker(ref: ElementRef, options = null): MaterialDatepicker {
    return M.Datepicker.init(ref.nativeElement, options);
  }
}
