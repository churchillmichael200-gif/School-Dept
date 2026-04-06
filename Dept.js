// NAV TOGGLE
const toggle = document.getElementById("nav-toggle");
const nav = document.getElementById("nav-list");

toggle.onclick = () => {
    nav.classList.toggle("active");
};

// VIEW ALL COURSES BUTTON
document.getElementById("view-all").onclick = () => {
    window.location.href = "Course.html";
};


