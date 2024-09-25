<!-- custom-spinner.component.html -->
<div class="custom-loading-container" *ngIf="isLoading">
  <div class="custom-spinner">
    <div class="spinner-segment" *ngFor="let segment of segments"></div>
  </div>
  <div class="loading-text">{{loadingText}}</div>
</div>


// custom-spinner.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-spinner',
  templateUrl: './custom-spinner.component.html',
  styleUrls: ['./custom-spinner.component.css']
})
export class CustomSpinnerComponent {
  @Input() isLoading: boolean = true;  // Show/hide spinner
  @Input() loadingText: string = 'loading....'; // Custom loading text
  segments = Array(12).fill(0); // Creating 12 segments for the spinner
}

/* custom-spinner.component.css */
.custom-loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px dashed orange;
  padding: 20px;
  margin: 20px;
  height: 150px;  /* Adjust height */
  width: 100%;    /* Adjust width */
}

.custom-spinner {
  position: relative;
  width: 60px;
  height: 60px;
  animation: rotate 1s linear infinite;
}

.spinner-segment {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: transparent;
  border-top: 6px solid orange;
  border-radius: 50%;
  transform: rotate(calc(30deg * var(--i)));
  animation: dash 1.2s ease-in-out infinite;
}

.spinner-segment:nth-child(1) { --i: 1; transform: rotate(0deg); }
.spinner-segment:nth-child(2) { --i: 2; transform: rotate(30deg); }
.spinner-segment:nth-child(3) { --i: 3; transform: rotate(60deg); }
.spinner-segment:nth-child(4) { --i: 4; transform: rotate(90deg); }
.spinner-segment:nth-child(5) { --i: 5; transform: rotate(120deg); }
.spinner-segment:nth-child(6) { --i: 6; transform: rotate(150deg); }
.spinner-segment:nth-child(7) { --i: 7; transform: rotate(180deg); }
.spinner-segment:nth-child(8) { --i: 8; transform: rotate(210deg); }
.spinner-segment:nth-child(9) { --i: 9; transform: rotate(240deg); }
.spinner-segment:nth-child(10) { --i: 10; transform: rotate(270deg); }
.spinner-segment:nth-child(11) { --i: 11; transform: rotate(300deg); }
.spinner-segment:nth-child(12) { --i: 12; transform: rotate(330deg); }

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.loading-text {
  margin-left: 15px;
  font-size: 16px;
  color: #333;
}

<!-- Component where you want to use it) -->
<app-custom-spinner [isLoading]="true" loadingText="Loading your data..."></app-custom-spinner>


