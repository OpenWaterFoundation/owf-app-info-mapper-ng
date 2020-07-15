import { BrowserModule, Title }     from '@angular/platform-browser';
import { NgModule }                 from '@angular/core';
import { HashLocationStrategy,
          LocationStrategy  }       from '@angular/common';
import { HttpClientModule }         from '@angular/common/http';

import { AppComponent }             from './app.component';
import { AppRoutingModule }         from './app-routing.module';

// Bootstrap & Angular Materials
import { AlertModule }              from 'ngx-bootstrap';
import { MatTooltipModule }         from '@angular/material/tooltip';
import { MatButtonModule }          from '@angular/material/button';
import { MatDialogModule }          from '@angular/material/dialog';
import { DragDropModule }           from '@angular/cdk/drag-drop';

// Imports for NavBar Components
import { NavBarComponent }          from './nav-bar/nav-bar.component';
import { NavDirective }             from './nav-bar/nav.directive';
// NavBar Link components
import { TabComponent }             from './nav-bar/tab/tab.component';
import { TabDirective }             from './nav-bar/tab/tab.directive';
//imports for map
import { MapComponent }             from './map-components/map.component';
import { MapService }               from './map-components/map.service';
// Background Layer Components
import { BackgroundLayerComponent } from './map-components/background-layer-control/background-layer.component';
import { BackgroundLayerDirective } from './map-components/background-layer-control/background-layer.directive';
// Dialog Component
import { DialogContent }            from './map-components/dialog-content/dialog-content.component';
// Map Layer Components
import { MapLayerComponent }        from './map-components/map-layer-control/map-layer.component';
import { MapLayerDirective }        from './map-components/map-layer-control/map-layer.directive';
// Map Sidepanel Components
import { SidePanelInfoComponent }   from './map-components/sidepanel-info/sidepanel-info.component';
import { SidePanelInfoDirective }   from './map-components/sidepanel-info/sidepanel-info.directive';
// Map Error Page Component
import { MapErrorComponent }        from './map-components/map-error/map-error.component';
import { AnimationToolsComponent }  from './map-components/animation-tools/animation-tools.component';
// Not Found
import { NotFoundComponent }        from './not-found/not-found.component';
import { ContentPageComponent }     from './content-page/content-page.component';
// Side Panel Legend Symbols
import { LegendSymbolsComponent }   from './map-components/legend-symbols/legend-symbols.component';
import { LegendSymbolsDirective }   from './map-components/legend-symbols/legend-symbols.directive';
import { BrowserAnimationsModule }  from '@angular/platform-browser/animations';
import { AppService }               from './app.service';


@NgModule({
  imports: [
    AlertModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    DragDropModule,
    HttpClientModule,
    MatTooltipModule,
    MatButtonModule,
    MatDialogModule
  ],
  providers: [
    AppService,
    MapService,
    Title,
    {provide : LocationStrategy , useClass: HashLocationStrategy}
  ],
  declarations: [
    AnimationToolsComponent,
    AppComponent,
    BackgroundLayerComponent,
    ContentPageComponent,
    LegendSymbolsComponent,
    MapComponent,
    MapErrorComponent,
    MapLayerComponent,
    NavBarComponent,
    NotFoundComponent,
    SidePanelInfoComponent,
    TabComponent,

    BackgroundLayerDirective,
    LegendSymbolsDirective,
    MapLayerDirective,
    NavDirective,
    TabDirective,
    SidePanelInfoDirective,

    DialogContent
  ],
  entryComponents: [
    BackgroundLayerComponent,
    LegendSymbolsComponent,
    MapLayerComponent,
    SidePanelInfoComponent,
    TabComponent, 

    DialogContent
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
  constructor() {}
}
