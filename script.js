'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');


const renderCountry = function(data, className =''){
  const html = `
    <article class="country ${className}">
      <img class="country__img" src="${data.flags.svg}" />
      <div class="country__data">
        <h3 class="country__name">${data.name.common}</h3>
        <h4 class="country__region">${data.region}</h4>
        <p class="country__row"><span>👫</span>${(
          +data.population / 1000000
        ).toFixed(1)}</p>
        <p class="country__row"><span>🗣️</span>${Object.values(
          data.languages
        ).join(', ')}</p>
        <p class="country__row"><span>💰</span>${Object.keys(
          data.currencies
        ).join(', ')}</p>
      </div>
    </article>
  `;

  countriesContainer.insertAdjacentHTML('beforeend', html);
}

const renderError = function(msg){
  countriesContainer.insertAdjacentText('beforeend', msg)
}

const getJSON = function (url, errorMsg = 'Something went wrong') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);

    return response.json();
  });
};

const getCountryData = function(country) {
  getJSON(`https://restcountries.com/v3.1/name/${country}`, 'Country not found')
  
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0].borders[0];
      if (!neighbour) throw new Error ("No neighbour found");

      return getJSON(`https://restcountries.com/v3.1/alpha/${neighbour}`, 'Country not found');
    })
    .then(data => renderCountry(data[0], 'neighbour'))
    .catch(err => {
      console.log(`${err}`);
      renderError( `something went wrong 🤦‍♀️🤦‍♀️ ${err.message}. Try again`)
    })
    .finally(() =>{
      countriesContainer.style.opacity = 1;
    })
};

btn.addEventListener('click', function(){
  getCountryData('pakistan')
})




