const puppyContainer = document.getElementById("allPuppies");
const puppyDetails = document.getElementById("puppiesDetails");
const cohortName = "2404-FTB-ET-WEB-FT";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;


const fetchAllPuppies = async () => {
  try {
    const response = await fetch(`${API_URL}/players`);
    const puppies = await response.json();
    console.log("Fetched puppies:", puppies);
    if (!puppies || puppies.length === 0) {
      console.error("Failed to fetch puppies: Empty response");
      return [];
    }
    return puppies;
  } catch (err) {
    console.error("Uh oh, trouble fetching puppies!", err);
    return [];
  }
};

const fetchSinglePuppy = async (puppyId) => {
  try {
    const response = await fetch(`${API_URL}/players/${puppyId}`);
    const puppy = await response.json();
    return puppy;
  } catch (err) {
    console.error(`Oh no, trouble fetching puppy #${puppyId}!`, err);
    return null;
  }
};

const renderAllPuppies = async () => {
  try {
    const response = await fetchAllPuppies();
    const { players } = response.data; 
    console.log("Puppies:", players);
    puppyContainer.innerHTML = ''; 
    if (!Array.isArray(players)) {
      console.error("Failed to render puppies: Invalid data format");
      return;
    }
    if (players.length === 0) {
      puppyContainer.textContent = 'No puppies available.';
      return;
    }
    players.forEach(puppy => {
      const card = document.createElement('div');
      card.classList.add('puppyCards');
      card.innerHTML = `
        <img src="${puppy.imageUrl}" alt="${puppy.name}">
        <p>Name: ${puppy.name}</p>
        <p>ID: ${puppy.id}</p>
        <p>Breed: ${puppy.breed}</p>
        <p>Status: ${puppy.status}</p>
      `;
      card.addEventListener('click', () => renderSinglePuppy(puppy.id));
      puppyContainer.appendChild(card);
    });
  } catch (err) {
    console.error("Error rendering puppies:", err);
  }
};
const renderSinglePuppy = async (puppyId) => {
  const puppy = await fetchSinglePuppy(puppyId);
  if (!puppy) {
    console.error(`Puppy with ID ${puppyId} not found`);
    puppyDetails.innerHTML = '<p>Puppy not found.</p>';
    return;
  }
  puppyDetails.innerHTML = `
    <div class="puppyCards">
      <img src="${puppy.imageUrl}" alt="${puppy.name}">
      <p>Name: ${puppy.name}</p>
      <p>ID: ${puppy.id}</p>
      <p>Breed: ${puppy.breed}</p>
      <p>Status: ${puppy.status}</p>
    </div>
    <button class="back-btn">Back to all puppies</button>
  `;
  const backBtn = puppyDetails.querySelector('.back-btn');
  backBtn.addEventListener('click', () => renderAllPuppies());
};

const init = async () => {
  const puppies = await fetchAllPuppies();
  renderAllPuppies(puppies);
};

init();
