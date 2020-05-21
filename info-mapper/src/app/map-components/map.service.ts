import { Injectable }                   from '@angular/core';
import { HttpClient }                   from '@angular/common/http';
import { Router }                       from '@angular/router';

import { catchError }                   from 'rxjs/operators';

import { Observable, forkJoin, of }               from 'rxjs';

import { BackgroundLayerComponent }     from './background-layer-control/background-layer.component';
import { BackgroundLayerItemComponent } from './background-layer-control/background-layer-item.component';
import { MapLayerComponent }            from './map-layer-control/map-layer.component';
import { MapLayerItemComponent }        from './map-layer-control/map-layer-item.component';

import { map }                          from "rxjs/operators"; 

@Injectable({ providedIn: 'root' })
export class MapService {

  layerArray: MapLayerItemComponent[] = [];
  backgroundLayerArray: BackgroundLayerItemComponent[] = [];
  // Global variables to be used throughout the application
  appConfig: any;
  appConfigFile: string = 'app-config.json';
  appPath: string = 'assets/app/';
  mapConfigFile: any;
  mapConfigPath: string = '';
  geoJSONBasePath: string = '';
  homePage: string = '';

  contentPaths: string[] = [];
  mapConfigPaths: string[] = [];

  constructor(private http: HttpClient,
              private router: Router) { }


  public addContentPath(path: string): void {
    this.contentPaths.push(path);
  }

  public addMapConfigPath(path: string): void {
    this.mapConfigPaths.push(path);
  }

  public getAppPath(): string {
    return this.appPath;
  }

  public getAppConfigFile(): string {
    return this.appConfigFile;
  }

  // Get the background layers for the map
  public getBackgroundLayers(): any[] {
    let backgroundLayers: any[] = [];
    this.mapConfigFile.geoMaps[0].geoLayers.forEach((geoLayer: any) => {
      if (geoLayer.properties.isBackground == 'true')
        backgroundLayers.push(geoLayer);
    });
    return backgroundLayers
  }

  // Return the boolean to add a leaflet background layers control or not
  public getBackgroundLayersMapControl(): boolean {
    return true;
  }

  // public getBackgroundViewGroupName(): string {
  //   return this.mapConfigFile.
  // }

  public getContentPath(id: string) {
    for (let i = 0; i < this.appConfig.mainMenu.length; i++) {
      if (this.appConfig.mainMenu[i].menus) {  
        for (let menu = 0; menu < this.appConfig.mainMenu[i].menus.length; menu++) {    
          if (this.appConfig.mainMenu[i].menus[menu].id == id)
            return this.appConfig.mainMenu[i].menus[menu].markdownFile;
        }
      } else {
        if (this.appConfig.mainMenu[i].id == id)
          return this.appConfig.mainMenu[i].markdownFile;
      }
    }
  }

  // Read data from a file
  public getData(path: string): Observable<any> {
    return this.http.get<any>(path)
    .pipe(
      catchError(this.handleError<any>(path))
    );
  }

  // Returns an array of layer file names from the json config file.
  public getDataLayers(): any[] {
    let dataLayers: any[] = [];
    this.mapConfigFile.geoMaps.forEach((geoMap: any) => {
      geoMap.geoLayers.forEach((geoLayer: any) => {
        if (!geoLayer.properties.isBackground || geoLayer.properties.isBackground == 'false') {
          dataLayers.push(geoLayer);
        }
      });
    });    
    return dataLayers;
  }

  // Get default background layer
  public getDefaultBackgroundLayer(): string {
    let defaultLayer: string = '';
    this.mapConfigFile.geoMaps[0].geoLayerViewGroups.forEach((viewGroup: any) => {
      if (viewGroup.properties.isBackground == 'true') {
        viewGroup.geoLayerViews.forEach((layerView: any) => {
          if (layerView.properties.selectedInitial == 'true')
            defaultLayer = layerView.geoLayerId;
        });
      }
    });
    return defaultLayer;
  }

  public getExtentInitial(): string[] {
    // Make sure to do some error handling for incorrect input
    let extentInitial: string = this.mapConfigFile.geoMaps[0].properties.extentInitial;
    let splitInitial: string[] = extentInitial.split(':');
    
    return splitInitial[1].split(',');  
  }

