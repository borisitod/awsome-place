import {Component} from '@angular/core';
import {NgForm} from "@angular/forms";
import {LoadingController, ModalController, ToastController} from "ionic-angular";
import {SetLocationPage} from "../set-location/set-location";
import {Location} from "../../models/location";
import {Geolocation} from '@ionic-native/geolocation';
import {Camera, CameraOptions} from '@ionic-native/camera';


@Component({
    selector: 'page-add-place',
    templateUrl: 'add-place.html',
})
export class AddPlacePage {
    imageUrl = '';

    location: Location = {
        lat: -37.8136,
        lng: 144.9631,
    };

    locationIsSet = false;

    constructor(private modalCtrl: ModalController,
                private geolocation: Geolocation,
                private loadingCtrl: LoadingController,
                private toastCtrl: ToastController,
                private camera: Camera) {
    }

    onSubmit(form: NgForm) {
        console.log(form.value);
    }

    onOpenMap() {
        const modal = this.modalCtrl.create(SetLocationPage, {location: this.location, isSet: this.locationIsSet});
        modal.present();
        modal.onDidDismiss(
            data => {
                if (data) {
                    this.location = data.location;
                    this.locationIsSet = true;
                }
            }
        )
    }

    onLocate() {
        const loader = this.loadingCtrl.create({
            content: 'Getting your location...'
        });
        loader.present();
        this.geolocation.getCurrentPosition()
            .then((location) => {
                loader.dismiss();
                this.location.lat = location.coords.latitude;
                this.location.lng = location.coords.longitude;
                this.locationIsSet = true;

            }).catch((error) => {
            loader.dismiss();
            const toast = this.toastCtrl.create({
                message: 'Could not get your location, please pick it manually!',
                duration: 2500
            });
            toast.present();
        });
    }

    onTakePhoto() {
        this.camera.getPicture({
            encodingType: this.camera.EncodingType.JPEG,
            correctOrientation: true
        })
        .then(imageData => {
            this.imageUrl = imageData;
        })
        .catch(
            err => {
                console.log(err);
            }
        )
    }


}
