const form = document.getElementById('contact-form');
const statusEl = document.getElementById('form-status');
const loadedInput = document.getElementById('loadedAt');
//Records the exact milisecond time of when the page is first loading 
let formLoadedAt = Date.now()
if(loadedInput){
  loadedInput.value = formLoadedAt;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  statusEl.textContent = '';
  statusEl.className = 'form-status';

  const data = Object.fromEntries(new FormData(form));

  try {
    const response = await fetch('/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    if (!result.ok) {
      throw new Error(result.error || 'Something went wrong.');
    }

    form.reset();
    //Resets the stopwatch after form.reset() clears the inputs so when an actual user sends another message, the timer will start fresh
    formLoadedAt = Date.now()
    if(loadedInput){
      loadedInput.value = formLoadedAt
    }
    statusEl.textContent = "Thanks, we'll be in touch within one business day.";
    statusEl.classList.add('form-status--success');
  } catch (error) {
    statusEl.textContent = error.message || 'Something went wrong. Please email hello@calicomedia.co instead.';
    statusEl.classList.add('form-status--error');
  } finally {
    button.disabled = false;
  }
});
