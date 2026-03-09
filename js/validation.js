const STORAGE_KEY = 'storefront_users';
let editingIndex = -1;

function updateField(formField, errorElement, isValid, errorMessage) {
    if (isValid) {
        formField.classList.add('is-valid');
        formField.classList.remove('is-invalid');

        errorElement.textContent = "";
        errorElement.classList.remove('show');
    }
    else {
        formField.classList.add('is-invalid');
        formField.classList.remove('is-valid');

        errorElement.textContent = errorMessage;
        errorElement.classList.add('show');
    }
}


function validateField(formField) {
    const fieldId = formField.id;
    const value = formField.value.trim();
    const errorElement = document.getElementById(fieldId + 'Error');

    let isValid = true;
    let errorMessage = "";



    if (formField.hasAttribute('required') && value === '') {
        isValid = false;
        errorMessage = 'This field is required';
    }

    if (isValid && value !== '') {
        switch (fieldId) {
            case 'firstName':
            case 'lastName':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be atleast 2 characters';
                }
                break;

            case 'email':
                const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                if (!emailPattern.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email';
                }
        }
    }

    updateField(formField, errorElement, isValid, errorMessage);

    return isValid;
}

function validateForm(form) {
    // const form = document.getElementById("signupForm");
    let isValid = true;

    const formInputs = form.querySelectorAll('input, select');

    formInputs.forEach(formField => {
        if (!validateField(formField)) {
            isValid = false;
        }
    });

    return isValid;
}

function getFormData(form) {
    const formData = new FormData(form);

    const data = {};

    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    return {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        gradeLevel: data.gradeLevel,
        organization: data.organization,
        creationDate: new Date().toISOString()
    };
}

function saveFormDataToLocalStorage(formData) {
    try {
        const existingUsers = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        existingUsers.push(formData);
        const usersJSON = JSON.stringify(existingUsers);
        localStorage.setItem(STORAGE_KEY, usersJSON);

        console.log('Saved successfully!');
        return true;
    }
    catch (error) {
        console.log('Error saving to local storage:', error);
        return false;
    }
}

function displayAllUsers() {
    const userCardContainer = document.getElementById('userCard');
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    if (users.length === 0) {
        userCardContainer.innerHTML = '<p>No users registered yet.</p>';
        return;
    }

    let cardsHtml = '';

    users.forEach((userData, index) => {
        cardsHtml += `
            <div class="card">
                <div>
                    <h5>${userData.firstName} ${userData.lastName}</h5>
                    <p class="card-text">Email: ${userData.email}</p>
                    <p class="card-text">Phone: ${userData.phone}</p>
                    <p class="card-text">Grade Level: ${userData.gradeLevel}</p>
                    <p class="card-text">Organization: ${userData.organization}</p>
                    <button class="btn btn-warning me-2" onclick="editUser(${index})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteUser(${index})">Delete User</button>
                </div>
            </div>
        `;
    });

    userCardContainer.innerHTML = cardsHtml;
}

function deleteUser(index) {
    try {
        const users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

        if (index >= 0 && index < users.length) {
            users.splice(index, 1);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
            console.log('User deleted successfully!');
        }
        else {
            console.log('Invalid user index');
        }

        displayAllUsers();
    }
    catch (error) {
        console.log('Error deleting user:', error);
    }
}

function handleSignupSubmit(event) {
    event.preventDefault();

    const form = document.getElementById("signupForm");
    if (!validateForm(form)) { return; }

    const formData = getFormData(form);
    const messageElement = document.getElementById('signupMessage');
    const messageText = document.getElementById('signupMessageText');

    let success = false;
    if (editingIndex !== -1) {
        try {
            const users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            formData.creationDate = users[editingIndex].creationDate;
            users[editingIndex] = formData;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
            success = true;
        } catch (error) { console.log('Error updating user:', error); }
        editingIndex = -1;
        document.querySelector('#signupForm button[type="submit"]').textContent = 'SignUp';
    } else {
        success = saveFormDataToLocalStorage(formData);
    }

    if (success) {
        messageText.textContent = ' You successfully signed up!';
        messageElement.classList.remove('alert-danger');
        messageElement.classList.add('alert-success');
    } else {
        messageText.textContent = ' Sign up failed!';
        messageElement.classList.remove('alert-success');
        messageElement.classList.add('alert-danger');
    }

    // Reset so animation replays each time
    messageElement.classList.add('d-none');
    messageElement.classList.remove('show');

    requestAnimationFrame(() => {
        messageElement.classList.remove('d-none');
        messageElement.classList.add('show');
    });

    displayAllUsers();
}

function editUser(index) {
    const users = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const u = users[index];
    if (!u) return;

    document.getElementById('firstName').value = u.firstName;
    document.getElementById('lastName').value = u.lastName;
    document.getElementById('email').value = u.email;
    document.getElementById('phone').value = u.phone || '';
    document.getElementById('gradeLevel').value = u.gradeLevel;
    document.getElementById('organization').value = u.organization;

    editingIndex = index;
    document.querySelector('#signupForm button[type="submit"]').textContent = 'Save Changes';
    document.getElementById('signupForm').scrollIntoView({ behavior: 'smooth' });
}

function initilizeApp() {
    console.log('Setting Everything');
    displayAllUsers();

    document.getElementById('signupMessageClose').addEventListener('click', () => {
        const messageElement = document.getElementById('signupMessage');
        messageElement.classList.remove('show');
        messageElement.classList.add('d-none');
    });
}

document.getElementById('signupForm').addEventListener('submit', handleSignupSubmit);
document.addEventListener('DOMContentLoaded', initilizeApp);