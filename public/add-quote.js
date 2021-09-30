
const submitButton = document.getElementById('submit-quote');
const newQuoteContainer = document.getElementById('new-quote');
const toggleButton = document.getElementById('toggle');

let quotesType = 'computer-quotes';

toggleButton.addEventListener('click', () => {
  if(quotesType === 'computer-quotes') {
    quotesType = 'funny-quotes';
  } else if (quotesType === 'funny-quotes') {
    quotesType = 'computer-quotes';
  }
  toggleButton.innerHTML = quotesType;
})

submitButton.addEventListener('click', () => {
  const id = document.getElementById('quote-id').value;
  const quote = document.getElementById('quote').value;
  const person = document.getElementById('person').value;

  let url;
  let method;
  let word;

  if (id) {
    if (id && (quote || person)) {
      url = `/api/${quotesType}/${id}?quote=${quote}&person=${person}`;
      method = 'PUT';
      word = 'edited';
    } else {
      url = `/api/${quotesType}/${id}`;
      method = 'DELETE';
      word = 'deleted';
    }
    
  } else {
    url = `/api/${quotesType}/?quote=${quote}&person=${person}`;
    method = 'POST';
    word = 'added';
  }

  fetch(url, {
    method: method,
  })
  .then(response => {
    if (response.ok) {
      return response.json() 
    }
    throw new Error('Request Failed. Please Enter a Valid ID.');
  }, networkError => console.log(networkError.message))
  .then(({quote}) => {
    const newQuote = document.createElement('div');
    newQuote.innerHTML = `
    <h3>Congrats, your quote was ${word}!</h3>
    <div class="quote-text">${quote.quote}</div>
    <div class="attribution">- ${quote.person}</div>
    <p>Go to the <a href="index.html">home page</a> to request and view all quotes.</p>
    `
    newQuoteContainer.appendChild(newQuote);
  })
  .catch(err => {
    const errMsg = document.createElement('div');
    errMsg.innerHTML = `<h3 id='error'>${err.message}</h3>`
    newQuoteContainer.appendChild(errMsg);
  } )
});
