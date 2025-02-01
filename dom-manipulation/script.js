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
  
  // Function to display a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
  
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `
      <p><strong>Category:</strong> ${randomQuote.category}</p>
      <p>"${randomQuote.text}"</p>
    `;
  
    // Save the last viewed quote in sessionStorage
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
  }
  
  // Function to add a new quote
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
  
    if (newQuoteText && newQuoteCategory) {
      // Add new quote to the array
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
  
      // Save the quotes to localStorage
      saveQuotes();
  
      // Clear input fields after adding
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
  
      alert("New quote added!");
    } else {
      alert("Please fill in both fields to add a new quote.");
    }
  }
  
  // Function to dynamically create the "Add Quote" form
  function createAddQuoteForm() {
    const formDiv = document.createElement('div');
    formDiv.innerHTML = `
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
      <button onclick="addQuote()">Add Quote</button>
    `;
    
    document.body.appendChild(formDiv); // Append the form to the body or wherever you prefer
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
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  // Event listener for export button
  document.getElementById('exportButton').addEventListener('click', exportToJson);
  
  // Optional: Display an initial quote when the page loads
  showRandomQuote();
  
  // Call createAddQuoteForm function to create the form dynamically when the page loads
  createAddQuoteForm();
  