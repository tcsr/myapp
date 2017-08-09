import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';

import { AppComponent, AppLoadComponent, MenuComponent } from './app.component';
import { ConfirmationPageComponent } from './confirmation-page.component';
import { ErrorPageComponent } from './error-page.component';
import { routing } from './app.routes';
import { TokenAuthService } from './tokenauth.service';

import { UcHeaderComponent } from './uc-header/uc-header.component';
import { UcHeaderProfileComponent } from './uc-header/uc-header-profile/uc-header-profile.component';
import { UcHeaderTileComponent } from './uc-header/uc-header-tile/uc-header-tile.component';

import { MdCardModule } from '@angular2-material/card';
import { MdToolbarModule } from '@angular2-material/toolbar';

import { SurveyLibraryModule } from 'survey-library/src/surveylibrarymodule';

@NgModule({
  declarations: [
    AppComponent,
	UcHeaderComponent, UcHeaderProfileComponent, UcHeaderTileComponent, ConfirmationPageComponent, ErrorPageComponent,
    AppLoadComponent, MenuComponent
  ],
  imports: [
    SurveyLibraryModule,
    BrowserModule,
	MdToolbarModule,
	MdCardModule,
    routing
  ],
  providers: [TokenAuthService],
  entryComponents: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {

}
