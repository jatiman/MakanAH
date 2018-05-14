import { Component, NgZone, ElementRef, ViewChild } from '@angular/core';
import { NavController,Platform,LoadingController } from 'ionic-angular';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation';
//import { googlemaps } from 'googlemaps';
import { LOGOUT } from '../../store/actions/auth';
import { AppState } from '../../store/reducers/root';
import { NgRedux, select } from 'ng2-redux';
import { RestProvider } from '../../providers/rest/rest';

declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  
  form=<any>{};
  lat: any="";
  long: any;
  hasil: any='';
  placename: any;
  address: any;
  cuisines: any;
  map:any;
  latLng:any;
  markers:any;
  mapOptions:any;  
  constructor(private ngRedux: NgRedux<AppState>,private zone: NgZone,public plt: Platform,private geolocation: Geolocation,public navCtrl: NavController, public restProvider: RestProvider, public load:LoadingController) {
    
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap(){
    let loading = this.load.create({
      content: 'Please wait…'
    });
    loading.present();
    this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: false }).then((position) => {
      this.lat = position.coords.latitude;
      this.long = position.coords.longitude;
      this.latLng = new google.maps.LatLng(this.lat, this.long);
          console.log('latLng',this.latLng);
     
      this.mapOptions = {
        center: this.latLng,
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [{ "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#e9e9e9" }, { "lightness": 17 }] }, { "featureType": "landscape", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 20 }] }, { "featureType": "road.highway", "elementType": "geometry.fill", "stylers": [{ "color": "#ffffff" }, { "lightness": 17 }] }, { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#ffffff" }, { "lightness": 29 }, { "weight": 0.2 }] }, { "featureType": "road.arterial", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 18 }] }, { "featureType": "road.local", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }, { "lightness": 16 }] }, { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }, { "lightness": 21 }] }, { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#dedede" }, { "lightness": 21 }] }, { "elementType": "labels.text.stroke", "stylers": [{ "visibility": "on" }, { "color": "#ffffff" }, { "lightness": 16 }] }, { "elementType": "labels.text.fill", "stylers": [{ "saturation": 36 }, { "color": "#333333" }, { "lightness": 40 }] }, { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] }, { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#f2f2f2" }, { "lightness": 19 }] }, { "featureType": "administrative", "elementType": "geometry.fill", "stylers": [{ "color": "#fefefe" }, { "lightness": 20 }] }, { "featureType": "administrative", "elementType": "geometry.stroke", "stylers": [{ "color": "#fefefe" }, { "lightness": 17 }, { "weight": 1.2 }] }],
        disableDoubleClickZoom: false,
        disableDefaultUI: true,
        zoomControl: true,
        scaleControl: true,
      }   

      this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);
      this.addMarker();
      
      var forms = this.form;
      this.restProvider.latit = this.lat;
      this.restProvider.longit = this.long;
      this.restProvider.isKM = forms.isKM;
      this.restProvider.ctg = forms.cat;
      this.restProvider.getSearch()
      .then(data => {
        this.hasil=data;
        let arr=[];
        for (let i = 0; i < this.hasil.restaurants.length; i++) {
          arr.push({
            name: this.hasil.restaurants[i].restaurant.name,
            latitude: this.hasil.restaurants[i].restaurant.location.latitude,
            longitude: this.hasil.restaurants[i].restaurant.location.longitude,
            address: this.hasil.restaurants[i].restaurant.location.address,
            cuisines: this.hasil.restaurants[i].restaurant.cuisines
          });
          this.createMarker(arr[i].latitude,arr[i].longitude,arr[i].name,arr[i].address,arr[i].cuisines);
        }
        
      });
      

      /*let service = new google.maps.places.PlacesService(this.map);
      service.nearbySearch({
              location: this.latLng,
              radius: this.isKM,
              types: ['restaurant']
            }, (results, status) => {
                this.callback(results, status);
            });*/
      }, (err) => {
        alert('err '+err);
      });

    this.placename="Tap Restaurant Marker to Show Data";
    this.address="Tap Restaurant Marker to Show Data";
    this.cuisines="Tap Restaurant Marker to Show Data";
    loading.dismiss();
  }

  addMarker(){

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter(),
      icon: '../../assets/icon/navigation.png',
    });

    let content = "<p>This is your current position !</p>";          
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }

  /*callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        this.createMarker(results[i]);
      }
    }
  }*/

  createMarker(latt,longg,namee,addrr,cuis){
    var latitude = latt;
    var longitude = longg;
    var name = namee;
    var addr = addrr;
    var cui = cuis;
    var myLL = new google.maps.LatLng(latitude, longitude);
    this.markers = new google.maps.Marker({
      map: this.map,
      position: myLL
    });

    let infowindow = new google.maps.InfoWindow();

    google.maps.event.addListener(this.markers, 'click', () => {
      this.zone.run(() => {
        //infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + place.vicinity + '</div>');
        //infowindow.open(this.map, this.markers);
        this.placename=name;
        this.address=addr;
        this.cuisines=cui;
      });
    });
  }


  logout() {
    let loading = this.load.create({
      content: 'Please wait…'
    });
    loading.present();
    this.ngRedux.dispatch({
      type: LOGOUT,
      navCtrl: () => this.navCtrl.pop()
    });
    loading.dismiss();
  }

  

}
