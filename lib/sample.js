/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Sample transaction processor function.
 * @param {org.acme.sample.createCustomer} tx The sample transaction instance.
 * @transaction
 */
function createCustomerTransaction(tx) {


    // Get the Customer record from the tx data
    var newCustomer = tx["newCustomer"];

    return getAssetRegistry('org.acme.sample.Customer')
        .then(function(assetRegistry) {

            // add the asset in the asset registry.
            return assetRegistry.add(newCustomer);

        });
}


/**
 * Sample transaction processor function.
 * @param {org.acme.sample.readCustomer} tx The sample transaction instance.
 * @transaction
 */

function readCustomerTransaction(tx) {

    // get the currentParticipant 
 
    return getAssetRegistry('org.acme.sample.Customer')
        .then(function(assetRegistry) {

            // add the asset in the asset registry.
            return assetRegistry.get(tx.customer.aadhaarId);

        }).then(function(customer) {
            // Process the the vehicle object.
            console.log(customer);
        });

}


/**
 * Sample transaction processor function.
 * @param {org.acme.sample.updateCustomer} tx The sample transaction instance.
 * @transaction
 */

function updateCustomerTransaction(tx) {

    
     var currentParticipant = getCurrentParticipant();
    //now get the name of the bank from the participant JSON data
    var currentBank = currentParticipant.getFullyQualifiedIdentifier();
   
  	var actualBank = tx.customer.bank.getFullyQualifiedIdentifier();
  
    if (currentBank != actualBank)
	      throw new Error('You can not update someone else\'s customer');

  
  	var details = tx["newDetails"];

    // get the currentParticipant 
    var bankNameGiven = details["bank"].getFullyQualifiedIdentifier();//["$identifier"];

	console.log(bankNameGiven);
  console.log(actualBank);
    if (actualBank != bankNameGiven)
        throw new Error('actual bank and the one provided are different');

    if (tx.customer.aadhaarId != details["aadhaarId"])
        throw new Error('aadhaarIds don\'t match');

    tx.customer.firstName = details["firstName"];
    tx.customer.lastName = details["lastName"];
    tx.customer.contactNo = details["contactNo"];
    tx.customer.residence = details["residence"];
    tx.customer.accountNumber = details["accountNumber"];



    return getAssetRegistry('org.acme.sample.Customer')
        .then(function(assetRegistry) {

            // update the asset in the asset registry.
            return assetRegistry.update(tx.customer);

        });

}

/**
 * Sample transaction processor function.
 * @param {org.acme.sample.deleteCustomer} tx The sample transaction instance.
 * @transaction
 */

function deleteCustomerTransaction(tx) {

       var currentParticipant = getCurrentParticipant();
    //now get the name of the bank from the participant JSON data
    var currentBank = currentParticipant.getFullyQualifiedIdentifier();
    console.log(currentBank);
    //console.log(tx["newLoanAsset"]["bank"]["$identifier"]);
	
  	var actualBank = tx.customer.bank.getFullyQualifiedIdentifier();
  
    if (currentBank != actualBank)
     throw new Error('You can not delete another bank\'s customer');


    // Get the Customer record from the tx data

    return getAssetRegistry('org.acme.sample.Customer')
        .then(function(assetRegistry) {

            // add the asset in the asset registry.
            return assetRegistry.remove(tx.customer);

        });
}


/**
 * Sample transaction processor function.
 * @param {org.acme.sample.createAsset} tx The sample transaction instance.
 * @transaction
 */

function createAssetTransaction(tx) {


    var currentParticipant = getCurrentParticipant();
    //now get the name of the bank from the participant JSON data
    var currentBank = currentParticipant.getFullyQualifiedIdentifier();
    console.log(currentBank);
    //console.log(tx["newLoanAsset"]["bank"]["$identifier"]);
	
  	var actualBank = tx.newLoanAsset.bank.getFullyQualifiedIdentifier();
  
    if (currentBank != actualBank)
        throw new Error('You can not create another bank\'s asset');

    // Get the Customer record from the tx data
    var newAsset = tx["newLoanAsset"];

    return getAssetRegistry('org.acme.sample.loanAsset')
        .then(function(assetRegistry) {

            // add the asset in the asset registry.
            return assetRegistry.add(newAsset);

        });
}


/**
 * Sample transaction processor function.
 * @param {org.acme.sample.readAsset} tx The sample transaction instance.
 * @transaction
 */

function readAssetTransaction(tx) {

    return getAssetRegistry('org.acme.sample.loanAsset')
        .then(function(assetRegistry) {

            // add the asset in the asset registry.
            return assetRegistry.get(tx.assetName.loanAssetId);

        }).then(function(requiredAsset) {
            // Process the the vehicle object.
            console.log(requiredAsset);
        });

}


/**
 * Sample transaction processor function.
 * @param {org.acme.sample.updateAsset} tx The sample transaction instance.
 * @transaction
 */

function updateAssetTransaction(tx) {

    if (tx.oldloanAsset.state == "RELEASED") {
        throw new Error('Can not update a released asset ');
    }

	 var currentParticipant = getCurrentParticipant();
    //now get the name of the bank from the participant JSON data
    var currentBank = currentParticipant.getFullyQualifiedIdentifier();   
  
  
	console.log(currentBank);
	var bankNameGiven = tx["newloanAsset"]["bank"].getFullyQualifiedIdentifier();//["$identifier"];

  	console.log(tx.oldloanAsset.bank.getFullyQualifiedIdentifier());
    if (currentBank != tx.oldloanAsset.bank.getFullyQualifiedIdentifier() || currentBank != bankNameGiven)
        throw new Error('You can not update another bank\'s asset');

    var details = tx["newloanAsset"];
    console.log(details);
    console.log(tx.oldloanAsset);
    if (tx.oldloanAsset.loanAssetId != details["loanAssetId"])
        throw new Error('AssetIds do not match');

    tx.oldloanAsset.assetType = details["loanAssetType"];
    tx.oldloanAsset.value = details["value"];
    if (details["value"] > 0) {
        tx.oldloanAsset.state = "CONTROLLED_BY_BANK";
    } else {
        tx.oldloanAsset.state = "RELEASED";
    }
    console.log(tx.oldloanAsset);
    return getAssetRegistry('org.acme.sample.loanAsset')
        .then(function(assetRegistry) {

            // update the asset in the asset registry.
            return assetRegistry.update(tx.oldloanAsset);

        });
}

/**
 * Sample transaction processor function.
 * @param {org.acme.sample.deleteAsset} tx The sample transaction instance.
 * @transaction
 */

function deleteAssetTransaction(tx) {

    // Get the Asset record from the tx data

    return getAssetRegistry('org.acme.sample.loanAsset')
        .then(function(assetRegistry) {

            return assetRegistry.remove(tx.assetName);

        });
}