

var autocomplete;
var url = "http://51304928.host22.com/getTrips2.php";
$(document).ready(function() {

    localStorage.removeItem('lastID');
    // CHUAN BI SAN MOT SO FAKE DATA :(
    //Load menu bar dựa theo việc đã login hay chưa
    // Chuẩn bị 2 data một lúc
    document.addEventListener('DOMNodeInserted', function(
        event) {
        var target = $(event.target);
        if (target.hasClass('pac-item')) {}
    });
    getTrips();
    initialize();
    google.maps.event.addDomListener(window, 'load',
        initialize);
    
})



function addData(data) {
    // Chuẩn bị 2 data một lúc, thường thì sẽ add 2 dòng = 4 data
    for (i = 0; i < data.length; i = i + 2) {
        var tripData1 = data[i];
        var tripHTML1 = makeTripHTML(tripData1)
        var tripHTML2 ='';
       
        if(i != data.length) {

        var tripData2 = data[i + 1];

        tripHTML2 = makeTripHTML(tripData2)}

       
        var $rowdata = $('<div class="row show-content ">' +
            tripHTML1 +
            tripHTML2 + '</div>')

        $('#tripContent').append($rowdata)
    }
}

function new_search() {}

function more() {
    getTrips();
}

function getTrips() {
    $("#morebtn").replaceWith( '<i id ="morebtn"  class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>' );
    var local = localStorage.local_search;
    var city = localStorage.city_search;
    var lastTrip = '9999999';
    if (localStorage.lastID) lastTrip = localStorage.lastID;
    var posting = $.post(url, {
        tier: "local",
        local: local,
        city: city,
        tripID: lastTrip
    });
    posting.done(function(data) {
  
    	
        var response = JSON.parse(data);
        addData(response.tripList);
        localStorage.setItem("lastID", response.lastID)
        $("#morebtn").replaceWith( '<button  class="btn btn-custom btn-mid " id="morebtn" onclick="more()">More ...</button>' );
        if (response.tripList.length < TRIPS_PER_REQUEST) $(
            "#morebtn").hide();
    });

    	
}


// Google auto complete search for place
function initialize() {
    var input = document.getElementById('search_place');
    var options = {
        types: ['(cities)'],
        componentRestrictions: {
            country: "vn"
        }
    };
    autocomplete = new google.maps.places.Autocomplete(input, options);
    autocomplete.addListener('place_changed', function() {

        //PREPARE NEW SEARCH
        $('#tripContent').empty();
        localStorage.removeItem('lastID');
        $("#morebtn").show();
        var place = autocomplete.getPlace();
        
        if(!place) return
        if (!place.geometry) {
            $("#search_warning").text(
                'Please choose from the drop-down list');
            return;
        } else {
            var local = 'none';
            var city = "none";
            for (var k in place.address_components) {
                var ele = place.address_components[k];
                if (ele.types[0] == 'locality') local = ele.short_name;
                if (ele.types[0] ==
                    'administrative_area_level_1') city = ele
                    .short_name;
            }
            local = removeDiacritics(local);
            city = removeDiacritics(city);
            // IMPORTANT
            $("#search_modal").modal('hide');
            localStorage.setItem('local_search', local)
            localStorage.setItem('city_search', city)
            getTrips();
            address = removeDiacritics(place.formatted_address);
        }
    })
}

function makeTripHTML(tripData1) {

	if(!tripData1) return "";
    var tripHTML1 =
        '<div class="col-md-6 col-sm-6 hero-feature">	<div class="thumb">	<img src="' +
        stripslashes(tripData1.cover) +
        '"alt="" onclick="viewTrip(this.id)" class="clickable" id="' + makeCoverID(
            tripData1) +
        '">	<div class="caption"> <span class="tripTitle clickable"  onclick="viewTrip(this.id)" id=' + makeTitleID(tripData1)   +'>' +
        tripData1.title + '</span> ' +
        '<span style="font-style:italic">' + getPlaceText(tripData1.mainDest) +
        '</span>' + ' <p>' + tripData1.summary +  '<p>By : ' +
        tripData1.guideName + '</p>' +
        '</p></div></div></div>';
    return tripHTML1;
}

function makeCoverID(tripData1) {
    return 'cover' + tripData1.tripID;
}

function makeTitleID(tripData1){
    return 'title' + tripData1.tripID;
}

function viewTrip(id) {    
    window.location = 'tripView.html?tripID=' + id.substring(5, id.length);
}