function copyToClipboard(text) {
  var copyFrom = document.createElement("textarea");
  copyFrom.textContent = text;
  var body = document.getElementsByTagName('body')[0];
  body.appendChild(copyFrom);
  copyFrom.select();
  document.execCommand('copy');
  body.removeChild(copyFrom);
}

function formatResponse(response) {
  var result = "";
  var separator = "\t";
  var lineBreak = "\n";

  result = result + "Facebook Name" + separator + response.questions.join(separator) + lineBreak;

  response.members.forEach((member) => {
    result = result + member.facebookName;
    response.questions.forEach((question) => {
      var qa = member.answers.find((item) => item.question === question);
      if (qa !== undefined)
        result = result + separator + qa.answer.replace(/(\r\n|\n|\r|\t)/gm, "");
      else
        result = result + separator;
    });
    result = result + lineBreak;
  });

  return result;
}

$(function() {
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendMessage(tab.id, { action: "extractFacebookGroupAnswers" }, function(response) {
      console.log(response);
      if (response.members.length > 0) {
        copyToClipboard(formatResponse(response));
        $("#result").html(`<h3>Yay!</h3><p>${response.members.length} members with answers found and copied to clipboard.</p><p>Paste data into Google Sheets or Excel.</p>`);
      } else {
        $("#result").html("<h3>Ooops!</h3><p>No answers found.</p><p>Wait a little bit before using the extension and scroll to the bottom to load the all data first.</p>");
      }
    });
  });
});
