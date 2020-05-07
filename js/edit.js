////////////////////////////////////////////////////////////
// EDIT TERMINALS
////////////////////////////////////////////////////////////
var edit = {xmlFile:'', layoutNum:0, answerNum:0};

/*!
 * 
 * EDIT READY
 * 
 */
$(function() {
	 $.editor.enable = true;
});

function loadEditPage(){
	jQuery.ajax({ 
		 url: "editTools.html", dataType: "html" 
	}).done(function( responseHtml ) {
		 $("body").prepend(responseHtml);
		 buildEditButtons();
		$('#editWrapper').show();
		loadEditQuestion(true);
	});
	
	/*$.get('editTools.html', function(data){
		$('body').prepend(data);
		buildEditButtons();
		$('#editWrapper').show();
		loadEditQuestion(true);
	});	*/	
}

function buildEditButtons(){
	$('#questionslist').empty();
	for(n=0;n<question_arr.length;n++){
		$('#questionslist').append($("<option/>", {
			value: n,
			text: 'Question '+(n+1)
		}));
	}
	
	$("#questionslist").change(function() {
		if($(this).val() != ''){
			questionCountNum = $(this).val();
			sequenceCountNum = sequence_arr[questionCountNum];
			edit.answerNum = 0;
			loadEditQuestion(true);
		}
	});
	
	$('#answerlayoutlist').empty();
	for(n=0;n<answerType_arr.length;n++){
		$('#answerlayoutlist').append($("<option/>", {
			value: answerType_arr[n],
			text: answerType_arr[n]
		}));
	}
	
	$("#answerlayoutlist").change(function() {
		if($(this).val() != ''){
			question_arr[sequenceCountNum].answerLayout = $(this).val();
			loadEditQuestion(true);
		}
	});
	
	$('#addQuestion').click(function(){
		addQuestion();
	});
	
	$('#removeQuestion').click(function(){
		removeQuestion();
	});
	
	$('#prevQuestion').click(function(){
		toggleQuestion(false);
	});
	
	$('#nextQuestion').click(function(){
		toggleQuestion(true);
	});
	
	$('#prevLayout').click(function(){
		toggleLayout(false);
	});
	
	$('#nextLayout').click(function(){
		toggleLayout(true);
	});
	
	$('#toggleButtonGuide').click(function(){
		if(editContainer.visible){
			editContainer.visible = false;
		}else{
			editContainer.visible = true;	
		}
	});
	
	$('#editQuestion').click(function(){
		toggleEditOption('question');
	});
	
	$('#editAnswers').click(function(){
		toggleEditOption('answers');
	});
	
	$('#generateXML').click(function(){
		generateXML();
	});
	
	$('#saveXML').click(function(){
		var n = prompt('Enter password to save.');
		if ( n!=null && n!="" ) {
			saveXML(n);
		}
	});
	
	$('#cancelQuestion').click(function(){
		toggleEditOption('');
	});
	
	$('#doneQuestion').click(function(){
		updateQuestion();
		toggleEditOption('');
	});
	
	$('#previewQuestion').click(function(){
		updateQuestion();
	});
	
	$("#answerslist").change(function() {
		if($(this).val() != ''){
			edit.answerNum = $(this).val();
			loadEditAnswer();
		}
	});
	
	$('#prevAnswer').click(function(){
		toggleAnswer(false);
	});
	
	$('#nextAnswer').click(function(){
		toggleAnswer(true);
	});
	
	$('#removeAnswer').click(function(){
		removeAnswer();
	});
	
	$('#addAnswer').click(function(){
		addAnswer();
	});
	
	$('#cancelAnswer').click(function(){
		toggleEditOption('');
	});
	
	$('#doneAnswer').click(function(){
		updateAnswers();
		toggleEditOption('');
	});
	
	$('#previewAnswer').click(function(){
		updateAnswers();
	});
	
	if(answerButtonBgEnable){
		editContainer.visible = false;
		$('#toggleButtonGuide').hide();	
	}
}

