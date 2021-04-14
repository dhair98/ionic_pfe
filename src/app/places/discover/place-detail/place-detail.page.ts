import { AuthService } from './../../../auth/auth.service';
import { BookingService } from './../../../bookings/booking.service';
import { Subscription } from 'rxjs';
import { CreateBookingComponent } from './../../../bookings/create-booking/create-booking.component';
import { Place } from './../../place.model';
import { PlacesService } from './../../places.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActionSheetController, ModalController, NavController, LoadingController } from '@ionic/angular';

@Component({
    selector: 'app-place-detail',
    templateUrl: './place-detail.page.html',
    styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {

    place: Place;
    isBookable = false;
    private placesSub: Subscription;

    constructor(
        private modalCtrl: ModalController,
        private route: ActivatedRoute,
        private navCtrl: NavController,
        private placesService: PlacesService,
        private actionSheetCtrl: ActionSheetController,
        private bookingService: BookingService,
        private loadingCtrl: LoadingController,
        private authService: AuthService) { }


    ngOnInit() {
        this.route.paramMap.subscribe(paramMap => {
            if (!paramMap.has('placeId')) {
                this.navCtrl.navigateBack('/places/tabs/discover');
                return;
            }

            this.placesSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe(place => {
                this.place = place;
                this.isBookable= place.userId !== this.authService.userId;
            });
        })
    }

    onBookPlace() {
        this.actionSheetCtrl.create({
            header: 'Choose an Action',
            buttons: [
                {
                    text: 'Select Date', handler: () => {
                        this.openBookingModal('select')
                    }
                },
                {
                    text: 'Random Date', handler: () => {
                        this.openBookingModal('random')
                    }
                },
                { text: 'Cancel', role: 'cancel' }
            ]
        }).then(actionSheetEl => {
            actionSheetEl.present();
        });


    }

    openBookingModal(mode: 'select' | 'random') {
        this.modalCtrl.create({ component: CreateBookingComponent, componentProps: { selectedPlace: this.place, selectedMode: mode } })
            .then(modalEl => {
                modalEl.present();
                return modalEl.onDidDismiss()
            })
            .then(resultData => {
                if (resultData.role === 'confirm') {
                    this.loadingCtrl.create({
                        message: 'Booking place...'
                    }).then(loadingEl => {
                        loadingEl.present();
                        const data = resultData.data.bookingData;
                        this.bookingService.addBooking(
                            this.place.id,
                            this.place.title,
                            this.place.imageUrl,
                            data.firstName,
                            data.lastName,
                            data.guestNumber,
                            data.startDate,
                            data.endDate).subscribe(() => {
                                loadingEl.dismiss();
                            });
                    })

                }
            })
    }

    ngOnDestroy(): void {
        if (this.placesSub) {
            this.placesSub.unsubscribe();
        }
    }

}
