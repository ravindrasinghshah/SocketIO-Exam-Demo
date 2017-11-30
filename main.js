'use strict';

(function () {
  var socket = io();

  // Select Role
  $("#selectRole").change(function () {
    var role = $(this).val();
    $(this).attr("disabled", true).css("color", "#cac1c1");
    $("#selectedRole").html("You selected role: <strong>" + role.toUpperCase() + "</strong>");
    if (role === "teacher") {
      $("#teacher-section").show();
    }
    else {
      $("#student-section").show();
    }
  });

  // Ask Question
  $('.askQuestion').on("click", function () {
    var id = $(this).attr("id");
    var question = $("#q" + id).html();
    $(this).attr("disabled", true);
    socket.emit('AskQuestion', question);

    var fields = $("#teacher-section :button");
    var isDisabled = true;
    fields.each(function (index, element) {
      isDisabled = $(element).is(':disabled');
    });
    if (isDisabled) {
      $("#divSendResult").show();
    }
  });

  socket.on('AskQuestion', function (question) {
    var liLength = $('#questionList li').size();
    var html = `<span> ${question}</span>
                <input type='text' id='txt_${liLength}' />
                <button id='${liLength}' class="btn btn-primary btn-sm ansQuestion">
                  <i class="glyphicon glyphicon-ok"></i>
                </button><span id="result_${liLength}"></span>`;
    $('#questionList').append($('<li>').html(html));
    registerAnsQuestionEvent();
  });

  function registerAnsQuestionEvent() {
    // Answer Question
    $('.ansQuestion').off();
    $('.ansQuestion').on("click", function () {
      var id = $(this).attr("id");
      var answer = $("#txt_" + id).val();
      if (answer === null || answer === "") {
        toastr.error('Please enter answer!');
        return false;
      }
      $(this).attr("disabled", true);
      var ans = { "id": id, "value": answer };
      socket.emit('AnsQuestion', ans);
    });
  }

  // Answer Question
  socket.on('AnsQuestion', function (ans) {
    var answer = `<span>Student Replied: <strong>${ans.value}</strong>
                  <button id='${ans.id}' data-val="right" class="btn btn-primary btn-sm checkQuestion">
                  <i class="glyphicon glyphicon-ok"></i>
                </button> 
                <button id='${ans.id}'  data-val="wrong" class="btn btn-primary btn-sm checkQuestion">
                <i class="glyphicon glyphicon-remove"></i>
              </button>
              </span>`;
    $("#ans_" + ans.id).html(answer);
    registerCheckAnswerEvent();
  });

  function registerCheckAnswerEvent() {
    // Check Question
    $('.checkQuestion').on("click", function () {
      var id = $(this).attr("id");
      var val = $(this).data("val");
      var result = { "id": id, "value": val };
      $(this).attr("disabled", true);
      $(this).next().attr("disabled", true);
      $(this).prev().attr("disabled", true);
      socket.emit('ShowAnswer', result);
    });
  }

  socket.on('ShowAnswer', function (result) {
    var html = `<span>Your answer is <strong>${result.value}</strong></span>`;
    $("#result_" + result.id).html(html);
  });

  // Send test notes
  $("#btnSendNote").on("click", function () {
    var note = $("#resultNotes").val();
    if (note === "" || note === null) {
      toastr.error("Please enter notes.");
      return false;
    }
    socket.emit('SendNote', note);
    
  });

  socket.on('SendNote', function (msg) {
   toastr.success(msg);
  });
})();