  public getFullMapConfigPath(id: string): string {

    for (let i = 0; i < this.appConfig.mainMenu.length; i++) {
      if (this.appConfig.mainMenu[i].menus) {  
        for (let menu = 0; menu < this.appConfig.mainMenu[i].menus.length; menu++) {    
          if (this.appConfig.mainMenu[i].menus[menu].id == id) {
            var path: string = '';
            let splitPath = this.appConfig.mainMenu[i].menus[menu].mapProject.split('/');
            for (let i = 0; i < splitPath.length - 1; i++) {
              path += splitPath[i] + '/';
            }
            this.setMapConfigPath(path);
            this.setGeoJSONBasePath(this.appConfig.mainMenu[i].menus[menu].mapProject);
            return this.appConfig.mainMenu[i].menus[menu].mapProject;
          }
        }
      } else {
        if (this.appConfig.mainMenu[i].id == id) {
          var path: string = '';
          let splitPath = this.appConfig.mainMenu[i].split('/');
          for (let i = 0; i < splitPath.length - 1; i++) {
            path += splitPath[i] + '/';
          }
          this.setMapConfigPath(path);
          this.setGeoJSONBasePath(this.appConfig.mainMenu[i].mapProject);
          return this.appConfig.mainMenu[i].mapProject;
        }
      }
    }
    return '';
  }

  public getGeoJSONBasePath(): string {
    return this.geoJSONBasePath;
  }
  
  public getGeoLayerViewEventHandler(geoLayerId: string): any[] {

    var geoLayerViewGroups: any = this.mapConfigFile.geoMaps[0].geoLayerViewGroups;

    for (let geoLayerViewGroup of geoLayerViewGroups) {
      if (!geoLayerViewGroup.properties.isBackground || geoLayerViewGroup.properties.isBackground == 'false') {
        for (let geoLayerView of geoLayerViewGroup.geoLayerViews) {
          if (geoLayerView.geoLayerId == geoLayerId) {
            return geoLayerView.eventHandlers;
          }
        }
      }
    }
    return [];
  }

  // TODO: jpkeahey 2020.05.18 - This has not yet been used. It's for getting
  // the home page from the app-config.json file, but this property has not
  // been used in the config file.
  public getHomePage(): string {
    return this.homePage;
  }

  // Returns variable with config data
  public getLayers() {
    return this.layerArray;
  }

  // Return an array of the list of layer view groups from config file.
  public getLayerGroups(): any[] {
    return this.mapConfigFile.geoMaps[0].geoLayerViewGroups
  }

  // Get the array of layer marker data, such as size, color, icon, etc.
  public getLayerMarkerData() : void {
    return this.mapConfigFile.layerViewGroups;
  }

  // This uses the old configuration file and has not been updated yet.
  public getLayerFromId(id: string) {
    let dataLayers: any = this.mapConfigFile.dataLayers;
    let layer: any = null;
    dataLayers.forEach((l: any) => {
      if (l.geolayerId == id) {
        layer = l;
      }
    })
    return layer;
  }

  public getLayerViewFromId(id: string) {
    
    var geoLayerViewGroups: any = this.mapConfigFile.geoMaps[0].geoLayerViewGroups;
    var layerView: any = null;

    for (let geoLayerViewGroup of geoLayerViewGroups) {
      if (!geoLayerViewGroup.properties.isBackground || geoLayerViewGroup.properties.isBackground == 'false') {
        for (let geoLayerView of geoLayerViewGroup.geoLayerViews) {    
          if (geoLayerView.geoLayerId == id) {
            layerView = geoLayerView;
            break;
          }
        }
      }
    }
    return layerView;
  }

  public getLayerViewUIEventHandlers() {
    // if (this.mapConfigFile.layerViewUIEventHandlers) {
    //   return this.mapConfigFile.layerViewUIEventHandlers ? this.mapConfigFile.layerViewUIEventHandlers : [];
    // } else if (this.mapConfigFile.geoLayerViewEventHandlers) {
    //   return this.mapConfigFile.geoLayerViewEventHandlers ? this.mapConfigFile.geoLayerViewEventHandlers : [];
    // }
    return this.mapConfigFile.layerViewUIEventHandlers ? this.mapConfigFile.layerViewUIEventHandlers : [];
  }

