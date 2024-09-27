ng generate component custom-scrollbar

<!-- custom-scrollbar.component.html -->
<div class="custom-scrollbar-container" 
     [ngStyle]="{'height': height, 'width': width}"
     (mouseenter)="onHover(true)" 
     (mouseleave)="onHover(false)">
  <div class="scrollbar-track" #scrollContainer (scroll)="onScroll($event)">
    <div class="scrollbar-content">
      <ng-content></ng-content>
    </div>
  </div>
</div>

// custom-scrollbar.component.ts
import {
  Component,
  Input,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener
} from '@angular/core';

@Component({
  selector: 'app-custom-scrollbar',
  templateUrl: './custom-scrollbar.component.html',
  styleUrls: ['./custom-scrollbar.component.css']
})
export class CustomScrollbarComponent implements AfterViewInit {
  @Input() height: string = '300px'; // Customizable height
  @Input() width: string = '100%';   // Customizable width
  @Input() scrollbarColor: string = '#888'; // Scrollbar color
  @Input() scrollbarWidth: string = '6px';  // Scrollbar width
  @Input() visibility: 'hover' | 'always' | 'hidden' = 'hover'; // Visibility control
  @Input() smoothScrolling: boolean = true; // Smooth scrolling toggle

  @ViewChild('scrollContainer', { static: true }) scrollContainer!: ElementRef;

  ngAfterViewInit(): void {
    this.applyCustomStyles();
    if (this.smoothScrolling) {
      this.scrollContainer.nativeElement.style.scrollBehavior = 'smooth';
    }
  }

  applyCustomStyles(): void {
    const container = this.scrollContainer.nativeElement;
    container.style.overflowY = 'auto';
    container.style.overflowX = 'auto';

    if (this.visibility === 'hidden') {
      container.style.overflow = 'hidden';
    } else if (this.visibility === 'hover') {
      container.style.overflow = 'hidden';
    } else if (this.visibility === 'always') {
      container.style.overflow = 'auto';
    }
  }

  onHover(isHovered: boolean): void {
    if (this.visibility === 'hover') {
      this.scrollContainer.nativeElement.style.overflow = isHovered ? 'auto' : 'hidden';
    }
  }

  onScroll(event: Event): void {
    // Handle scroll event here, for example, to notify external listeners
    console.log('Scroll position:', this.scrollContainer.nativeElement.scrollTop);
  }

  scrollToTop(): void {
    this.scrollContainer.nativeElement.scrollTop = 0;
  }

  scrollToBottom(): void {
    this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
  }

  scrollToLeft(): void {
    this.scrollContainer.nativeElement.scrollLeft = 0;
  }

  scrollToRight(): void {
    this.scrollContainer.nativeElement.scrollLeft = this.scrollContainer.nativeElement.scrollWidth;
  }
}

/* custom-scrollbar.component.css */
.custom-scrollbar-container {
  position: relative;
  overflow: hidden; /* Prevent native scrollbars */
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  height: 100%;
  width: 100%;
}

.scrollbar-track {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.scrollbar-content {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.scrollbar-content::-webkit-scrollbar {
  width: var(--scrollbar-width, 6px);
  height: var(--scrollbar-width, 6px);
}

.scrollbar-content::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-color, #888);
  border-radius: 4px;
}

.scrollbar-content::-webkit-scrollbar-track {
  background-color: transparent;
}

.custom-scrollbar-container:hover .scrollbar-content {
  overflow: auto; /* Display the scrollbar on hover */
}

.custom-scrollbar-container .scrollbar-content {
  scrollbar-width: thin;
  scrollbar-color: var(--scrollbar-color, #888) transparent;
  transition: opacity 0.3s;
}

.custom-scrollbar-container:hover .scrollbar-content::-webkit-scrollbar-thumb {
  background-color: #555; /* Change color on hover */
}

:host-context(.smooth) .scrollbar-content {
  scroll-behavior: smooth;
}


<!-- app.component.html or any other component -->
<app-custom-scrollbar 
  [height]="'400px'" 
  [width]="'300px'"
  [scrollbarColor]="'#FF5733'" 
  [scrollbarWidth]="'8px'" 
  [visibility]="'hover'"
  [smoothScrolling]="true">
  
  <!-- Scrollable content goes here -->
  <div *ngFor="let item of items" style="padding: 10px; border-bottom: 1px solid #ddd;">
    Item {{ item }}
  </div>
</app-custom-scrollbar>
