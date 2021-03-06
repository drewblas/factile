var questions = []
function displayAnswerOptions(id) {
  var q = questions[$('#' + id).prop('selectedIndex') - 1];
  var html = ""
  for(i=0; i< q.options.length; i++) {
  	html += ("<option value='"+ q.options[i].id+ "'>" + q.options[i].text + "</option>");
  }
  var qId = id.replace('_q', '');
  var obj = $('#' + qId + "_ans");
  obj.html(html);
  if (html == "") {
  	if (obj.parent().find('input[type="text"]').length == 0) {
	  	$("<input type='text' id='" + qId + "_text' name='" + qId + "_text'/>").insertAfter(obj);
  	}
  } else {
  	obj.parent().find('input[type="text"]').remove();
  }
}

  function addNode(sId, qId) {
  	$.ajax({
	    type: "GET",
	    cache: false,
      dataType: "json",
	    url: '/surveys/questions/'+ sId + '/' + qId,
	    success: function( response) {
		  	var obj = $('#' + qId);
		  	var nextId = obj.nextAll('.pageNode:first').attr('id');
		  	$('<div class="pull-left"><div class="pass-through"></div><div><i class="icon-arrow-down"></div></div>').insertBefore(obj);
		  	var x = obj.html();
		  	obj.attr('class', 'condition');
		  	obj.removeAttr('id');

		  	questions = response.questions

		  	var displaySelector = "<select name=\"" + qId + "_display\" id=\"" + qId + "_display\" class='input-small'><option value='show'>Show If</option><option value='skip'>Skip If</option></select>";
		  	var questionSelector = "<select name=\"" + qId + "_q\" id=\"" + qId + "_q\" onChange=\"displayAnswerOptions('" + qId+ "_q');\"><option></option>";
		  	for (i=0; i< response.questions.length; i++) {
		  		questionSelector += "<option value='" + response.questions[i].id + "'>" + response.questions[i].text + "</option>";
		  	}
		  	questionSelector += "</select>";

		  	var answerSelector = "<select name=\"" + qId + "_ans\" id=\"" + qId + "_ans\"></select>";
		  	var comparisonTypeSelector = "<select name=\"" + qId + "_op\" id=\"" + qId + "_op\" class='input-small'><option value='eq'>is</option><option value='ne'>is not</option><option value='like'>has</option><option value='notlike'>does not have</option></select>";
		  	var moreSelector = ""; //"<select name=\"" + qId + "_more\" class='input-small' disabled='disabled'><option></option><option>And</option><option>Or</option></select>";
		  	var includeQuestionTag = "<br><a href='javascript:void(0);' onclick='includeNext(\"" + nextId + "\");' class='btn btn-mini btn-info'><i class='icon-circle-arrow-right icon-white'></i> Include Next</a>";
		  	obj.html("<div class=\"node conditionNode\" id=\"" + qId + "_condition \">" + displaySelector +" " + questionSelector + " " + comparisonTypeSelector + " " + answerSelector+ " "  + moreSelector +"</div><div class=\"node pageNode\" id=\"" + qId + " \">" + x + "</div>" + includeQuestionTag + "<div class='clearfix'>&nbsp;</div>");
	    }
	  });
  }

  function includeNext(qId) {
  	var obj = $('#' + qId);
  	var x = obj.html();
  	var nextId = obj.nextAll('.pageNode:first').attr('id');
  	var includeQuestionTag = "<br><a href='javascript:void(0);' onclick='includeNext(\"" + nextId + "\");' class='btn btn-mini btn-info'><i class='icon-circle-arrow-right icon-white'></i> Include Next</a>";
  	var cog = obj.prevAll(".middle:first");
  	var condition = obj.prevAll(".condition:first");
  	condition.find('br:last').remove();
  	condition.find('.clearfix:last').remove();
  	condition.find('.btn-info').remove();
  	condition.append(cog[0].outerHTML + "<div class=\"node pageNode\" id=\"" + qId + " \"><input type='hidden' name='" + qId + "_included' value='true'/>" + x + "</div>" + includeQuestionTag);
  	var h = condition.height();
  	condition.prevAll(".pull-left:first").find(".pass-through").height(h);
  	obj.remove();
  	cog.remove();
  }