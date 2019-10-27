
var questions = [];
var question_number = 0;
var current_q;
var score = 0;
var button_colors = [];

class Question{
	constructor(q_, a0_, a1_, a2_, a3_, correct_){
		this.q_text = q_;
		this.a = [a0_, a1_, a2_, a3_];
		this.correct_num = correct_;
	}
}

function submitAns(x){
	console.log("You submitted "+x);
	if (x == current_q.correct_num){
		document.getElementById("question").innerHTML = "Correct! Score +1";
		score++;
		document.getElementById("score").innerHTML = "Score: "+score;
	}
	else{
		document.getElementById("question").innerHTML = "Incorrect.";
	}
	document.getElementById("nextt").style.display = "block";
	activateOrDeactivate("b1", false, current_q.correct_num==0);
	activateOrDeactivate("b2", false, current_q.correct_num==1);
	activateOrDeactivate("b3", false, current_q.correct_num==2);
	activateOrDeactivate("b4", false, current_q.correct_num==3);
}

function activateOrDeactivate(id, active, right_ans){
	var elmnt = document.getElementById(id);
	if (active == false){
		elmnt.disabled = true;
		if (right_ans) 
			elmnt.innerHTML = "<strong> <em>"+elmnt.innerHTML+"</em> </strong>";
		else	
			elmnt.style.backgroundColor = "#aaaaaa";
	}
	else{
		elmnt.disabled = false;
		elmnt.style.backgroundColor = button_colors[id];
	}
}

function setup(){
	button_colors["b1"] = document.getElementById("b1").style.backgroundColor;
	button_colors["b2"] = document.getElementById("b2").style.backgroundColor;
	button_colors["b3"] = document.getElementById("b3").style.backgroundColor;
	button_colors["b4"] = document.getElementById("b4").style.backgroundColor;
}

function readInQuestions(which_set){
	setup();
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
		   // Typical action to be performed when the document is ready:
		   //console.log(xhttp.responseText);
		   storeQuestions(xhttp.responseText);
		}
	};
	xhttp.open("GET", which_set+".txt", true);
	xhttp.send();
}

function storeQuestions(all_questions){
	 var str_arr = all_questions.split("\n");
	 console.log(str_arr);
	 /* % Guide:
	 0 - question
	 1 - ans 0
	 2 - ans 1
	 3 - ans 2
	 4 - ans 3
	 5 - correct ans num
	 6 - blank line betw questions
	 */
	 var q = new Question(1,1,1,1,1,1);
	 var i = 0;
	 for (var line = 0; line < str_arr.length; line++){
		 console.log(str_arr[line]);
		 if (i == 0){
			 q.q_text = str_arr[line];
		 }
		 else if (i == 1){
			 q.a[0] = str_arr[line];
		 }
		 else if (i == 2){
			 q.a[1] = str_arr[line];
		 }
		 else if (i == 3){
			 q.a[2] = str_arr[line];
		 }
		 else if (i == 4){
			 q.a[3] = str_arr[line];
		 }
		 else if (i == 5){
			 q.correct_num = str_arr[line];
		 }
		 else if (i == 6) {
			 if (str_arr[line] != "")
				 console.log("Question text may not be formatted properly");
			 questions.push(q);
			 q = new Question(1,1,1,1,1,1);
		 }
		 i = (i+1) % 7;
	 }
	 shuffle(questions);
	 newQuestion();
}

function random(i){
	return Math.floor(Math.random() * (i + 1));
}

function shuffle(cards){
	for (var i = 0; i < cards.length; i++){
		//swap with another element
		var c = random(i);
		if (c != i){
			var temp = cards[i];
			cards[i] = cards[c];
			cards[c] = temp;
		}
	}	
}

function newQuestion(){
	//do the end screen if we're at the end
	if (question_number == questions.length){
		showFinalScreen();
		return;
	}
	
	//activate the choice buttons again
	var b1 = document.getElementById("b1");
	var b2 = document.getElementById("b2");
	var b3 = document.getElementById("b3");
	var b4 = document.getElementById("b4");
	activateOrDeactivate("b1", true, 0);
	activateOrDeactivate("b2", true, 0);
	activateOrDeactivate("b3", true, 0);
	activateOrDeactivate("b4", true, 0);
	
	//hide the next question button
	document.getElementById("nextt").style.display = "none";
	
	//put up the new question
	var q = questions[question_number];
	document.getElementById("question").innerHTML = q.q_text;
	b1.innerText = q.a[0];
	b2.innerText = q.a[1];
	b3.innerText = q.a[2];
	b4.innerText = q.a[3];
	current_q = q;
	question_number++;
}

function showFinalScreen(){
	document.getElementById("b1").style.display = "none";
	document.getElementById("b2").style.display = "none";
	document.getElementById("b3").style.display = "none";
	document.getElementById("b4").style.display = "none";
	
	document.getElementById("question").innerHTML = 
	"All done! Your score is "+score+"/"+questions.length +" ("+ Math.floor(score/questions.length*100)+"%)";
	
	var nextt = document.getElementById("nextt");
	nextt.innerText = "Play Again";
	nextt.onclick = function(){location.reload(true);};
}