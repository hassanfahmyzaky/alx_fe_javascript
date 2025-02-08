// API URL for simulating server interaction (mock API)
const API_URL = "https://jsonplaceholder.typicode.com/posts"; // Example API URL for testing

// Load quotes from localStorage if they exist, otherwise use default quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The best way to predict the future is to create it.", category: "Inspiration" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Motivation" },
  { text: "You miss 100% of the shots you don’t take.", category: "Sports" },
];

// Function to save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to fetch quotes from the server (simulated)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    
    // Simulate server data structure (adjusting to match quotes format)
    const serverQuotes = data.map(item => ({
      text: item.title,  // Simulating title as the quote text
      category: item.body,  // Simulating body as the category
    }));

    return serverQuotes;
  } catch (error) {
    console.error("Error fetching data from server:", error);
    return [];
  }
}

// Function to sync local data with server data
async function syncWithServer() {
  const serverQuotes = await fetchQuotesFromServer();

  if (serverQuotes.length === 0) {
    return; // No quotes to sync if server returns no data
  }

  // Conflict resolution: Use server data if there are discrepancies
  const mergedQuotes = mergeQuotes(serverQuotes, quotes);

  // Update local storage and the displayed quotes
  quotes = mergedQuotes;
  saveQuotes();
  updateQuoteDisplay(quotes);

  // Notify user that data was synced
  alert("Data synced with the server.");
}

// Function to merge server quotes with local quotes (conflict resolution)
function mergeQuotes(serverQuotes, localQuotes) {
  const merged = [];

  // Merge quotes, server data takes precedence if conflicts arise
  serverQuotes.forEach(serverQuote => {
    const matchingQuoteIndex = localQuotes.findIndex(localQuote => localQuote.text === serverQuote.text);
    if (matchingQuoteIndex !== -1) {
      // Conflict resolution: server quote takes precedence
      merged.push(serverQuote);
      localQuotes.splice(matchingQuoteIndex, 1); // Remove local version
    } else {
      merged.push(serverQuote);  // Add new server quote
    }
  });

  // Add remaining local quotes that don't have conflicts
  merged.push(...localQuotes);

  return merged;
}

// Function to periodically check for server updates
function startAutoSync() {
  setInterval(() => {
    syncWithServer();
  }, 10000);  // Check every 10 seconds for simplicity
}

// Create the "Add Quote" form
function createAddQuoteForm() {
  const formDiv = document.createElement('div');
  formDiv.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
  document.body.appendChild(formDiv); // Append the form to the body
}

// Function to add a new quote
async function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };

    // Add the new quote locally and save it
    quotes.push(newQuote);
    saveQuotes();

    // Attempt to send the new quote to the server
    await postQuoteToServer(newQuote);

    populateCategories(); // Re-populate categories to include the new one
    updateQuoteDisplay(quotes); // Update display with all quotes

    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert("New quote added and synced with the server!");
  } else {
    alert("Please fill in both fields to add a new quote.");
  }
}

// Function to send a new quote to the server (POST request)
async function postQuoteToServer(newQuote) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',  // Use POST method to send data
      headers: {
        'Content-Type': 'application/json',  // Set content type to JSON
      },
      body: JSON.stringify({
        title: newQuote.text,  // Mapping quote text to title field
        body: newQuote.category,  // Mapping category to body field
        userId: 1,  // Mock userId for the API
      }),
    });

    const data = await response.json();
    console.log('Quote successfully posted to the server:', data);
  } catch (error) {
    console.error('Error posting quote to the server:', error);
  }
}

// Function to export quotes as a JSON file
function exportToJson() {
  const jsonBlob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(jsonBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json'; // Filename for the exported JSON
  a.click();
  URL.revokeObjectURL(url); // Release the blob object after the download is triggered
}

// Function to update the quotes display
function updateQuoteDisplay(filteredQuotes) {
  const quoteDisplay = document.getElementById('quoteDisplay');
  
  // Display the quotes (filtered or all)
  quoteDisplay.innerHTML = filteredQuotes.map(quote => `
    <p><strong>Category:</strong> ${quote.category}</p>
    <p>"${quote.text}"</p>
  `).join('');
}

// Initialize the app
createAddQuoteForm();  // Create the "Add Quote" form
populateCategories();   // Populate the category filter dropdown
updateQuoteDisplay(quotes);  // Display all quotes initially

// Event listener for the random quote button
document.getElementById('randomQuoteButton').addEventListener('click', showRandomQuote);

// Event listener for export button
document.getElementById('exportButton').addEventListener('click', exportToJson);

// Event listener for category filter
document.getElementById('categoryFilter').addEventListener('change', filterQuotes);

// Event listener for import button
document.getElementById('importButton').addEventListener('change', function(event) {
  importFromJsonFile(event);
});

// Periodic sync with the server
startAutoSync();

// Additional functions for handling other actions (random quote, etc.)
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);  // Random index from 0 to quotes.length - 1
  const randomQuote = quotes[randomIndex];

  // Display the random quote on the page
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `
    <p><strong>Category:</strong> ${randomQuote.category}</p>
    <p>"${randomQuote.text}"</p>
  `;
}
