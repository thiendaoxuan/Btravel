
var userName = undefined;
$(document).ready(function() {
    userName = getUrlParameter('userName')
    loadAndSet();
})

function loadAndSet () {

    if(!localStorage.token){
        showMessageBox ("No permission", "Sorry! Guest cannot view user's profile. Please login or sign-up")
        $('#messageBox').on('hidden.bs.modal', function () {
        goBack()
        })
        return
    }

    if(userName)$("#changeAvatarForm").remove();

    loadUserInfo();
    loadJointTrip();
    loadGuideTrip();
	getStarRate();
}


function displayInfo (dataJSON) {

	if(dataJSON.avatarLink) $("#userAvatar").attr('src', dataJSON.avatarLink);
	$("#userEmail").text(dataJSON.email);
	if(dataJSON.phone) $("#userPhone").text(dataJSON.phone)
	$("#userRealName").text ( dataJSON.firstName + ' ' + dataJSON.lastName);
	$("#userBirthDate").text ( dataJSON.birthDate);
	if(dataJSON.gender == '0')$("#userGender").text("Women"); else $("#userGender").text("Men");
	if(dataJSON.language) $("#userLanguage").text(dataJSON.language)
}



function loadUserInfo (){
    var result;
    
   


    var   posting = $.post(userInfoURL, {
        token: localStorage.token,
        userName : userName
    });
    

    posting.done(function(data) {
    
        result = JSON.parse(data);
        displayInfo(result);
    });
}




function loadJointTrip(){

    var result;
    var  posting = $.post(getUserJointTrip, {
        token: localStorage.token,
        userName : userName
    });   

    posting.done(function(data) {
      
        result = JSON.parse(data);
        displayTrips(result);
    });
}

function loadGuideTrip(){

    var result;
    var  posting = $.post(getGuideTrip, {
        token: localStorage.token,
        userName : userName
    });   

    posting.done(function(data) {
        
        result = JSON.parse(data);
        displayTrips2(result);
    });
}





function displayTrips (data){
    for(i =0 ; i < data.length; i ++){
        addOneJointTrip(data[i]);
    }
    
}
function displayTrips2 (data){
    for(i =0 ; i < data.length; i ++){
        addOneGuideTrip(data[i]);
    }
    
}


function addOneJointTrip (data){

    var link = "tripView.html?tripID=" + data.tripID
    var $HTML = $("<div class='oneTrip'>" + 
            "<img src=" + data.cover  + ">" +
           
            "<p>" +  data.title   + "</p>" +            
            "</div>");
     $HTML.click(function(){
        window.location.replace(link)
    })
    $('#tripJoint').append($HTML)
}

function addOneGuideTrip (data){
    var link = "tripView.html?tripID=" + data.tripID
    var $HTML = $("<div class='oneTrip'>" + 
            "<img src=" + data.cover  + ">" +
           
            "<p>" +  data.title   + "</p>" +            
            "</div>");
    $HTML.click(function(){
        window.location.replace(link)
    })
    $('#tripGuide').append($HTML)
}


function getStarRate (){
    addRateStar(randomIntFromInterval(1,5));

}


function addRateStar ( score) {
    $rate = $("#rate");

    $star = $('<span><i class="fa fa-star" aria-hidden="true"></i><span>');
    $half = $('<span><i class="fa fa-star-half-o" aria-hidden="true"></i><span>');
    $empty = $('<span><i class="fa fa-star-o" aria-hidden="true"></i><span>');

    var round = Math.round(score*2)/2;

    var j = 5;
    for (  i = 0 ; i < round - 0.5; i++){
        $rate.append($star.clone());

        
        j--;
    }

    if(round%1 == 0.5) {

        $rate.append($half.clone());
        j--;
    }

    for ( i = 0 ; i < j ; i++){
        $rate.append($empty.clone());
        
    }
}

function showUploadAvatar (){
    $("#uploadAvatar").show();
}

function hideUploadAvatar (){
    $("#uploadAvatar").hide();
}

function uploadAvatar (){
    if (!$("#avatarToUpload").val()) {showMessageBox ("Error", "Please Choose your picture"); return}

    $("#uploadToken").val(localStorage.token)

    var form = $('#avatarForm')[0];
    var dataToUp = new FormData(form)

    //alert ( dataToUp)
    $.ajax({
        type : 'POST',
        url : uploadAvatarURL,
        data : dataToUp,
        processData: false,
        contentType: false,
        success : function(data){            
            showMessageBox("Message", data)
            loadAndSet();
        }
    })

}