document.body.addEventListener('mouseover', (e) => {
  const el = e.target.closest('a');
  if (el && el.href) {
    console.log("Detected link:", el.href);
    // Here we'll call backend or show popup later
  }
});

