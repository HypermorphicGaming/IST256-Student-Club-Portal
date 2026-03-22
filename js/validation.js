let editingIndex = -1;

// Page-aware configuration
const getPageConfig = () => {
  const isEventsPage = window.location.pathname.includes('manageEvents');
  return {
    storageKey: isEventsPage ? 'club_events' : 'club_users',
    messages: {
      emptyState: isEventsPage ? 'No events added yet.' : 'No users registered yet.',
      saveSuccess: isEventsPage ? 'Event details saved successfully.' : 'User details saved successfully.',
      saveError: isEventsPage ? 'Unable to save event details.' : 'Unable to save user details.'
    }
  };
};

let pageConfig = null;

function updateField(formField, errorElement, isValid, errorMessage) {
    if (isValid) {
        formField.classList.add('is-valid');
        formField.classList.remove('is-invalid');

        if (errorElement) {
            errorElement.textContent = "";
            errorElement.classList.remove('show');
        }
    }
    else {
        formField.classList.add('is-invalid');
        formField.classList.remove('is-valid');

        if (errorElement) {
            errorElement.textContent = errorMessage;
            errorElement.classList.add('show');
        }
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
        const existingUsers = JSON.parse(localStorage.getItem(pageConfig.storageKey)) || [];
        existingUsers.push(formData);
        const usersJSON = JSON.stringify(existingUsers);
        localStorage.setItem(pageConfig.storageKey, usersJSON);

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
    if (!userCardContainer) {
        return;
    }

    const users = JSON.parse(localStorage.getItem(pageConfig.storageKey)) || [];

    if (users.length === 0) {
        userCardContainer.innerHTML = `<p>${pageConfig.messages.emptyState}</p>`;
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
        const users = JSON.parse(localStorage.getItem(pageConfig.storageKey)) || [];

        if (index >= 0 && index < users.length) {
            users.splice(index, 1);
            localStorage.setItem(pageConfig.storageKey, JSON.stringify(users));
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
    form.classList.add('was-validated');

    if (!validateForm(form)) { return; }

    const formData = getFormData(form);
    const messageElement = document.getElementById('signupMessage');
    const messageText = document.getElementById('signupMessageText');

    let success = false;
    if (editingIndex !== -1) {
        try {
            const users = JSON.parse(localStorage.getItem(pageConfig.storageKey)) || [];
            formData.creationDate = users[editingIndex].creationDate;
            users[editingIndex] = formData;
            localStorage.setItem(pageConfig.storageKey, JSON.stringify(users));
            success = true;
        } catch (error) { console.log('Error updating user:', error); }
        editingIndex = -1;
        document.querySelector('#signupForm button[type="submit"]').textContent = 'Add User';
    } else {
        success = saveFormDataToLocalStorage(formData);
    }

    if (success) {
        messageText.textContent = ' ' + pageConfig.messages.saveSuccess;
        messageElement.classList.remove('alert-danger');
        messageElement.classList.add('alert-success');
    } else {
        messageText.textContent = ' ' + pageConfig.messages.saveError;
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
    const users = JSON.parse(localStorage.getItem(pageConfig.storageKey)) || [];
    const u = users[index];
    const e = users[index];
    if (!u) return;

    if (pageConfig.storageKey === 'club_users') {
        document.getElementById('firstName').value = u.firstName;
        document.getElementById('lastName').value = u.lastName;
        document.getElementById('email').value = u.email;
        document.getElementById('phone').value = u.phone || '';
        document.getElementById('gradeLevel').value = u.gradeLevel;
        document.getElementById('organization').value = u.organization;
    } else {
        document.getElementById('eventName').value = e.eventName;
        document.getElementById('eventCategory').value = e.eventCategory;
        document.getElementById('eventDuration').value = e.eventDuration || '';
        document.getElementById('admissionFee').value = e.admissionFee || '';
        document.getElementById('locationRoomNumber').value = e.locationRoomNumber;
}
    editingIndex = index;
    document.querySelector('#signupForm button[type="submit"]').textContent = 'Save Changes';
    document.getElementById('signupForm').scrollIntoView({ behavior: 'smooth' });
}

function initializeApp() {
    console.log('Setting Everything');
    displayAllUsers();
}

document.addEventListener('DOMContentLoaded', () => {
    pageConfig = getPageConfig();
    const signupForm = document.getElementById('signupForm');

    if (signupForm) {
        signupForm.addEventListener('submit', handleSignupSubmit);
        signupForm.addEventListener('reset', () => {
            editingIndex = -1;
            document.querySelector('#signupForm button[type="submit"]').textContent = 'Add User';
        });
    }

    initializeApp();
    $('#searchInput').on('keyup', function () {
    const value = $(this).val().toLowerCase();
    const data = JSON.parse(localStorage.getItem(pageConfig.storageKey)) || [];

    const filtered = data.filter(item =>
        Object.values(item).some(val =>
            String(val).toLowerCase().includes(value)
        )
    );

    renderData(filtered);
    });
});