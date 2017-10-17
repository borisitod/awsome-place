import {Component} from '@angular/core';
import {NgForm} from "@angular/forms";
import {LoadingController, ModalController, ToastController} from "ionic-angular";
import {SetLocationPage} from "../set-location/set-location";
import {Location} from "../../models/location";
import {Geolocation} from '@ionic-native/geolocation';
import {Camera} from '@ionic-native/camera';
import {Entry, File, FileError} from '@ionic-native/file';
import {PlacesService} from "../../services/places";

declare var cordova: any;

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
                private camera: Camera,
                private placesService: PlacesService,
                private file: File
                ) {
    }

    onSubmit(form: NgForm) {
        //this.imageUrl = 'http://www.australia.com/content/australia/en_us/places/melbourne/top-10-things-to-do/_jcr_content/image.adapt.761.HIGH.jpg';
        this.placesService.addPlace(form.value.title, form.value.description, this.location, this.imageUrl);
        form.reset();
        this.location = {
            lat: -37.8136,
            lng: 144.9631,
        },
        this.imageUrl = '';
        this.locationIsSet = false;
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
            //destinationType: this.camera.DestinationType.DATA_URL,
            correctOrientation: true
        })
        .then(imageData => {
            const currentName = imageData.replace(/^.*[\\\/]/,'');
            const path = imageData.replace(/[^\/]*$/, '');
            const newFileName = new Date().getUTCMilliseconds() + '.jpg';
            this.file.moveFile(path, currentName, cordova.file.dataDirectory, newFileName)
                .then(
                    (data: Entry) => {
                        this.imageUrl = data.nativeURL;
                        this.camera.cleanup();
                        //this.file.removeFile(path, currentName);
                    }
                )
                .catch(
                    (err: FileError)=>{
                        this.imageUrl = '';
                        const toast = this.toastCtrl.create({
                            message: 'Could not save the image. ' + err,
                            duration: 2000
                        })
                        toast.present();
                        this.camera.cleanup();
                    }
                )
            //this.imageUrl = "data:image/jpeg;base64," + imageData;
        })
        .catch(
            err => {
                const toast = this.toastCtrl.create({
                    message: 'Could not take the image. Please try again',
                    duration: 2000
                })
                toast.present();
            }
        )
    }


}
