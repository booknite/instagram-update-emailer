function checkForNewPosts() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var lastRow = sheet.getLastRow();
  var data = sheet.getRange('D2:D' + lastRow).getValues();
  var usernames = sheet.getRange('A2:A' + lastRow).getValues();

  // Loop through all monitored accounts
  for (var i = 0; i < data.length; i++) {
    var currentCount = data[i][0];
    var username = usernames[i][0];
    var cache = CacheService.getScriptCache();
    var cachedCount = cache.get(username);

    if (cachedCount) {
      cachedCount = parseInt(cachedCount);

      // Check if the post count has increased
    if (currentCount > cachedCount) {
      sendEmailNotification(username, i + 2); 
      cache.put(username, currentCount.toString(), 8100);
    }

    } else {
      // If first time, just cache the count
      cache.put(username, currentCount.toString(), 8100);
    }
  }
}

function sendEmailNotification(username, rowNumber) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var email = sheet.getRange('E2').getValue();
  var instagramURL = sheet.getRange('B' + rowNumber).getValue();
  var subject = username + ' made a new Instagram post today!';
  var message = 'Check it out at ' + instagramURL;

  MailApp.sendEmail(email, subject, message);
}
