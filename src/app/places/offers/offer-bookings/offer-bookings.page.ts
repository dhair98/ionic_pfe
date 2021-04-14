import { Subscription } from 'rxjs';
import { PlacesService } from './../../places.service';
import { Place } from './../../place.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
    selector: 'app-offer-bookings',
    templateUrl: './offer-bookings.page.html',
    styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit, OnDestroy {

    place: Place;
    private placesSub: Subscription;

    constructor(
        private route: ActivatedRoute,
        private navCtrl: NavController,
        private placesService: PlacesService
    ) { }

    ngOnInit() {
        this.route.paramMap.subscribe(paramMap => {
            if (!paramMap.has('placeId')) {
                this.navCtrl.navigateBack('/places/tabs/offers');
                return;
            }
            this.placesSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe(place=>{
                this.place = place;
            });
        });
    }

    ngOnDestroy(): void {
        if(this.placesSub){
            this.placesSub.unsubscribe();
        }
    }

}
