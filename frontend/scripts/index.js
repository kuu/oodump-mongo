const importButton = document.querySelector('#import');
const contentsDiv = document.querySelector('#contents');
// const heroUnit = document.querySelector('.hero-unit');

const spinner = new Spinner().spin();
const overlay = document.createElement('div');

overlay.classList.add('overlay');

function toggleLoading(loading) {
  if (loading) {
    document.body.appendChild(overlay);
    contentsDiv.appendChild(spinner.el);
  } else {
    contentsDiv.removeChild(spinner.el);
    document.body.removeChild(overlay);
  }
}

importButton.addEventListener('click', () => {
  toggleLoading(true);
  fetch('/import')
  .then(response => {
    toggleLoading(false);
    if (response.status === 200) {
      location.href = '/label/root';
    } else {
      contentsDiv.innerHTML = `Import failed (${response.status} "${response.message}")`;
    }
  });
}, false);
