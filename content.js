function extractFacebookGroupAnswers() {
  // #member_requests_pagelet .uiList._4kg li
  // FB Name
  // ._66jq a
  // Question
  // ._4wsr ul li div
  // Answer
  // ._4wsr ul li text
  //
  var members = []
  var questions = new Set();

  $("#member_requests_pagelet .uiList._4kg._4kt._6-h._6-j > li").each(function() {
    var memberElement = $(this);
    var facebookName = memberElement.find("._66jq a").text();
    var member = { facebookName: facebookName, answers: [] };
    memberElement.find("._4wsr ul li").each(function() {
      var qaElement= $(this);
      var question = qaElement.find("div").text();
      var answer = qaElement.find("text").text();

      questions.add(question);
      member.answers.push({ question: question, answer: answer });
    });
    members.push(member);
  });

  return { members: members, questions: Array.from(questions) } ;
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action == "extractFacebookGroupAnswers")
    sendResponse(extractFacebookGroupAnswers());
});
