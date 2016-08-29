	$(document).ready(function() {

	    //Check token
	    // If invalid => delete token
	    if (localStorage.token) {
	        var posting = $.post(tokenCheckerURL, {
	            token: localStorage.token
	        });
	        posting.done(function(data) {
	            result = JSON.parse(data);
	            if (result.code) {
	                if (result.code == '3000') {
	                    localStorage.removeItem('token')
	                    localStorage.removeItem('currentUser')
	                }

	                else location.href = 'index.html';
	            }
	        });
	    }

	    // Post data, success => write toke & currentUser to localStorage
	    document.getElementById('loginForm').onsubmit = function(event) {
	        /* stop form from submitting normally */
	        event.preventDefault();
	        $('#infoText').text("");
	        
	      
	        if ($('#username').val().length < 6 || $('#passwords').val().length < 6) 
	        	{showMessageBox ("Wrong input", "Username and passwords must have at least 6 characters")
	        	
	    		return}
	        
	    	$("#btn-login").attr("disabled", true);
	        /* get some values from elements on the page: */
	        var $form = $(this),
	            url = $form.attr('action');
	        /* Send the data using post */
	        var posting = $.post(url, {
	            userName: $('#username').val(),
	            passwords: $('#passwords').val()
	        });
	        
	        posting.done(function(data) {
	        	$("#btn-login").attr("disabled", false);
	            var response = JSON.parse(data);
	            if (parseInt(response.code) == 1000) {
	                showMessageBox('Server Error',
	                    "We've encountered some Database problems, please try again later"
	                );
	                return
	            }

	            if (parseInt(response.code) == 2004) {
	                showMessageBox('Not Activate',
	                    "This account has not been activated, please check your email for activation link"
	                );
	                return
	            }
	            if (parseInt(response.code) == 2000) {
	                $('#infoText').text(
	                    "Wrong UserName/Passwords."
	                );
	                return
	            }

	            if (parseInt(response.code) == 0) {
	                localStorage.setItem("currentUser", $('#username').val());
	                localStorage.setItem("token", response.token);
	                window.location.href = 'index.html';
	            }
	        });
	    };

	    function IsJsonString(str) {
	        try {
	            JSON.parse(str);
	        } catch (e) {
	            return false;
	        }
	        return true;
	    }
	});

	function guest() {
	    //Just in case
	    localStorage.removeItem('token')
	    localStorage.removeItem('currentUser')
	    location.href = 'index.html';
	}