//
// --- 1. PASTE YOUR GOOGLE SHEET URL HERE ---
//
const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTlU_tdOrccuqrTykTPJkD5mcTXnhS27khjFiRVTRIddXDa52KjnC7rKfpOG7ixXUINDFKJ4IVlMjxe/pub?gid=771586046&single=true&output=csv';

// Wait for the page to load
document.addEventListener('DOMContentLoaded', () => {
    // Use PapaParse to fetch and read the CSV file from the URL
    Papa.parse(csvUrl, {
        download: true, // Tells it to fetch the URL
        header: false,  // We will use indexes, not headers
        complete: (results) => {
            // Data is loaded, now build the table
            initializeDataTable(results.data);
        },
        error: (err) => {
            console.error("Error fetching or parsing CSV:", err);
            // Display an error message to the user
            const tableBody = document.querySelector("#scopeTable tbody");
            if (tableBody) {
                tableBody.innerHTML = '<tr><td colspan="4">Could not load data. Please check the CSV URL and ensure it is published correctly.</td></tr>';
            }
        }
    });
});

function initializeDataTable(csvData) {
    // Remove the first row (headers) from the CSV data
    csvData.shift(); 

    // Transform the raw CSV data into the format DataTables needs
    const tableData = csvData
        .filter(row => row.length >= 5 && row[1]) // Ensure row has data and an educator name
        .map(row => {
            // CSV Columns based on your file:
            // row[0] = Timestamp
            // row[1] = Educator's Full Name
            // row[2] = Grade Level(s)
            // row[3] = Subject
            // row[4] = Google Drive Link

            // Create a clickable link for the last column
            const fileLink = `<a href="${row[4]}" target="_blank">View Document</a>`;

            // Return the data for the table row
            return [
                row[1], // Educator
                row[2], // Grade
                row[3], // Subject
                fileLink // Link
            ];
        });

    // --- 3. Initialize DataTables ---
    // This one function turns on search, sort, and pagination!
    $(document).ready(() => {
        $('#scopeTable').DataTable({
            data: tableData, // The data we just processed
            columns: [
                { title: "Educator" },
                { title: "Grade" },
                { title: "Subject" },
                { title: "Link", orderable: false, searchable: false } // Don't sort/search the link column
            ],
            paging: true,     // Show page numbers
            pageLength: 25,   // Show 25 entries per page
            responsive: true  // Make it work on mobile
        });
    });
}
