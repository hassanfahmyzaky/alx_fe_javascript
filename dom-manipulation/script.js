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

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    // Simulating an API request to fetch quotes
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const serverData = await response.json();

    // Assume server data returns objects with title and body
    const serverQuotes = serverData.slice(0, 5).map(post => ({
      text: post.body,
      category: "General"
    }));

    // Resolve conflicts and merge with existing local quotes
    resolveConflicts(serverQuotes);

  } catch (error) {
    console.error("Error fetching data from server:", error);
  }
}

// Function to resolve conflicts between local and server data
function resolveConflicts(serverQuotes) {
  const mergedQuotes = [...serverQuotes];  // Start with the server's quotes

  // Add local quotes that are not in the server data
  quotes.forEach(localQuote => {
    const existsOnServer = serverQuotes.some(serverQuote => serverQuote.text === localQuote.text);
    if (!existsOnServer) {
      mergedQuotes.push(localQuote);
    }
  });

  // Update the quotes and save them
  quotes = mergedQuotes;
  saveQuotes();
  updateQuoteDisplay(quotes);  // Update displayed quotes after merging
  showSyncSuccessNotification();  // Notify user of successful sync
}

// Function to display quotes on the page
function updateQuoteDisplay(filteredQuotes) {
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = filteredQuotes.map(quote => `
    <p><strong>Category:</strong> ${quote.category}</p>
    <p>"${quote.text}"</p>
  `).join('');
}

// Function to show notification when quotes are synced successfully
function showSyncSuccessNotification() {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerHTML = `
    <p><strong>Success:</strong> Quotes synced with server!</p>
    <button onclick="closeNotification()">Close</button>
  `;
  document.body.appendChild(notification);
}

// Function to close the notification
function closeNotification() {
  const notification = document.querySelector('.notification');
  if (notification) {
    notification.remove();
  }
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    updateQuoteDisplay(quotes);  // Update display after adding new quote
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert("New quote added!");
  } else {
    alert("Please fill in both fields to add a new quote.");
  }
}

// Function to create the "Add Quote" form
function createAddQuoteForm() {
  const formDiv = document.createElement('div');
  formDiv.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
  document.body.appendChild(formDiv);  // Append the form to the body
}

// Initial setup when the page loads
createAddQuoteForm();  // Create the "Add Quote" form
updateQuoteDisplay(quotes);  // Display all quotes initially

// Call fetchQuotesFromServer to fetch quotes from the server when the page loads
fetchQuotesFromServer();

// Periodically sync data with the server
setInterval(fetchQuotesFromServer, 60000);  // Sync every minute (60000 ms)
