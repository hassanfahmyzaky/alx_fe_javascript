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

// Function to populate the category filter dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  
  // Get unique categories from the quotes array
  const categories = [...new Set(quotes.map(quote => quote.category))];
  
  // Clear current options in the dropdown
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  
  // Add new options based on the categories
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Function to filter quotes based on the selected category
function filterQuotes() {
  const categoryFilter = document.getElementById('categoryFilter');
  const selectedCategory = categoryFilter.value;

  // Filter quotes based on selected category
  let filteredQuotes;
  if (selectedCategory === "all") {
    filteredQuotes = quotes;  // Show all quotes
  } else {
    filteredQuotes = quotes.filter(quote => quote.category === selectedCategory); // Filter by category
  }
  
  // Update the displayed quotes
  updateQuoteDisplay(filteredQuotes);
}

// Function to display quotes on the page
function updateQuoteDisplay(filteredQuotes) {
  const quoteDisplay = document.getElementById('quoteDisplay');
  
  // Display the quotes (filtered or all)
  quoteDisplay.innerHTML = filteredQuotes.map(quote => `
    <p><strong>Category:</strong> ${quote.category}</p>
    <p>"${quote.text}"</p>
  `).join('');
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
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories(); // Re-populate categories to include the new one
    updateQuoteDisplay(quotes); // Update display with all quotes
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert("New quote added!");
  } else {
    alert("Please fill in both fields to add a new quote.");
  }
}

// Initial setup when the page loads
createAddQuoteForm();  // Create the "Add Quote" form
populateCategories();   // Populate the category filter dropdown
updateQuoteDisplay(quotes);  // Display all quotes initially

// Event listener for the random quote button
document.getElementById('randomQuoteButton').addEventListener('click', displayRandomQuote);
