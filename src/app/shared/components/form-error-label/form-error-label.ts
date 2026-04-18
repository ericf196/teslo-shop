import { Component, input } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { FormUtils } from '@utils/form-utils';

@Component({
  selector: 'form-error-label',
  imports: [],
  templateUrl: './form-error-label.html',
  styleUrl: './form-error-label.css'
})
export class FormErrorLabel {
  control = input.required<AbstractControl>();

  get errorMessage(): string | null {
    const errors: ValidationErrors = this.control().errors || {};

    return this.control().touched && Object.keys(errors).length > 0 
    ? FormUtils.getTextError(errors)
    : null;
  }

}
