document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "http://localhost:3000/api";

    /* =========================
       ZMIANA MOTYWU
    ========================== */
    window.changeTheme = function () {
        const theme = document.getElementById("theme-style");
        theme.setAttribute("href", theme.getAttribute("href") === "red.css" ? "green.css" : "red.css");
    };

    /* =========================
       UKRYJ / POKAŻ UMIEJĘTNOŚCI
    ========================== */
    window.toggleSkills = function () {
        const section = document.getElementById("skills");
        section.style.display = section.style.display === "none" ? "block" : "none";
    };

    /* =========================
       FETCH - DANE CV Z BACKENDU
    ========================== */
    function loadCVData(data) {
        const skillsList = document.getElementById("skillsList");
        const projectsList = document.getElementById("projectsList");
        skillsList.innerHTML = "";
        projectsList.innerHTML = "";

        data.skills.forEach(skill => {
            const li = document.createElement("li");
            li.textContent = skill;
            skillsList.appendChild(li);
        });

        data.projects.forEach(project => {
            const li = document.createElement("li");
            li.textContent = project;
            projectsList.appendChild(li);
        });
    }

    fetch(`${API_URL}/cv-data`)
        .then(response => response.json())
        .then(data => loadCVData(data))
        .catch(error => console.error("Błąd ładowania CV:", error));

    /* =========================
       FORMULARZ - WYSYŁANIE DO BAZY
    ========================== */
    const form = document.getElementById("contactForm");

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        let valid = true;

        let name = document.getElementById("name").value.trim();
        let surname = document.getElementById("surname").value.trim();
        let email = document.getElementById("email").value.trim();
        let message = document.getElementById("message").value.trim();

        document.querySelectorAll("small").forEach(el => el.textContent = "");
        document.getElementById("successMessage").textContent = "";

        const mail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (name === "") { document.getElementById("nameError").textContent = "Podaj imię"; valid = false; }
        if (surname === "") { document.getElementById("surnameError").textContent = "Podaj nazwisko"; valid = false; }
        if (email === "") { document.getElementById("emailError").textContent = "Podaj e-mail"; valid = false; } 
        else if (!mail.test(email)) { document.getElementById("emailError").textContent = "Niepoprawny e-mail"; valid = false; }
        if (message === "") { document.getElementById("messageError").textContent = "Podaj wiadomość"; valid = false; }

        if (valid) {
            // Відправка на бекенд
            fetch(`${API_URL}/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, surname, email, message })
            })
            .then(res => res.json())
            .then(data => {
                document.getElementById("successMessage").textContent = "Wiadomość wysłana do bazy!";
                form.reset();
            })
            .catch(err => console.error("Błąd:", err));
        }
    });

    /* =========================
       NOTATKI - BAZA DANYCH ZAMIAST LOCALSTORAGE
    ========================== */
    function fetchNotes() {
        fetch(`${API_URL}/notes`)
            .then(res => res.json())
            .then(notes => renderNotes(notes))
            .catch(err => console.error("Błąd ładowania notatek:", err));
    }

    function renderNotes(notes) {
        const list = document.getElementById("notesList");
        list.innerHTML = "";
        notes.forEach(note => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${note.content}
                <button onclick="deleteNote(${note.id})">Usuń</button>
            `;
            list.appendChild(li);
        });
    }

    window.addNote = function () {
        const input = document.getElementById("noteInput");
        const value = input.value.trim();

        if (value === "") { alert("Wpisz notatkę!"); return; }

        fetch(`${API_URL}/notes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: value })
        })
        .then(() => {
            fetchNotes();
            input.value = "";
            alert("Notatka zapisana w bazie!");
        });
    };

    window.deleteNote = function (id) {
        fetch(`${API_URL}/notes/${id}`, { method: "DELETE" })
        .then(() => {
            fetchNotes();
            alert("Notatka usunięta z bazy!");
        });
    };

    // Завантаження нотаток при запуску сторінки
    fetchNotes();
});