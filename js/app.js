let DB;

const form = document.querySelector('form'),
    petName = document.querySelector('#pet-name'),
    ownerName = document.querySelector('#owner-name'),
    phone = document.querySelector('#phone'),
    date = document.querySelector('#date'),
    hour = document.querySelector('#hour'),
    symptoms = document.querySelector('#symptoms'),
    apppointements = document.querySelector('#appointments'),
    appintmentTitle  = document.querySelector('#appointment-title');

document.addEventListener('DOMContentLoaded', () => {
    // create the database
    let AppointmentsDB = window.indexedDB.open('appointments', 1);

    // if there is an error display 
    AppointmentsDB.onerror = function() {
        console.log('There was an error');
    }
    // if everything is fine assign the result to the instance
    AppointmentsDB.onsuccess = function() {
        console.log('Database Ready');

        // Save the result
         DB = AppointmentsDB.result;
    }

   
});