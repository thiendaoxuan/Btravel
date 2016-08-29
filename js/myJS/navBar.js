$(document).ready(function() {


	if (!checkValidToken()) return;
	//Load menu bar dựa theo việc đã login hay chưa
		var menuBar = document.getElementById("menuBar");
		var currentUser = localStorage.getItem("currentUser");

		$("#findTripPagebtn").click (refresh_search);
		
		if(currentUser){

			var $html = $("<li>"+ "<a class='page-scroll' href='userView.html'> "+currentUser+" </a>"  + "</li>");
			var $html2 = $("<li>"+ "<a class='page-scroll' href='login.html' onclick='logout_func()'>" + "Logout" + "</a>"  + "</li>");
			$('#menuBar').append($html );
			$('#menuBar').append($html2);
		}
		else {
			var $html = $("<li>"+ "<a class='page-scroll' href='login.html'>" + "Login" + "</a>"  + "</li>");
			var $html2 = $("<li>"+ "<a class='page-scroll' href='signUp.html'>" + "Sign Up" + "</a>"  + "</li>");
			$('#menuBar').append($html );
			$('#menuBar').append($html2);
		}


	})

function refresh_search (){
	
	localStorage.removeItem('local_search');
	localStorage.removeItem('city_search');
	localStorage.removeItem('lastID');
}

function checkValidToken (){
	if(!localStorage.token) return true;

	var posting = $.post(tokenCheckerURL, {
        token: localStorage.token
    });

    

    posting.done(function(data) {
    	
        result = JSON.parse(data);
        if(result.code){
            if(!codeHandler(result.code)) return false
        }
    });

    return true;
}