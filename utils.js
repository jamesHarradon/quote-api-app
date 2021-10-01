const getRandomElement = arr => {
  
  return arr[Math.floor(Math.random()*arr.length)];
};

const getQuoteById = (paramId, arr) => {
  return arr.find(quote => quote.id === parseInt(paramId))
};

const getIndexById = (paramId, arr) => {
  return arr.findIndex(quote => quote.id === parseInt(paramId));
};

// checks if id is available, if not id is array length +1;
const idFree = (arr) => {
  let isFree = false;
  let newId;
  for (let i = 1; i < arr.length; i++) {
    if(getIndexById(i, arr) === -1) {
      isFree = true;
      newId = i;
    } 
  }
  if (isFree) {
    return newId;
  } else {
    return arr.length+1;
  }
}

module.exports = {
  getRandomElement,
  getQuoteById,
  getIndexById,
  idFree
};
