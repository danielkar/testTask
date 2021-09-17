import { LightningElement, track, api } from 'lwc';
import staticResourceImage from '@salesforce/resourceUrl/staticResource';

export default class Tile extends LightningElement {
    @api account;
    @track imageURL;
    defaultImage = staticResourceImage + '/staticResources/images/default.jpg';

    tileClick() {
        console.log(this.account);
        const event = new CustomEvent('tileclick', {
            detail: this.account
        });
        this.dispatchEvent(event);
    }

    connectedCallback(){
        if(this.account.Image_URL__c == undefined){
            this.imageURL = this.defaultImage;
        } else {
            this.imageURL = this.account.Image_URL__c;
        }
    }
}