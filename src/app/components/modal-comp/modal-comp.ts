import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-comp',
  imports: [FormsModule, CommonModule],
  templateUrl: './modal-comp.html',
  styleUrl: './modal-comp.css'
})
export class ModalComp {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() createClock = new EventEmitter<any>();

  form = {
    startTime: '12:00',
    bgColor: '#ffffff',
    numberColor: '#000000',
    labelColor: '#000000',
    hourHandColor: '#333333',
    minuteHandColor: '#555555'
  };

  submitForm() {
    this.createClock.emit({ ...this.form });
    this.closeModal();
  }

  closeModal() {
    this.resetForm();
    this.close.emit();
  }
  
  resetForm() {
    this.form = {
      startTime: '12:00',
      bgColor: '#ffffff',
      numberColor: '#000000',
      labelColor: '#000000',
      hourHandColor: '#333333',
      minuteHandColor: '#555555'
    };
  }
}
