document.addEventListener("DOMContentLoaded", function () {

    /* =========================
       ZMIANA MOTYWU
    ========================== */
    window.changeTheme = function () {
        const theme = document.getElementById("theme-style");

        if (theme.getAttribute("href") === "red.css") {
            theme.setAttribute("href", "green.css");
        } else {
            theme.setAttribute("href", "red.css");
        }
    };

    /* =========================
       UKRYJ / POKAŻ UMIEJĘTNOŚCI
    ========================== */
    window.toggleSkills = function () {
        const section = document.getElementById("skills");

        if (section.style.display === "none") {
            section.style.display = "block";
        } else {
            section.style.display = "none";
        }
    };

    /* =========================
       JSON - DANE CV
    ========================== */
    fetch("data.json")
        .then(response => response.json())
        .then(data => {

            const skillsList = document.getElementById("skillsList");
            const projectsList = document.getElementById("projectsList");

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
        });

    /* =========================
       FORMULARZ
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

        const letters = /^[A-Za-zÀ-ÿĄąĆćĘęŁłŃńÓóŚśŹźŻż]+$/;
        const mail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (name === "") {
            document.getElementById("nameError").textContent = "Podaj imię";
            valid = false;
        }

        if (surname === "") {
            document.getElementById("surnameError").textContent = "Podaj nazwisko";
            valid = false;
        }

        if (email === "") {
            document.getElementById("emailError").textContent = "Podaj e-mail";
            valid = false;
        } else if (!mail.test(email)) {
            document.getElementById("emailError").textContent = "Niepoprawny e-mail";
            valid = false;
        }

        if (message === "") {
            document.getElementById("messageError").textContent = "Podaj wiadomość";
            valid = false;
        }

        if (valid) {
            document.getElementById("successMessage").textContent =
                "Formularz poprawnie wypełniony!";
        }
    });

    /* =========================
       LOCAL STORAGE - NOTATKI
    ========================== */

    let notes = JSON.parse(localStorage.getItem("notes")) || [];

    function saveNotes() {
        localStorage.setItem("notes", JSON.stringify(notes));
    }

    function renderNotes() {
        const list = document.getElementById("notesList");
        list.innerHTML = "";

        notes.forEach((note, index) => {
            const li = document.createElement("li");

            li.innerHTML = `
                ${note}
                <button onclick="deleteNote(${index})">Usuń</button>
            `;

            list.appendChild(li);
        });
    }

    window.addNote = function () {
        const input = document.getElementById("noteInput");
        const value = input.value.trim();

        if (value === "") {
            alert("Wpisz notatkę!");
            return;
        }

        notes.push(value);
        saveNotes();
        renderNotes();

        input.value = "";

        /* WIDOCZNOŚĆ WYSŁANIA */
        alert("Notatka została dodana!");
    };

    window.deleteNote = function (index) {
        notes.splice(index, 1);
        saveNotes();
        renderNotes();

        alert("Notatka usunięta!");
    };

    renderNotes();

});

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

/* FETCH */
fetch("data.json")
.then(response => response.json())
.then(data => loadCVData(data))
.catch(error => {

    loadCVData(fallbackData);
});