function toggleEditOption(con){
	$('#actionWrapper').hide();
	$('#questionWrapper').hide();
	$('#answersWrapper').hide();
	$('#topWrapper').hide();
	
	if(con == 'question'){
		$('#questionWrapper').show();
		$('#topWrapper').show();
	}else if(con == 'answers'){
		$('#answersWrapper').show();
	}else{
		$('#actionWrapper').show();	
		$('#topWrapper').show();
	}
	
	loadEditQuestion(true);
}


/*!
 * 
 * TOGGLE QUESTION - This is the function that runs to toggle question
 * 
 */
function toggleQuestion(con){
	if(con){
		questionCountNum++;
		questionCountNum = questionCountNum > question_arr.length - 1 ? 0 : questionCountNum;
	}else{
		questionCountNum--;
		questionCountNum = questionCountNum < 0 ? question_arr.length - 1 : questionCountNum;
	}
	
	sequenceCountNum = sequence_arr[questionCountNum];
	$('#questionslist').prop("selectedIndex", sequenceCountNum);
	
	edit.answerNum = 0;
	loadEditQuestion(true);
}

/*!
 * 
 * TOGGLE ANSWER - This is the function that runs to toggle answer
 * 
 */
function toggleAnswer(con){
	if(con){
		edit.answerNum++;
		edit.answerNum = edit.answerNum > question_arr[sequenceCountNum].answer.length - 1 ? 0 : edit.answerNum;
	}else{
		edit.answerNum--;
		edit.answerNum = edit.answerNum < 0 ? question_arr[sequenceCountNum].answer.length - 1 : edit.answerNum;
	}
	
	$('#answerslist').prop("selectedIndex", edit.answerNum);
	loadEditAnswer();
}

/*!
 * 
 * ADD ANSWER - This is the function that runs to add answer
 * 
 */
function addAnswer(){
	if(question_arr[sequenceCountNum].answer.length < 8){
		var newAnswerText = 'Answer'+(question_arr[sequenceCountNum].answer.length+1);
		question_arr[sequenceCountNum].answer.push({text:newAnswerText, type:'', width:'', height:'', x:'', y:'', fontSize:''});
		$(edit.xmlFile).find('item').eq(sequenceCountNum).find('answers').append('<answer>'+newAnswerText+'</answer>');
		
		$('#answerText').val(newAnswerText);
		$('#answerFontSize').val('');
		$('#answerWidth').val('');
		$('#answerHeight').val('');
		$('#answerX').val('');
		$('#answerY').val('');
		
		edit.answerNum = question_arr[sequenceCountNum].answer.length-1;
		updateAnswers();
	}else{
		alert('Maximum 8 answers!');	
	}
}

/*!
 * 
 * REMOVE ANSWER - This is the function that runs to remove answer
 * 
 */
function removeAnswer(){
	question_arr[sequenceCountNum].answer.splice(edit.answerNum, 1);
	$(edit.xmlFile).find('item').eq(sequenceCountNum).find('answers answer').eq(edit.answerNum).remove();
	
	edit.answerNum = 0;
	loadEditQuestion(true);
}

/*!
 * 
 * ADD QUESTION - This is the function that runs to add quesiton
 * 
 */
function addQuestion(){
	var newQuestionText = 'New Question'+(question_arr.length+1);
	question_arr.push({category:'', question:newQuestionText, fontSize:undefined, type:'text', answer:[{text:'ANSWER 1', type:'text', width:undefined, height:undefined, x:undefined, y:undefined, fontSize:undefined},{text:'ANSWER 2', type:'text', width:undefined, height:undefined, x:undefined, y:undefined, fontSize:undefined}], answerLayout:'2type1', answerOffsetY:'', correctAnswer:''});
	
	var newXMLItem = "	<item>\n";
	newXMLItem += "		<category></category>\n";
	newXMLItem += "		<question type='text'><![CDATA["+newQuestionText+"]]></question>\n";
	newXMLItem += "		<answers answerLayout='2type1' correctAnswer=''>\n";
	newXMLItem += "			<answer><![CDATA[ANSWER 1]]></answer>\n";
	newXMLItem += "			<answer><![CDATA[ANSWER 2]]></answer>\n";
	newXMLItem += "		</answers>\n";
	newXMLItem += "	</item>\n";
	
	$(edit.xmlFile).find('questions').append(newXMLItem);
	
	$('#category').val('');
	$('#questionFontSize').val('');
	$('#questionText').val(newQuestionText);
	
	filterCategoryQuestion();
	questionCountNum = question_arr.length-1;
	sequenceCountNum = sequence_arr[questionCountNum];
	
	$('#questionslist').empty();
	for(n=0;n<question_arr.length;n++){
		$('#questionslist').append($("<option/>", {
			value: n,
			text: 'Question '+(n+1)
		}));
	}
	
	$('#questionslist').prop("selectedIndex", questionCountNum);
	loadEditQuestion(true);
}

