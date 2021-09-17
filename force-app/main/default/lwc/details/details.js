import { LightningElement, track, wire } from 'lwc';
import { subscribe, MessageContext } from 'lightning/messageService';
import ACCOUNT_MESSAGE_CHANNEL from '@salesforce/messageChannel/Account__c';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const ORG_NAME ='cunning-raccoon-55x7w9-dev-ed';

export default class Details extends NavigationMixin(LightningElement) {
    @track account = {
        Id: '',
        Name: 'Select account',
        Type: '---------',
        Industry: '---------',
        Budget__c: '---------',
        Description: '---------'
    };

    @wire(MessageContext)
    messageContext;

    subscribeToMessageChannel() {
        this.subscription = subscribe(
            this.messageContext,
            ACCOUNT_MESSAGE_CHANNEL,
            (message) => this.handleMessage(message)
        );
    }

    handleMessage(message) {
        this.account = message;
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    handleClick() {
        if(this.account.Id == ''){
            const evt = new ShowToastEvent({
                title: 'Error',
                message: 'Select account.',
                variant: 'error',
            });
            this.dispatchEvent(evt);
        } else {
            this[NavigationMixin.Navigate]({
                "type": "standard__webPage",
                "attributes": {
                    "url": 'https://' + ORG_NAME + '.lightning.force.com/lightning/r/Account/' + this.account.Id + '/view'
                }
            });
        }
    }
}