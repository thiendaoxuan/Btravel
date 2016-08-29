$(document).ready(function() {

	// CHUAN BI SAN MOT SO FAKE DATA :(
		var fake_data = [
    {"title":"Brighton, United Kingdom","imgLink" : "res\fakeImg\1.jpg" ,"summary":"Londoners have been traveing to Brighton for beach getaways ever since the railway arrived here in 1841. The pebbled beach, Brighton Pier's amusement arcade and the Royal Pavilion are the main sights, but you'll also find hundreds of pubs and clubs catering to an energetic crowd"},
    {"title":"Brighton2, United Kingdom","imgLink" : "res\fakeImg\2.jpg" ,"summary":"Londoners have been traveing to Brighton for beach getaways ever since the railway arrived here in 1841. The pebbled beach, Brighton Pier's amusement arcade and the Royal Pavilion are the main sights, but you'll also find hundreds of pubs and clubs catering to an energetic crowd"},
    {"title":"Brighton3, United Kingdom","imgLink" : "res\fakeImg\3.jpg" ,"summary":"Londoners have been traveing to Brighton for beach getaways ever since the railway arrived here in 1841. The pebbled beach, Brighton Pier's amusement arcade and the Royal Pavilion are the main sights, but you'll also find hundreds of pubs and clubs catering to an energetic crowd"},
    
];

$(".page-scroll").click(function(){
    $('html, body').animate({
        scrollTop: $( $.attr(this, 'href') ).offset().top
    }, 500);
    return false;
});
	
	
	
});

