public with sharing class AccountController {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(String accountType)
    {
        if(accountType == 'All'){
            return [SELECT Id, Name, Owner.Name, Budget__c, Number_Of_Employees__c, Type, Industry, Description, Image_URL__c FROM Account];
        } else {
            return [SELECT Id, Name, Owner.Name, Budget__c, Number_Of_Employees__c, Type, Industry, Description, Image_URL__c FROM Account WHERE Type=:accountType];
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<String> getPicklistValues(){
        List<String> picklistValuesList = new List<String>();
        Schema.DescribeFieldResult fieldResult = Account.Type.getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        for( Schema.PicklistEntry picklistValue : ple){
            picklistValuesList.add(picklistValue.getLabel());
        }
        return picklistValuesList;
    }
}
