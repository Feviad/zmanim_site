import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {StoreService} from '@core/store';
import {filter} from 'rxjs/operators';
import {FreegeoipService} from '@core/freegeoip';
import {EventData, LngLatLike, MapMouseEvent} from 'mapbox-gl';
import {Result} from '@mapbox/mapbox-gl-geocoder';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  zoom?: number;
  mapCoords?: LngLatLike;
  markerCoords?: LngLatLike;

  private readonly onDestroy$: Subscription = new Subscription();

  constructor(
    private readonly storeService: StoreService,
    private readonly freegeoipService: FreegeoipService
  ) {
  }

  ngOnInit(): void {
    this.initMap();
    this.initCoordsFromNavigator();
    this.initCoordsFromGeoip();
  }

  ngOnDestroy(): void {
    this.onDestroy$.unsubscribe();
  }

  onMapClicked({lngLat}: MapMouseEvent & EventData): void {
    this.storeService.setCoords({...lngLat, source: 'map'});
  }

  onGeocoderResult({result}: { result: Result }): void {
    this.storeService.setCoords({
      lat: result.center[1],
      lng: result.center[0],
      source: 'map'
    });
  }

  private initMap(): void {
    this.storeService.coords$.pipe(
      filter(({lat, lng, source}) => !!(lat && lng && source)),
    ).subscribe(({lat, lng, source}) => {
      switch (source) {
        case 'navigator':
        case 'geoip':
          this.zoom = 8;
          this.mapCoords = {lat, lng};
          this.markerCoords = {lat, lng};
          break;
        case 'map':
          this.markerCoords = {lat, lng};
          break;
      }
    });
  }

  private initCoordsFromNavigator(): void {
    window.navigator.geolocation
      .getCurrentPosition(({coords}) => {
        this.storeService.setCoords({lat: coords.latitude, lng: coords.longitude, source: 'navigator'});
      });
  }

  private initCoordsFromGeoip(): void {
    this.onDestroy$.add(
      this.freegeoipService.fetchMyGeo()
        .subscribe(({latitude, longitude}) => {
          this.storeService.setCoords({lat: latitude, lng: longitude, source: 'geoip'});
        })
    );
  }
}
