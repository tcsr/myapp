import { Routes, RouterModule } from '@angular/router';
import { AppLoadComponent, MenuComponent }  from './app.component';
import { ConfirmationPageComponent } from './confirmation-page.component';
import { ErrorPageComponent } from './error-page.component';
	
const routes: Routes = [
    { path: 'menu', component: MenuComponent },
    { path: 'menu/takeSurvey/:formCode', component: AppLoadComponent },
    { path: 'menu/takeSurvey/:formCode/formVersion/:formVerCode', component: AppLoadComponent },
    { path: 'menu/viewSurvey/:formSubCode', component: AppLoadComponent },
	{ path: 'confirm/:subCode', component: ConfirmationPageComponent },
	{ path: 'error', component: ErrorPageComponent },
    { path: '**', redirectTo: 'menu', pathMatch: 'full' }
];

export const routing = RouterModule.forRoot(routes);
