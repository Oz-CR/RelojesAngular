import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../../components/card/card';
import { PrimaryButton } from '../../components/primary-button/primary-button';
import { ModalComp } from '../../components/modal-comp/modal-comp';
import { ClockComp } from '../../components/clock-comp/clock-comp';

interface ClockConfig {
  startTime: string;
  bgColor: string;
  numberColor: string;
  labelColor: string;
  hourHandColor: string;
  minuteHandColor: string;
  speed?: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, Card, PrimaryButton, ModalComp, ClockComp],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  buttonText = 'Crear Reloj';
  modalOpen = false;
  clocks: ClockConfig[] = [];

  openModal() {
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }

  addClock(clockConfig: ClockConfig) {
    this.clocks.push({ ...clockConfig, speed: 1 });
    this.modalOpen = false;
  }

  removeClock(index: number) {
    this.clocks.splice(index, 1);
  }

  updateClockColors(index: number, newColors: any) {
    if (this.clocks[index]) {
      this.clocks[index].bgColor = newColors.bgColor;
      this.clocks[index].numberColor = newColors.numberColor;
      this.clocks[index].labelColor = newColors.labelColor;
      this.clocks[index].hourHandColor = newColors.hourHandColor;
      this.clocks[index].minuteHandColor = newColors.minuteHandColor;
    }
  }

  updateClockTime(index: number, data: {newTime: string, newSpeed: number}) {
    if (this.clocks[index]) {
      this.clocks[index].startTime = data.newTime;
      this.clocks[index].speed = data.newSpeed;
    }
  }
}