  public getLayerViewUIEventHandlersFromId(id: string) {
    let layerViewUIEventHandlers: any = this.mapConfigFile.layerViewUIEventHandlers;
    let returnHandlers: any[] = [];
    if (layerViewUIEventHandlers) {
      layerViewUIEventHandlers.forEach((handler: any) => {
        if (handler.layerViewId == id) {
          returnHandlers.push(handler);
        }
      })
    }
    return returnHandlers;
  }

  public getMapConfigFile() {
    return this.mapConfigFile;
  }

  public getMapConfigPath(): string {
    return this.mapConfigPath;
  }

  public getMouseoverFromId(id: string): {} {
    let mouseover: any;
    let layerView: any = this.getLayerViewFromId(id)
    if (layerView.onMouseover != null) {
      mouseover = layerView.onMouseover;
    } else {
      mouseover = {
        "action": "",
        "properties": ""
      }
    }
    return mouseover;
  }

  public getName(): string {
    if (this.mapConfigFile.name) return this.mapConfigFile.name;
  }

  public getOnClickFromId(id: string): {} {
    let onClick: any;
    let layerView: any = this.getLayerViewFromId(id);
    if (layerView.onClick != null) {
      onClick = layerView.onClick;
    } else {
      onClick = {
        "action": "",
        "properties": ""
      }
    }
    return onClick;
  }

  public getPlainText(path: string): Observable<any> {
    
    const obj: Object = {responseType: 'text' as 'text'}
    return this.http.get<any>(path, obj)
    .pipe(
      catchError(this.handleError<any>(path))
    );
  }

  public getProperties(): {} {
    return this.mapConfigFile.properties;
  }

  public getRefreshTime(id: string): string[] {
    return this.getLayerViewFromId(id).properties.refreshInterval.split(" ");
  }

  public getSymbolDataFromID(id: string): any {
    var geoLayerViewGroups: any = this.mapConfigFile.geoMaps[0].geoLayerViewGroups;
    var layerviewRet: any;
    
    for (let geoLayerViewGroup of geoLayerViewGroups) {
      for (let geoLayerView of geoLayerViewGroup.geoLayerViews) {
        if (geoLayerView.geoLayerId == id) {
          layerviewRet = geoLayerView.geoLayerSymbol;
        }
      }
    }
    return layerviewRet;
  }

  // public getTemplateFiles(eventHandlers: any) {

  //   var templateList: any[] = [];
  //   if (eventHandlers.length > 0) {
  //     eventHandlers.forEach((handler: any) => {
  //       templateList.push(this.getPlainText(this.getAppPath() +
  //                                       this.getMapConfigPath() +
  //                                       handler.template).pipe(
  //                                       map((res: Response) => res.json())));
  //       // this.getPlainText(this.getAppPath() +
  //       //                   this.getMapConfigPath() +
  //       //                   handler.template)
  //       //                     .subscribe((text: any) => {
  //       //                       // Great, you have the template file,
  //       //                       // now what?
  //       //                       console.log(text);
  //       //                     });
  //     });
  //     forkJoin(templateList).subscribe((results: any) => {
  //       console.log(results);
        
  //     })
  //   }
  // }

  /**
   * Handle Http operation that failed, and let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (path: string, result?: T) {
    return (error: any): Observable<T> => {
      // Log the error to console instead
      console.error(error.message + ': "' + path + '" could not be read');
      this.router.navigateByUrl('map-error');
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  public setAppConfig(appConfigFile: {}): void {
    this.appConfig = appConfigFile;
  }

  public setAppPath(path: string): void {
    this.appPath = path;
  }

  private setGeoJSONBasePath(path: string): void {
    let splitPath: string[] = path.split('/');
    var finalPath: string = '';

    for (let i = 0; i < splitPath.length - 1; i++) {
      finalPath += splitPath[i] + '/';
    }   
    this.geoJSONBasePath = finalPath;    
  }

  // NOT YET USED
  public setHomePage(homePage: string): void {
    this.homePage = homePage;
  }

  // Set the .json configuration file
  public setMapConfigFile(mapConfigFile: any): void {
    this.mapConfigFile = mapConfigFile;
  }

  public setMapConfigPath(path: string): void {
    this.mapConfigPath = path;
  }
  
  // As of right now, this GETs a full file, and might be slow with large files
  public urlExists(url: string): Observable<any> {
    return this.http.get(url);
  }
}