/*!
 * 
 * REMOVE QUESTION - This is the function that runs to remove quesiton
 * 
 */
function removeQuestion(){
	question_arr.splice(sequenceCountNum, 1);
	$(edit.xmlFile).find('item').eq(sequenceCountNum).remove();
	
	questionCountNum = 0;
	sequenceCountNum = sequence_arr[questionCountNum];
	filterCategoryQuestion();
	$('#questionslist').empty();
	for(n=0;n<question_arr.length;n++){
		$('#questionslist').append($("<option/>", {
			value: n,
			text: 'Question '+(n+1)
		}));
	}
	
	$('#questionslist').prop("selectedIndex", sequenceCountNum);
	
	loadEditQuestion(true);
}

/*!
 * 
 * LOAD EDIT QUESTION - This is the function that runs to load question value
 * 
 */
function loadEditQuestion(con){
	if(con){
		edit.layoutNum = answerType_arr.indexOf(question_arr[sequenceCountNum].answerLayout);
	}
	
	//edit question
	$('#category').val(question_arr[sequenceCountNum].category);
	
	var questionType = question_arr[sequenceCountNum].type == 'text' ? 0 : 1;
	$('#questiontype').prop("selectedIndex", questionType);
	$('#questionFontSize').val(question_arr[sequenceCountNum].fontSize);
	$('#questionText').val(question_arr[sequenceCountNum].question);
	$('#questionAudio').val(question_arr[sequenceCountNum].audio);
	
	//edit answers
	$('#answerslist').empty();
	for(n=0;n<question_arr[sequenceCountNum].answer.length;n++){
		$('#answerslist').append($("<option/>", {
			value: n,
			text: 'Answer '+(n+1)
		}));
	}
	$('#answerslist').prop("selectedIndex", edit.answerNum);
	loadEditAnswer();
	
	$('#answerlayoutlist').prop("selectedIndex", edit.layoutNum);
	loadQuestion();
}

/*!
 * 
 * LOAD EDIT ANSWER - This is the function that runs to load answer value
 * 
 */
function loadEditAnswer(){
	$('#correctAnswer').val(question_arr[sequenceCountNum].correctAnswer);
	$('#answerOffsetY').val(question_arr[sequenceCountNum].answerOffsetY);
	
	var answerType = question_arr[sequenceCountNum].answer[edit.answerNum].type == 'image' ? 1 : 0;
	$('#answertype').prop("selectedIndex", answerType);
	$('#answerText').val(question_arr[sequenceCountNum].answer[edit.answerNum].text);
	$('#answerFontSize').val(question_arr[sequenceCountNum].answer[edit.answerNum].fontSize);
	$('#answerWidth').val(question_arr[sequenceCountNum].answer[edit.answerNum].width);
	$('#answerHeight').val(question_arr[sequenceCountNum].answer[edit.answerNum].height);
	$('#answerX').val(question_arr[sequenceCountNum].answer[edit.answerNum].x);
	$('#answerY').val(question_arr[sequenceCountNum].answer[edit.answerNum].y);
	$('#answerAudio').val(question_arr[sequenceCountNum].answer[edit.answerNum].audio);
}

/*!
 * 
 * TOGGLE ANSWER LAYOUT - This is the function that runs to toggle answer layout
 * 
 */
