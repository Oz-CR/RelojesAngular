import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Clock from '../../models/Clock';

@Component({
  selector: 'app-clock-comp',
  imports: [FormsModule, CommonModule],
  templateUrl: './clock-comp.html',
  styleUrl: './clock-comp.css'
})
export class ClockComp implements OnInit, OnDestroy {
  @Input() startTime: string = '12:00';
  @Input() bgColor: string = '#ffffff';
  @Input() numberColor: string = '#000000';
  @Input() labelColor: string = '#000000';
  @Input() hourHandColor: string = '#333333';
  @Input() minuteHandColor: string = '#555555';
  @Input() speed: number = 1;
  
  @Output() removeClock = new EventEmitter<void>();
  @Output() updateColors = new EventEmitter<any>();
  @Output() updateTime = new EventEmitter<any>();

  clock!: Clock;
  showColorsModal = false;
  showTimeModal = false;
  
  // Variables temporales para edición
  tempBgColor: string = '#ffffff';
  tempNumberColor: string = '#000000';
  tempLabelColor: string = '#000000';
  tempHourHandColor: string = '#333333';
  tempMinuteHandColor: string = '#555555';
  
  // Variables para guardar los valores originales
  originalBgColor: string = '#ffffff';
  originalNumberColor: string = '#000000';
  originalLabelColor: string = '#000000';
  originalHourHandColor: string = '#333333';
  originalMinuteHandColor: string = '#555555';
  
  // Variables para el modal de tiempo
  currentTimeInput: string = '12:00';
  
  // Getter para obtener la hora actual del reloj en formato HH:MM
  get currentTimeForInput(): string {
    if (!this.clock) return '12:00';
    const [hours, minutes] = this.clock.currentTime.split(':');
    return `${hours}:${minutes}`;
  }
  
  // Función para convertir hora de 24 horas a 12 horas
  convertTo12Hour(time24: string): string {
    const [hours, minutes, seconds] = time24.split(':');
    const hour24 = parseInt(hours, 10);
    const hour12 = hour24 % 12 || 12;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes}:${seconds} ${ampm}`;
  }
  
  // Getter para obtener la hora actual del reloj en formato de 12 horas
  get currentTimeDisplay(): string {
    if (!this.clock) return '12:00:00 PM';
    return this.convertTo12Hour(this.clock.currentTime);
  }

  ngOnInit() {
    this.clock = new Clock(this.startTime, this.speed);
    this.clock.start();
  }

  ngOnDestroy() {
    if (this.clock) {
      this.clock.stop();
    }
  }

  openEditColorsModal() {
    // Guardar los valores originales
    this.originalBgColor = this.bgColor;
    this.originalNumberColor = this.numberColor;
    this.originalLabelColor = this.labelColor;
    this.originalHourHandColor = this.hourHandColor;
    this.originalMinuteHandColor = this.minuteHandColor;
    
    // Inicializar variables temporales con valores actuales
    this.tempBgColor = this.bgColor;
    this.tempNumberColor = this.numberColor;
    this.tempLabelColor = this.labelColor;
    this.tempHourHandColor = this.hourHandColor;
    this.tempMinuteHandColor = this.minuteHandColor;
    this.showColorsModal = true;
  }

  openEditTimeModal() {
    // Inicializar con la hora actual del reloj
    const [hours, minutes, seconds] = this.clock.currentTime.split(':');
    this.currentTimeInput = `${hours}:${minutes}`;
    this.showTimeModal = true;
  }

  handleSaveColors() {
    const newColors = {
      bgColor: this.tempBgColor,
      numberColor: this.tempNumberColor,
      labelColor: this.tempLabelColor,
      hourHandColor: this.tempHourHandColor,
      minuteHandColor: this.tempMinuteHandColor
    };
    
    // Actualizar las propiedades reales del componente
    this.bgColor = this.tempBgColor;
    this.numberColor = this.tempNumberColor;
    this.labelColor = this.tempLabelColor;
    this.hourHandColor = this.tempHourHandColor;
    this.minuteHandColor = this.tempMinuteHandColor;
    
    this.updateColors.emit(newColors);
    this.showColorsModal = false;
  }
  
  cancelEditColors() {
    // Restaurar los valores originales
    this.bgColor = this.originalBgColor;
    this.numberColor = this.originalNumberColor;
    this.labelColor = this.originalLabelColor;
    this.hourHandColor = this.originalHourHandColor;
    this.minuteHandColor = this.originalMinuteHandColor;
    
    // Emitir los valores restaurados
    this.onColorChange();
    
    this.showColorsModal = false;
  }
  
  cancelEditTime() {
    this.showTimeModal = false;
  }
  
  onTimeChange(event: any) {
    const newTime = event.target.value;
    this.currentTimeInput = newTime;
    
    // Usar los segundos actuales del reloj
    const [, , currentSeconds] = this.clock.currentTime.split(':');
    const timeWithSeconds = `${newTime}:${currentSeconds}`;
    
    this.clock.setTime(timeWithSeconds);
  }
  
  onSpeedChange(event: any) {
    const newSpeed = parseFloat(event.target.value);
    this.speed = newSpeed;
    
    // Obtener la hora actual completa del reloj (incluyendo segundos)
    const currentTime = this.clock.currentTime;
    
    this.clock.stop();
    this.clock = new Clock(currentTime, newSpeed);
    this.clock.start();
  }
  
  onColorChange() {
    // Actualizar las propiedades reales con las temporales para preview
    this.bgColor = this.tempBgColor;
    this.numberColor = this.tempNumberColor;
    this.labelColor = this.tempLabelColor;
    this.hourHandColor = this.tempHourHandColor;
    this.minuteHandColor = this.tempMinuteHandColor;
  }

  handleSaveTime(data: {newTime: string, newSpeed: number}) {
    // Capturar el tiempo actual del reloj al momento de guardar
    const [, , currentSeconds] = this.clock.currentTime.split(':');
    const timeWithSeconds = `${data.newTime}:${currentSeconds}`;
    
    this.clock.stop();
    this.clock = new Clock(timeWithSeconds, data.newSpeed);
    this.clock.start();
    this.updateTime.emit({newTime: timeWithSeconds, newSpeed: data.newSpeed});
    this.showTimeModal = false;
  }

  onRemoveClock() {
    this.removeClock.emit();
  }
}
