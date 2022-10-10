// Getting elements from DOM
let fetchStarshipsBtn = document.getElementById('fetch'),
    sortStarshipsDropdown = document.getElementById('sort'),
    starshipData = document.getElementById('starshipData'),
    starshipsArray = [];

// Fetch Startship data
const fetchAllStarships = async () => {
   fetchStarshipsBtn.setAttribute('disabled', true);
   await requestDataFromUrl('https://swapi.dev/api/starships/');
}
const requestDataFromUrl = async (url) => {
   let responseData = await fetch(url)
         .then(response => {
            return response.json();
         }).catch((error) => {
            console.error(`Unable to fetch data`);
         });
   if (responseData) {
      fetchStarships(responseData);
   }
}
const fetchStarships = async (responseData) => {
   // Add startship to array
   for (const starship of responseData.results) {
      starshipsArray.push(starship);
    }
   // Fetch next page of data
   if (responseData.next) {
      await requestDataFromUrl(responseData.next);
   } else {
      // Push starships to table
      starshipsArray.map(displayStarship);
      // Enable Sort button
      sortStarshipsDropdown.removeAttribute('disabled');
   }
 }
 const hyphenateName = (str) => {
   return str.toLowerCase().replace(/ /g, '-');
 }

 // Append Starship row to table
 const displayStarship = (starship) => {
   starshipData.innerHTML += `<div class="results__row ${hyphenateName(starship.name)}">
      <div class="results__column">${starship.name}</div>
      <div class="results__column">${starship.model}</div>
      <div class="results__column">${starship.manufacturer}</div>
      <div class="results__column">${starship.length}</div>
      <div class="results__column">${starship.passengers}</div>
      <div class="results__column">${starship.cargo_capacity}</div>
      <div class="results__column">${starship.cost_in_credits}</div>
   </div>`;
}

// Sort function
const sortByProperty = (property) => (a, b) => {
   let starshipA = a[property].replace(',', '').toLowerCase(),
       starshipB = b[property].replace(',', '').toLowerCase(),
       numericalCompare = (property == 'cargo_capacity' || property == 'length' || property == 'passengers' || property == 'cost_in_credits');
      if (numericalCompare) return Number(starshipA)-Number(starshipB) || (Number(starshipA)||Infinity)-(Number(starshipB)||Infinity) || 0;
      if (starshipA > starshipB) return 1;
      if (starshipA < starshipB) return -1;
      return 0;
}
const sortBy = (category) => {
   starshipData.innerHTML = '';
   starshipsArray.sort(sortByProperty(category))
   starshipsArray.map(displayStarship);
}

//  Event Listeners
fetchStarshipsBtn.addEventListener('click', fetchAllStarships);
sortStarshipsDropdown.addEventListener('input', event => {
   sortBy(event.target.value);
});