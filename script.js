document.addEventListener("DOMContentLoaded", () => {
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const authBtn = document.getElementById("auth-btn");
    const authMessage = document.getElementById("auth-message");
    const contactNameInput = document.getElementById("contact-name");
    const contactEmailInput = document.getElementById("contact-email");
    const addContactBtn = document.getElementById("add-contact-btn");
    const contactList = document.getElementById("contact-list");
    const authSection = document.getElementById("auth-section");
    const contactSection = document.getElementById("contact-section");
    const logoutBtn = document.getElementById("logout-btn");
    const searchInput = document.getElementById("search");

    let currentUser = null;

    authBtn.addEventListener("click", registerUser);
    addContactBtn.addEventListener("click", addContact);
    logoutBtn.addEventListener("click", logout);

    function registerUser() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        if (username && password) {
            currentUser = { username, password };
            authSection.style.display = "none";
            contactSection.style.display = "block";
            authMessage.textContent = "";
            loadContacts();
        } else {
            authMessage.textContent = "Por favor, completa todos los campos.";
        }
    }

    function addContact() {
        const name = contactNameInput.value.trim();
        const email = contactEmailInput.value.trim();
        if (name && email) {
            const contacts = getContacts();
            contacts.push({ name, email });
            saveContacts(contacts);
            contactNameInput.value = '';
            contactEmailInput.value = '';
            renderContacts();
        }
    }

    function getContacts() {
        return JSON.parse(localStorage.getItem("contacts")) || [];
    }

    function saveContacts(contacts) {
        localStorage.setItem("contacts", JSON.stringify(contacts));
    }

    function loadContacts() {
        renderContacts();
    }

    function renderContacts() {
        contactList.innerHTML = '';
        const contacts = getContacts();
        contacts.forEach((contact, index) => {
            const li = document.createElement("li");
            li.className = "contact";
            li.innerHTML = `
                <span>${contact.name} - ${contact.email}</span>
                <button onclick="deleteContact(${index})">Eliminar</button>
                <button onclick="editContact(${index})">Editar</button>
            `;
            contactList.appendChild(li);
        });
    }

    window.deleteContact = function(index) {
        const contacts = getContacts();
        contacts.splice(index, 1);
        saveContacts(contacts);
        renderContacts();
    };

    window.editContact = function(index) {
        const contacts = getContacts();
        const contact = contacts[index];
        contactNameInput.value = contact.name;
        contactEmailInput.value = contact.email;

        deleteContact(index); // eliminar el contacto original
    };

    window.searchContact = function() {
        const query = searchInput.value.toLowerCase();
        const contacts = getContacts();
        contactList.innerHTML = '';
        contacts.forEach((contact, index) => {
            if (contact.name.toLowerCase().includes(query) || contact.email.toLowerCase().includes(query)) {
                const li = document.createElement("li");
                li.className = "contact";
                li.innerHTML = `
                    <span>${contact.name} - ${contact.email}</span>
                    <button onclick="deleteContact(${index})">Eliminar</button>
                    <button onclick="editContact(${index})">Editar</button>
                `;
                contactList.appendChild(li);
            }
        });
    };

    function logout() {
        currentUser = null;
        authSection.style.display = "block";
        contactSection.style.display = "none";
        authMessage.textContent = "Sesión cerrada.";
    }
});