function toggleLayout(con){
	if(con){
		edit.layoutNum++;
		edit.layoutNum = edit.layoutNum > answerType_arr.length - 1 ? 0 : edit.layoutNum;
	}else{
		edit.layoutNum--;
		edit.layoutNum = edit.layoutNum < 0 ? answerType_arr.length - 1 : edit.layoutNum;
	}
	
	question_arr[sequenceCountNum].answerLayout = answerType_arr[edit.layoutNum];
	$('#answerlayoutlist').prop("selectedIndex", edit.layoutNum);
	loadEditQuestion(false);
}

/*!
 * 
 * UPDATE QUESTION - This is the function that runs to update question value
 * 
 */
function updateQuestion(){
	//update array
	question_arr[sequenceCountNum].type = $('#questiontype').val();
	var questionFontSize = $('#questionFontSize').val();
	questionFontSize = questionFontSize == 0 ? undefined : questionFontSize;
	question_arr[sequenceCountNum].fontSize = questionFontSize;
	question_arr[sequenceCountNum].question = $('#questionText').val();
	question_arr[sequenceCountNum].audio = $('#questionAudio').val();
	
	//update XML
	$(edit.xmlFile).find('item').eq(sequenceCountNum).find('category').text($('#category').val());
	$(edit.xmlFile).find('item').eq(sequenceCountNum).find('question').attr('type', $('#questiontype').val());
	if($('#questiontype').val() == 'text'){
		$(edit.xmlFile).find('item').eq(sequenceCountNum).find('question').html('<![CDATA['+$('#questionText').val()+']]>');
	}else{
		$(edit.xmlFile).find('item').eq(sequenceCountNum).find('question').html($('#questionText').val());
	}
	if(isNaN(questionFontSize) || questionFontSize == ''){
		//not number
		$(edit.xmlFile).find('item').eq(sequenceCountNum).find('question').removeAttr('fontSize');
	}else{
		$(edit.xmlFile).find('item').eq(sequenceCountNum).find('question').attr('fontSize', questionFontSize);
	}
	$(edit.xmlFile).find('item').eq(sequenceCountNum).find('question').attr('audio', $('#questionAudio').val());
	
	loadEditQuestion(true);
}

/*!
 * 
 * UPDATE ANSWERS - This is the function that runs to update answers value
 * 
 */
