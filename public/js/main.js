// Calculate mboile height for styling
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty("--vh", `${vh}px`);

document.getElementById("online-toggle").addEventListener("click", () => {
  document.getElementById("custom-sidebar").classList.toggle("opened");
});
