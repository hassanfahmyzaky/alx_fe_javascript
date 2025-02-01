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
  
  // Simulate fetching quotes from the server (using JSONPlaceholder for the mock API)
  async function fetchQuotesFromServer() {
    try {
      // Simulate an API request with a delay (GET request)
      const response = await fetch('https://jsonplaceholder.typicode.com/posts'); // Simulating an API call
      const serverData = await response.json();
  
      // For simplicity, assume the server sends an array of objects with a "title" and "body" (we'll use these as quotes).
      const serverQuotes = serverData.slice(0, 5).map(post => ({
        text: post.body,
        category: "General"
      }));
  
      // Update local data with server data, resolving conflicts (server data takes precedence)
      resolveConflicts(serverQuotes);
  
    } catch (error) {
      console.error("Error fetching data from server:", error);
    }
  }
  
  // Function to post new quotes to the server (mock server interaction with POST)
  async function postQuoteToServer(quote) {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',  // HTTP method
        headers: {
          'Content-Type': 'application/json'  // Setting the content type as JSON
        },
        body: JSON.stringify(quote)  // Sending the quote as JSON
      });
      
      const data = await response.json();  // Get the response data
      console.log('Quote successfully posted to server:', data);
      alert('Quote posted successfully!');
      
    } catch (error) {
      console.error("Error posting quote to server:", error);
      alert('Failed to post quote to server.');
    }
  }
  
  // Function to resolve conflicts between local and server data
  function resolveConflicts(serverQuotes) {
    // Simple conflict resolution: Server data takes precedence
    const mergedQuotes = [...serverQuotes];  // Start with the server's quotes
  
    // Check if there are any local quotes that aren't already in the server data
    quotes.forEach(localQuote => {
      const existsOnServer = serverQuotes.some(serverQuote => serverQuote.text === localQuote.text);
      if (!existsOnServer) {
        mergedQuotes.push(localQuote);
      }
    });
  
    // Update quotes with the merged result
    quotes = mergedQuotes;
    saveQuotes();
    updateQuoteDisplay();
    showConflictNotification();
  }
  
  // Function to display quotes on the page
  function updateQuoteDisplay() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = quotes.map(quote => `
      <p><strong>Category:</strong> ${quote.category}</p>
      <p>"${quote.text}"</p>
    `).join('');
  }
  
  // Notification system to inform user of updates or conflicts
  function showConflictNotification() {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
      <p>Data has been synced with the server. Some changes may have been resolved automatically.</p>
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
  
  // Periodically fetch new data from the server and update local storage
  function startPeriodicSync() {
    setInterval(() => {
      fetchQuotesFromServer();
    }, 60000);  // Fetch every minute (60000 ms)
  }
  
  // Function to add a new quote and also post it to the server
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
    if (newQuoteText && newQuoteCategory) {
      // Add new quote to the array
      const newQuote = { text: newQuoteText, category: newQuoteCategory };
      quotes.push(newQuote);
  
      // Save the quotes to localStorage
      saveQuotes();
  
      // Post the new quote to the server
      postQuoteToServer(newQuote);
  
      // Update the quote display
      updateQuoteDisplay();
  
      // Clear input fields after adding
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
    document.body.appendChild(formDiv); // Append the form to the body
  }
  
  // Export quotes as a JSON file
  function exportToJson() {
    const jsonBlob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json'; // Filename for the exported JSON
    a.click();
    URL.revokeObjectURL(url); // Release the blob object after the download is triggered
  }
  
  // Import quotes from a JSON file
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      try {
        const importedQuotes = JSON.parse(event.target.result);
        if (Array.isArray(importedQuotes)) {
          quotes = importedQuotes;
          saveQuotes(); // Save to localStorage
          updateQuoteDisplay(); // Update the display with imported quotes
          alert('Quotes imported successfully!');
        } else {
          alert('Invalid JSON format');
        }
      } catch (error) {
        alert('Error importing file');
      }
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  // Event listener for showing a random quote
  document.getElementById('newQuote').addEventListener('click', updateQuoteDisplay);
  
  // Event listener for export button
  document.getElementById('exportButton').addEventListener('click', exportToJson);
  
  // Initial setup when the page loads
  createAddQuoteForm();  // Create the "Add Quote" form
  startPeriodicSync();    // Start syncing every minute
  updateQuoteDisplay();   // Display the initial quotes
  
  