function updateAnswers(){
	//update array
	question_arr[sequenceCountNum].answerLayout = $('#answerlayoutlist').val();
	question_arr[sequenceCountNum].correctAnswer = $('#correctAnswer').val();
	question_arr[sequenceCountNum].answerOffsetY = $('#answerOffsetY').val();
	
	var answerFontSize = $('#answerFontSize').val();
	answerFontSize = answerFontSize == 0 ? undefined : answerFontSize;
	var answerWidth = $('#answerWidth').val();
	answerWidth = answerWidth == 0 ? undefined : answerWidth;
	var answerHeight = $('#answerHeight').val();
	answerHeight = answerHeight == 0 ? undefined : answerHeight;
	var answerX = $('#answerX').val();
	answerX = answerX == 0 ? undefined : answerX;
	var answerY = $('#answerY').val();
	answerY = answerY == 0 ? undefined : answerY;
	
	question_arr[sequenceCountNum].answer[edit.answerNum].type = $('#answertype').val();
	question_arr[sequenceCountNum].answer[edit.answerNum].text = $('#answerText').val();
	question_arr[sequenceCountNum].answer[edit.answerNum].fontSize = answerFontSize;
	question_arr[sequenceCountNum].answer[edit.answerNum].width = answerWidth;
	question_arr[sequenceCountNum].answer[edit.answerNum].height = answerHeight;
	question_arr[sequenceCountNum].answer[edit.answerNum].x = answerX;
	question_arr[sequenceCountNum].answer[edit.answerNum].y = answerY;
	question_arr[sequenceCountNum].answer[edit.answerNum].audio = $('#answerAudio').val();
	
	//update XML
	$(edit.xmlFile).find('item').eq(sequenceCountNum).find('answers').attr('answerLayout', $('#answerlayoutlist').val());
	$(edit.xmlFile).find('item').eq(sequenceCountNum).find('answers').attr('correctAnswer', $('#correctAnswer').val());
	$(edit.xmlFile).find('item').eq(sequenceCountNum).find('answers').attr('answerOffsetY', $('#answerOffsetY').val());
	
	$(edit.xmlFile).find('item').eq(sequenceCountNum).find('answers answer').eq(edit.answerNum).attr('type', $('#answertype').val());
	if($('#answertype').val() == 'text'){
		$(edit.xmlFile).find('item').eq(sequenceCountNum).find('answers answer').eq(edit.answerNum).html('<![CDATA['+$('#answerText').val()+']]>');
	}else{
		$(edit.xmlFile).find('item').eq(sequenceCountNum).find('answers answer').eq(edit.answerNum).html($('#answerText').val());
	}
	
	var answerFontSize = $('#answerFontSize').val();
	if(isNaN(answerFontSize) || answerFontSize==''){
		$(edit.xmlFile).find('item').eq(sequenceCountNum).find('answers answer').eq(edit.answerNum).removeAttr('fontSize');
	}else{
		$(edit.xmlFile).find('item').eq(sequenceCountNum).find('answers answer').eq(edit.answerNum).attr('fontSize', answerFontSize);
	}
	
	var answerWidth = $('#answerWidth').val();
	if(isNaN(answerWidth) || answerWidth == ''){
		$(edit.xmlFile).find('item').eq(sequenceCountNum).find('answers answer').eq(edit.answerNum).removeAttr('width');
	}else{
		$(edit.xmlFile).find('item').eq(sequenceCountNum).find('answers answer').eq(edit.answerNum).attr('width', answerWidth);
	}
	var answerHeight = $('#answerHeight').val();
	if(isNaN(answerHeight) || answerHeight == ''){
		$(edit.xmlFile).find('item').eq(sequenceCountNum).find('answers answer').eq(edit.answerNum).removeAttr('height');
	}else{
		$(edit.xmlFile).find('item').eq(sequenceCountNum).find('answers answer').eq(edit.answerNum).attr('height', answerHeight);
	}
	var answerX = $('#answerX').val();
	if(isNaN(answerX) || answerX == ''){
		$(edit.xmlFile).find('item').eq(sequenceCountNum).find('answers answer').eq(edit.answerNum).removeAttr('x');
	}else{
		$(edit.xmlFile).find('item').eq(sequenceCountNum).find('answers answer').eq(edit.answerNum).attr('x', answerX);
	}
	var answerY = $('#answerY').val();
	if(isNaN(answerY) || answerY == ''){
		$(edit.xmlFile).find('item').eq(sequenceCountNum).find('answers answer').eq(edit.answerNum).removeAttr('y');
	}else{
		$(edit.xmlFile).find('item').eq(sequenceCountNum).find('answers answer').eq(edit.answerNum).attr('y', answerY);
	}
	$(edit.xmlFile).find('item').eq(sequenceCountNum).find('answers answer').eq(edit.answerNum).attr('audio', $('#answerAudio').val());
	
	loadEditQuestion(true);
}


/*!
 * 
 * GENERATE ARRAY - This is the function that runs to generate array
 * 
 */
function generateXML(){
	var xmlstr = edit.xmlFile.xml ? edit.xmlFile.xml : (new XMLSerializer()).serializeToString(edit.xmlFile);
	$('#outputXML').val(xmlstr);
}

function saveXML(pass){
	var xmlstr = edit.xmlFile.xml ? edit.xmlFile.xml : (new XMLSerializer()).serializeToString(edit.xmlFile);
	
	$.ajax({
		type: "POST",
		url: "save.php",
		data: {password:pass,
				data:xmlstr}
				
	}).done(function(o) {
		try {
			$.parseJSON(o);
		} catch (e) {
			alert('Error, file cannot save!');
		}
		
		var data = $.parseJSON(o);
		if (!data || data === null) {
			alert('Error, file cannot save!');
		}else{
			if(data.status==true){
				alert('File save successful!');
			}else{
				if(data.option==true){
					alert('Wrong password, file cannot save!');
				}else{
					alert('Save option disabled!');
				}
			}
		}
	});	
}