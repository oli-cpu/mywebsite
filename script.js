/* =====================================================
   MOBILE MENU
===================================================== */

const menuButton = document.getElementById("menuButton");
const navigation = document.getElementById("navigation");

menuButton.addEventListener("click", () => {
    navigation.classList.toggle("open");
});


/* =====================================================
   TABS
===================================================== */

const tabButtons = document.querySelectorAll("[data-tab]");
const panels = document.querySelectorAll(".tab-panel");

function activateTab(tabName) {

    panels.forEach(panel => {
        panel.classList.toggle(
            "active",
            panel.dataset.panel === tabName
        );
    });

    tabButtons.forEach(button => {
        const isMatch = button.dataset.tab === tabName;

        button.classList.toggle("active", isMatch);

        if (button.tagName === "BUTTON" && button.closest("nav")) {
            button.setAttribute("aria-selected", isMatch);
        }
    });

    navigation.classList.remove("open");

    window.scrollTo({ top: 0, behavior: "instant" });
}

tabButtons.forEach(button => {
    button.addEventListener("click", () => {
        activateTab(button.dataset.tab);
    });
});


/* =====================================================
   CURRENT YEAR
===================================================== */

document.getElementById("year").textContent = new Date().getFullYear();


/* =====================================================
   LIVE LATENCY READOUT
   Small detail matched to the trace panel's animation
   cycle (4.2s) so the number ticks roughly when the
   packet "arrives" at the server hop.
===================================================== */

const latencyEl = document.getElementById("latencyReading");
const finalMsEl = document.getElementById("finalMs");

if (latencyEl && finalMsEl) {

    const tick = () => {

        const base = 23;
        const jitter = (Math.random() * 6 - 3).toFixed(1);
        const value = Math.max(14, (base + Number(jitter))).toFixed(1);

        finalMsEl.textContent = `${value} ms`;
        latencyEl.textContent = `Ø ${value} ms`;

    };

    setInterval(tick, 4200);

}
