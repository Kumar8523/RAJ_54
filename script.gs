function doPost(e) {
  try {
    // Parse the JSON data from the request
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet (create if it doesn't exist)
    let sheet = getSheet();
    
    // Get the headers
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // Prepare the new row data
    const newRow = [];
    headers.forEach(header => {
      newRow.push(data[header] || '');
    });
    
    // Append the new row to the sheet
    sheet.appendRow(newRow);
    
    // Return a success response
    return ContentService
      .createTextOutput(JSON.stringify({result: 'success', message: 'Data saved successfully'}))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return an error response
    return ContentService
      .createTextOutput(JSON.stringify({result: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getSheet() {
  // Open the spreadsheet by ID (replace with your spreadsheet ID)
  const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Get the sheet named 'Submissions' or create it if it doesn't exist
  let sheet = spreadsheet.getSheetByName('Submissions');
  if (!sheet) {
    sheet = spreadsheet.insertSheet('Submissions');
    
    // Set the headers
    const headers = ['timestamp', 'name', 'email', 'institution', 'country', 'purpose', 'comments', 'status'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  
  return sheet;
}