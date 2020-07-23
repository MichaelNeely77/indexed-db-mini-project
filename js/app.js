let DB;

const form = document.querySelector('form'),
    petName = document.querySelector('#pet-name'),
    ownerName = document.querySelector('#owner-name'),
    phone = document.querySelector('#phone'),
    date = document.querySelector('#date'),
    hour = document.querySelector('#hour'),
    symptoms = document.querySelector('#symptoms'),
    appointments = document.querySelector('#appointments'),
    appointmentTitle  = document.querySelector('#appointment-title');

document.addEventListener('DOMContentLoaded', () => {
    // create the database
    let AppointmentDB = window.indexedDB.open('appointments', 1);

    // if there is an error display 
    AppointmentDB.onerror = function() {
        console.log('There was an error');
    }
    // if everything is fine assign the result to the instance
    AppointmentDB.onsuccess = function() {
        // console.log('Database Ready');

        // Save the result
         DB = AppointmentDB.result;

        //  display the appointments
        displayAppointments();
    }

    // This method runs once (great for the schema)
    AppointmentDB.onupgradeneeded = function(e){
        // The event will be the database
        let db  = e.target.result;

        // Create an objexct store
        // Keypath is going to  be nt eh indeces
        let objectStore = db.createObjectStore('appointments', {keyPath: 'key', autoIncrement: true } );

        // create index )1) field name 2) keypath 3) options
        objectStore.createIndex('petname', 'petname', { unique: false} );
        objectStore.createIndex('ownername', 'ownername', { unique: false} );
        objectStore.createIndex('phone', 'phone', { unique: false} );
        objectStore.createIndex('date', 'date', { unique: false} );
        objectStore.createIndex('hour', 'hour', { unique: false} );
        objectStore.createIndex('symptoms', 'symptoms', { unique: false} );



        console.log("Database ready and fields created");

    }

    form.addEventListener('submit', addAppointment);

    function addAppointment(e) {
        e.preventDefault();

        // create a new object
        let newAppointment = {
            petname : petName.value,
            ownername : ownerName.value,
            phone : phone.value,
            date : date.value,
            hour : hour.value,
            symptoms : symptoms.value
        }

        // Insert the oblect to the DB
        let transaction = DB.transaction(['appointments'], 'readwrite');
        let objectStore = transaction.objectStore('appointments');

        console.log(objectStore);

        let request = objectStore.add(newAppointment);

        console.log(request);

        request.onsuccess = () => {
            form.reset();
        }

        transaction.oncomplete = () => {
            console.log('New Appointment added');
            displayAppointments();
        }

        transaction.onerror = () => {
            console.log('There was an error, try again');
        }
    }

    function displayAppointments() {
        // clears previous result
        while(appointments.firstChild) {
            appointments.removeChild(appointments.firstChild);
        }

        // create teh object store
        let objectStore = DB.transaction('appointments').objectStore('appointments');

        objectStore.openCursor().onsuccess = function(e) {
            let cursor = e.target.result;

            if(cursor) {
                let appointmentHTML = document.createElement('li');
                appointmentHTML.setAttribute('data-apointment-id', cursor.value.key);
                appointmentHTML.classList.add('list-group-item');

                appointmentHTML.innerHTML = `
                    <p class="font-weight-bold">Pet Name: 
                        <span class="font-weight-normal">
                        ${cursor.value.petname}
                        </span>
                    </p>
                    <p class="font-weight-bold">Owner Name: 
                    <span class="font-weight-normal">
                    ${cursor.value.ownername}
                    </span>
                    </p>
                    <p class="font-weight-bold">Phone: 
                    <span class="font-weight-normal">
                    ${cursor.value.phone}
                    </span>
                    </p>
                    <p class="font-weight-bold">Date: 
                    <span class="font-weight-normal">
                    ${cursor.value.date}
                    </span>
                    </p>
                    <p class="font-weight-bold">Timee: 
                    <span class="font-weight-normal">
                    ${cursor.value.hour}
                    </span>
                    </p>
                    <p class="font-weight-bold">Symptoms: 
                    <span class="font-weight-normal">
                    ${cursor.value.symptoms}
                    </span>
                    </p>
                    `;

                appointments.appendChild(appointmentHTML);

                cursor.continue();
            } else {
                if(!appointments.firstChild) {
                    appointmentTitle.textContent = 'Add a New Appointment';
                    noAppointment = document.createElement('p');
                    noAppointment.classList.add('text-center');
                    noAppointment.textContent = 'No results found';
                    appointments.appendChild(noAppointment);
                } else {
                    appointmentTitle.textContent = 'Manage Your Appointments';

                }
            }
        }
    }
});

