import { LightningElement, track, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';
import getPicklistValues from '@salesforce/apex/AccountController.getPicklistValues';
import { publish, MessageContext } from 'lightning/messageService';
import ACCOUNT_MESSAGE_CHANNEL from '@salesforce/messageChannel/Account__c';

export default class Selector extends LightningElement {
    @track typeValue = 'All';
    @track accounts;
    typeOptions = [];
    isEmpty = false;
    error;

    @wire(getAccounts, { accountType: '$typeValue' })
    wiredAccounts({ error, data }) {
        if (data) {
            this.accounts = data;
            this.error = undefined;
            if(data.length == 0){
                this.isEmpty = true;
            } else {
                this.isEmpty = false;
            }
        } else if (error) {
            this.error = error;
            this.accounts = undefined;
        }
    }

    @wire(getPicklistValues)
    wiredTypes({ error, data }) {
        if (data) {
            for(let i=0; i<data.length; i++) {
                this.typeOptions = [...this.typeOptions, {value: data[i], label: data[i]}];                             
            }
            this.typeOptions = [...this.typeOptions, {value: 'All', label: 'All Types'}]; 
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.typeOptions = undefined;
        }
    }

    @wire(MessageContext)
    messageContext;

    handleAccountTypeChange(evt) {
        this.typeValue = evt.detail.value;
    }

    handleAccountSelected(evt) {
        const acc = { 
            Id: evt.detail.Id,
            Name: evt.detail.Name,
            Type: evt.detail.Type,
            Industry: evt.detail.Industry,
            Budget__c: evt.detail.Budget__c + '$',
            Description: evt.detail.Description
        };
        publish(this.messageContext, ACCOUNT_MESSAGE_CHANNEL, acc);
    }
}