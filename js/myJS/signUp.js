$(document).ready(function() {

	showToolTip();
	createDatePicker();

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
			userName: encodeURI($('#username').val()),
			passwords: encodeURI($('#passwords').val()),
			email: $('#email').val(),
			firstName: encodeURI($('#firstname').val()),
			lastName: encodeURI($('#lastname').val()),
			birthDate : $('#birthdate').val(),
			gender: gender,

		});

		posting.done(function(data) {
			
			
			var response = JSON.parse(data);
			if(response.code == 2001) {showMessageBox ('Message', 'This username has been used');return;}
			if(response.code == 2002) {showMessageBox ('Message', 'This email has been used');return;}
			if(response.code != 0){showMessageBox ('Message', 'Unknown error');return;}
			showMessageBox ('SUCCESS', "Your account has been successfully created. If your email is correct, you'll receive a confirmation link via email within 2 mininutes ")
			$("#messageBox").on('hidden.bs.modal', function () {
    			window.location.href = 'index.html';
    						})
			

		});

		// Store username vào session, chuyển tới trang chủ

	}
});

function showToolTip() {
	$('#username').tooltip({
		'trigger': 'focus',
		'data-placement': "right",
		'title': 'USERNAME : 6-32 charaters, No caseSensitive, Only letters and numbers'
	});
	$('#passwords').tooltip({
		'trigger': 'focus',
		'data-placement': "right",
		'title': 'PASSWORD : 6-32 charaters, CaseSensitive, Only letters and numbers. Must be different from username,firstname and lastname'
	});
}

function checkInputData() {
	var output = true;

	var userNamez = $('#username').val().toLowerCase();
	var passwords = $('#passwords').val();
	var repasswords = $('#repasswords').val();
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
	if (PassWordsRule.test(passwords)) {
		highLight($('#passwords'));
		output = false;
	}
	if (passwords != repasswords) {
		highLight($('#repasswords'));
		output = false;
	}
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

function createDatePicker() {
	$("#birthdate").dateDropdowns({
		submitFieldName: '#birthdate',
		submitFormat: "yyyy-mm-dd"
	});

}