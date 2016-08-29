$(document).ready(function() {

	createDatePicker()
	loadAndSet();


	document.getElementById('signUpForm').onsubmit = function(event) {
		unHighLightTextBox();
		

		/* stop form from submitting normally */
		event.preventDefault();

		/* get some values from elements on the page: */
		var $form = $(this),
			url = $form.attr('action');
			var gender = 0;
		if(($('#gender').is(':checked')))gender = 1;
		
		


		
		if (!checkInputData()) return;
		if(!$('#isAgree').is(':checked')){showMessageBox('Term and Agreement', 'You must accept our term and agreement to create new account');return;}
		
		


		/* Send the data using post */
		var posting = $.post(url, {
			userName: $('#username').val(),
			passwords: $('#passwords').val(),
			email: $('#email').val(),
			firstName: $('#firstname').val(),
			lastName: $('#lastname').val(),
			birthDate : $('#birthdate').val(),
			gender: gender,

		});

		posting.done(function(data) {
			alert(data)
			
			var response = JSON.parse(data);
			if(response.code == 2001) {showMessageBox ('Message', 'This username has been used');return;}
			if(response.code == 2002) {showMessageBox ('Message', 'This email has been used');return;}

			showMessageBox ('SUCCESS', "Your account has been successfully created. If your email is correct, you'll receive a confirmation link via email within 2 mininutes ")
			return;
			window.location.href = 'index.html';

		});

		// Store username vào session, chuyển tới trang chủ

	}

}
)

function displayInfo (data) {
	$("#email").val(data.email);
	$("#firstname").val(data.firstName)
	if(data.phone) $("#phone").val(dataJSON.phone)
	if(data.gender == '1')  document.getElementById("gender").checked = true
}




function loadAndSet () {
	userName = localStorage.currentUser;
	var result;
    
    var posting = $.post(userInfoURL, {
        userName: userName
    });
    posting.done(function(data) {
    	alert(data)
        result = JSON.parse(data);
        displayInfo(result);
    });
}




function createDatePicker() {
	$("#birthdate").dateDropdowns({
		submitFieldName: '#birthdate',
		submitFormat: "yyyy-mm-dd"
	});

}


function checkInputData() {
	var output = true;

	

	var email = $('#email').val();
	var firstName = $('#firstname').val();
	var lastName = $('#lastname').val();
	var birthDate = ($('#birthdate').val());

	var userNameRule = new RegExp(/[^a-z0-9@'.''_''-'*']/); // Test truong hop khong hop le
	if (userNamez.length < 6 || userNamez.length > 32 || userNameRule.test(userNamez)) {
		highLight($('#username'));
		output = false;
	}
	if (passwords.length < 6 || passwords.length > 32 || passwords == userNamez || passwords == firstname || passwords == lastname) {
		highLight($('#passwords'));
		output = false
	}
	var PassWordsRule = new RegExp(/[^a-z0-9A-Z]/); // Test truong hop khong hop le
	/*if (PassWordsRule.test(passwords)) {
		highLight($('#passwords'));
		output = false;
	}*/
	
	if(firstName.length < 1){ highLight($('#firstname')) ; output = false};
	if(lastName.length < 1){ highLight($('#lastname')); output = false};
	
	if(typeof $('#birthdate').val() == 'string')
		{if($('#birthdate').val().length <2 )
				{$('#birthDateLabel').css({'color': 'red'}); output=false}}
				else {$('#birthDateLabel').css({'color': 'red'}); output=false}

	var emailRude = new RegExp(/.+\@.+\..+/);
	if (!emailRude.test(email)){ highLight($('#email')); output = false};


	return output;
}

function highLight(element) {
	element.css({
		"border-color": "red",
		"border-width": "2px"
	});
}

function unHighLight(element){
	element.css({
		"border-color" : "",
		"border-width": "1px"
	})
}

function unHighLightTextBox(){
	unHighLight($('#username'));
	unHighLight($('#passwords'));
	unHighLight($('#repasswords'));
	unHighLight($('#email'));
	unHighLight($('#firstname'));
	unHighLight($('#lastname'));
	$('#birthDateLabel').css({'color':''});
}
