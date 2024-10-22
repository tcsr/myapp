Declarative:

Focuses on what needs to be done.
Used in Angular templates, data binding, and reactive programming.
Angular handles much of the work behind the scenes.
Imperative:

Focuses on how things should be done step-by-step.
Used when you need explicit control, like direct DOM manipulation or handling side effects in services.

Real-World Examples
Declarative Programming:
Real-Time Data Dashboard (Declarative with async pipe)
Imagine you are building a real-time stock price dashboard where prices are updated frequently. You could use the declarative approach with Angular's async pipe to handle real-time updates without writing manual subscription logic.

// stock-dashboard.component.ts
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { StockService } from './stock.service';

@Component({
  selector: 'app-stock-dashboard',
  template: `
    <div *ngIf="stockPrices$ | async as stockPrices">
      <h2>Stock Prices</h2>
      <ul>
        <li *ngFor="let stock of stockPrices">
          {{ stock.symbol }}: {{ stock.price }}
        </li>
      </ul>
    </div>
  `
})
export class StockDashboardComponent {
  stockPrices$: Observable<any>;

  constructor(private stockService: StockService) {
    this.stockPrices$ = this.stockService.getRealTimeStockPrices();
  }
}

In this example, Angular declaratively subscribes to the stockPrices$ observable and automatically updates the DOM when new data is received. You don’t need to manually manage subscriptions or the DOM.

 2. User Profile Page (Declarative Form)
If you are building a user profile page where users can edit and update their information, you can use Angular's Reactive Forms to declaratively manage form controls.
// user-profile.component.ts
import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  template: `
    <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
      <label>
        Name:
        <input formControlName="name">
      </label>
      <label>
        Email:
        <input formControlName="email">
      </label>
      <button type="submit">Save</button>
    </form>
  `
})
export class UserProfileComponent {
  profileForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      name: [''],
      email: ['']
    });
  }

  onSubmit() {
    console.log(this.profileForm.value);
  }
}

In this example, the form's structure is declaratively defined using Angular's ReactiveFormsModule, and Angular takes care of binding the form controls to the component without you needing to manipulate the DOM or handle events manually.

3. Product List with Filtering (Declarative)
In an e-commerce app, you might have a product list with a filtering feature. Using declarative data binding, you can easily update the product list when a user applies a filter.

<!-- product-list.component.html -->
<input type="text" placeholder="Search Products" [(ngModel)]="filter" />
<ul>
  <li *ngFor="let product of products | filter: filter">
    {{ product.name }} - {{ product.price | currency }}
  </li>
</ul>

Here, you declare how the filtering should work, and Angular takes care of applying the filter to the product list as the user types in the search box. This removes the need for imperative logic to manage the filter state.

Imperative Programming:
User Authentication Flow (Imperative with HTTP)
In a user authentication flow, when the user submits a login form, you need to imperatively handle the HTTP request to the server and manage the success or failure of the login.

// login.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  template: `
    <form (ngSubmit)="onLogin()">
      <input type="text" [(ngModel)]="username" placeholder="Username">
      <input type="password" [(ngModel)]="password" placeholder="Password">
      <button type="submit">Login</button>
    </form>
    <div *ngIf="errorMessage">{{ errorMessage }}</div>
  `
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    this.http.post('/api/login', { username: this.username, password: this.password })
      .subscribe(
        () => this.router.navigate(['/dashboard']),
        (error) => this.errorMessage = 'Login failed. Please try again.'
      );
  }
}

In this case, you imperatively handle the login by explicitly managing the HTTP request and routing the user based on the response. This involves writing more detailed, step-by-step code, including error handling.

2. Shopping Cart (Imperative with Event Handling)
In an e-commerce application, a shopping cart can be managed using imperative logic to control the behavior of adding and removing items.
// cart.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-cart',
  template: `
    <ul>
      <li *ngFor="let item of cartItems">
        {{ item.name }} - {{ item.price }}
        <button (click)="removeFromCart(item)">Remove</button>
      </li>
    </ul>
    <button (click)="checkout()">Checkout</button>
  `
})
export class CartComponent {
  cartItems = [
    { name: 'Product 1', price: 100 },
    { name: 'Product 2', price: 200 }
  ];

  removeFromCart(item) {
    this.cartItems = this.cartItems.filter(i => i !== item);
  }

  checkout() {
    // handle checkout logic
    console.log('Checking out', this.cartItems);
  }
}

Here, you imperatively manage the cart state by manually removing items and updating the list when a user clicks "Remove". The removeFromCart method explicitly defines how the cart should behave when an item is removed.

3. Modal or Dialog Control (Imperative)
In a modal or dialog in Angular, you might want to open or close it based on user interaction or specific conditions, handled imperatively.

// modal.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  template: `
    <div *ngIf="isOpen" class="modal">
      <p>Modal Content</p>
      <button (click)="close()">Close</button>
    </div>
    <button (click)="open()">Open Modal</button>
  `,
  styles: [`
    .modal {
      position: fixed;
      top: 20%;
      left: 20%;
      width: 60%;
      height: 60%;
      background-color: white;
      border: 1px solid #ccc;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class ModalComponent {
  isOpen = false;

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }
}

