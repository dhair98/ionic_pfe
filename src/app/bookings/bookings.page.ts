import { Subscription } from 'rxjs';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Booking } from './booking.model';
import { BookingService } from './booking.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-bookings',
    templateUrl: './bookings.page.html',
    styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {

    bookings: Booking[];
    private bookingSub: Subscription;


    constructor(private bookingService: BookingService, private loadingCtrl: LoadingController) { }

    ngOnInit() {
        this.bookingSub = this.bookingService.bookings.subscribe(bookings => {
            this.bookings = bookings;
        });
    }

    onCancelBooking(bookingId: string, slidingItem: IonItemSliding) {
        slidingItem.close();
        this.loadingCtrl.create({
            message: 'Cancelling Booking...'
        }).then(loadingEl => {
            loadingEl.present();
            this.bookingService.cancelBooking(bookingId).subscribe(() => {
                loadingEl.dismiss();
            });
        })
    }


    ngOnDestroy(): void {
        if (this.bookingSub) {
            this.bookingSub.unsubscribe();
        }
    }

}
