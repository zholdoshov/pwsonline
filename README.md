# pwsonline

This is the main project for the foreign students of PWS course
Academic year 2020/21

# passing course extensions

* creating of new user of the system (for 4 or B)

(bank employee) creating new object in credentials collection, containing appropriate person_id, randomly generated password, and role which should be choosen using combobox or sth similar; every bank employee can know the password of every client but only if it is randomly generated; (bank client) every bank client can change his/her password.

* history of transfers (for 4 or B)

(back client) the view should include also two extra columns: amount before and amount after (IMPORTANT: they should be amounts of our account, NOT account of our participant!); avoid to display bank employees in the combobox selecting recipient of the transfer.

* filtering of persons (for 5 or A)

(back employee) the list of all persons should by dynamically filtered by text field - contents of the field is a request to display only such objects which contains the phrase in the first or last name.

* transfer is possible only to known persons - previously used (for 5 or A)

(bank client) to make a transfer to new person (which was not recipient of our earlier transfers) you have to enter his/her bank account number (let's assume that bank account number = _id of person); if you would like to make the next transfer to this person, you can select the person from the combobox of our past recipients.

* groups of users (for 5 or A)

(bank employee) he/she can assign every bank client to ONE or MORE groups; he/she has an interface to create/modify/delete groups (e.g. teachers, students, staff etc.); he/she has also COMFORTABLE interface to control belonging to the group; in other words: every bank client can belong to ONE or MORE groups and it can be assigned by a bank employee.