// modal.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-modal',
  template: `
    <div *ngIf="isOpen" class="modal">
      <p>Modal Content</p>
      <button (click)="close()">Close</button>
    </div>
    <button (click)="open()">Open Modal</button>
  `,
  styles: [`
    .modal {
      position: fixed;
      top: 20%;
      left: 20%;
      width: 60%;
      height: 60%;
      background-color: white;
      border: 1px solid #ccc;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class ModalComponent {
  isOpen = false;

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }
}

In this example, you imperatively control the opening and closing of the modal by managing its visibility with direct state changes and event handling.

Key Takeaways:

Declarative Real-Time Example: A real-time stock price dashboard using the async pipe and observables to update the UI without explicit event handling.
Declarative Forms: A user profile page using Angular's reactive forms for managing user input with minimal code.
Imperative Authentication: A login form where you handle the HTTP request, route changes, and error handling imperatively.
Imperative Shopping Cart: A shopping cart where you explicitly manage adding and removing items based on user interaction.
Both styles have their place in Angular applications. Declarative programming makes the code more readable and reduces complexity, especially in the UI layer. Imperative programming provides more control and is useful in scenarios where step-by-step instructions are needed, such as error handling, form validation, or user interactions.

Angular coding standards to follow for building clean, maintainable, and efficient Angular applications:

1. Use Consistent Naming Conventions
Component names: Use PascalCase for component, service, and class names (e.g., UserProfileComponent, AuthService).
File names: Use kebab-case for file names and match them with the class they contain (e.g., user-profile.component.ts, auth.service.ts).
Variables and functions: Use camelCase for variable and function names (e.g., userName, fetchData()).
2. Structure Folders by Feature Module
Organize your project by feature modules rather than layers (e.g., components, services). This improves scalability and maintainability.

Example folder structure:
/src/app
  /users
    /components
    /services
    /models
    users.module.ts
  /products
    /components
    /services
    /models
    products.module.ts

3. Use Angular CLI for Code Generation
Use Angular CLI commands to generate components, services, and other files. This ensures consistent structure and reduces errors.

ng generate component user-profile
ng generate service auth

4. Follow Angular Template Syntax
Avoid inline styles and inline templates. Use external .html and .css files for components.

Use Angular structural directives (*ngIf, *ngFor) to control the display of elements in templates.
<div *ngIf="isLoggedIn">Welcome, User!</div>

Use async pipe to automatically manage observables in templates without manually subscribing.
<div *ngIf="data$ | async as data">{{ data }}</div>

5. Avoid Logic in Templates
Keep templates simple and move complex logic to the component class. This improves readability and testability.

<!-- Bad practice -->
<div>{{ calculateDiscount(product.price, product.discount) }}</div>

<!-- Good practice -->
<div>{{ discountPrice }}</div>

export class ProductComponent {
  discountPrice = this.calculateDiscount(product.price, product.discount);
}

6. Leverage Angular Lifecycle Hooks
Use lifecycle hooks like ngOnInit, ngOnChanges, and ngOnDestroy appropriately to manage the component lifecycle effectively.
export class MyComponent implements OnInit, OnDestroy {
  ngOnInit() {
    // Initialize data or subscriptions here
  }

  ngOnDestroy() {
    // Clean up resources (unsubscribe, remove listeners)
  }
}

7. Use Dependency Injection Correctly
Inject services in the constructor and use @Injectable() decorators for services.

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
}

Use providedIn: 'root' to ensure services are singleton and provided at the root level of the app unless needed at a specific module level.

8. Avoid Direct DOM Manipulation
Avoid using ElementRef and directly manipulating the DOM. Use Angular’s Renderer2 for any DOM manipulation.
constructor(private renderer: Renderer2) {}

ngAfterViewInit() {
  this.renderer.setStyle(this.element.nativeElement, 'background-color', 'blue');
}

9. Use Observable and RxJS Practices
Always use Observable over Promise for asynchronous operations.
Unsubscribe from observables when components are destroyed to avoid memory leaks (use takeUntil or async pipe).
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class MyComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.myService.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => console.log(data));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

10. Reuse Components and Modules
Create reusable components when possible. Avoid duplicating code in multiple places.

Use shared modules for reusable components, directives, and pipes.
@NgModule({
  declarations: [CommonHeaderComponent],
  exports: [CommonHeaderComponent],
})
export class SharedModule {}

11. Error Handling in HTTP Calls
Handle HTTP errors properly using Angular's HttpClient and RxJS operators like catchError.
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

this.http.get('api/data')
  .pipe(
    catchError(error => {
      console.error('Error occurred:', error);
      return throwError(error);
    })
  )
  .subscribe();

12. Keep Services for Business Logic
Move business logic out of components and into services. This keeps your components lean and focused on presentation logic.

// auth.service.ts
export class AuthService {
  login(credentials: any) {
    return this.http.post('/api/login', credentials);
  }
}

// login.component.ts
export class LoginComponent {
  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.form.value)
      .subscribe();
  }
}

13. Use TrackBy with ngFor for Performance
When looping over lists with *ngFor, use trackBy to improve performance by helping Angular identify list items that haven’t changed.
<li *ngFor="let item of items; trackBy: trackByFn">{{ item.name }}</li>

trackByFn(index: number, item: any): number {
  return item.id; // Unique identifier
}

14. Follow Component Interaction Best Practices
Use Input/Output decorators for communication between parent and child components.
Avoid excessive use of EventEmitter. Prefer using services for cross-component communication.

// child.component.ts
@Input() userData: any;
@Output() userUpdated = new EventEmitter<any>();

updateUser() {
  this.userUpdated.emit(updatedUser);
}

15. Test Your Code
Write unit tests for services, pipes, and components using Jasmine and Karma.
Use Angular TestBed for setting up testing modules.
For end-to-end testing, use Protractor.

it('should return a greeting', () => {
  const fixture = TestBed.createComponent(GreetingComponent);
  const component = fixture.componentInstance;
  expect(component.greet('World')).toEqual('Hello, World!');
});

