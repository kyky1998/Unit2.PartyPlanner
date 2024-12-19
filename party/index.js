
const API_URL = 'https://example.com/api/parties'; 


const partyList = document.getElementById('partyList');
const partyForm = document.getElementById('partyForm');


let parties = [];


async function fetchParties() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch parties');
        }
        const data = await response.json();
        parties = data; 
        renderParties();
    } catch (error) {
        console.error('Error fetching parties:', error);
    }
}


function renderParties() {
    partyList.innerHTML = ''; 
    parties.forEach((party, index) => {
        const partyItem = document.createElement('div');
        partyItem.classList.add('party-item');

        
        partyItem.innerHTML = `
            <div>
                <strong>${party.name}</strong> (${party.date} at ${party.time})<br>
                Location: ${party.location}<br>
                Description: ${party.description}
            </div>
            <button onclick="deleteParty(${party.id})">Delete</button>
        `;
        partyList.appendChild(partyItem);
    });
}


async function deleteParty(partyId) {
    try {
        const response = await fetch(`${API_URL}/${partyId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Failed to delete party');
        }
        
        parties = parties.filter(party => party.id !== partyId);
        renderParties(); 
    } catch (error) {
        console.error('Error deleting party:', error);
    }
}


partyForm.addEventListener('submit', async function(event) {
    event.preventDefault(); 
    const name = document.getElementById('partyName').value;
    const date = document.getElementById('partyDate').value;
    const time = document.getElementById('partyTime').value;
    const location = document.getElementById('partyLocation').value;
    const description = document.getElementById('partyDescription').value;

    
    const newParty = {
        name,
        date,
        time,
        location,
        description
    };

    try {
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newParty),
        });
        if (!response.ok) {
            throw new Error('Failed to add new party');
        }

        const addedParty = await response.json();
        
        parties.push(addedParty);
        renderParties(); 
        partyForm.reset(); 
    } catch (error) {
        console.error('Error adding new party:', error);
    }
});


fetchParties();
