	$(document).ready(function() {
		createDatePicker();
		initialize();
		google.maps.event.addDomListener(window, 'load',
			initialize);

	

	$("#createForm").ajaxForm ({
		data : $('form').serialize()  + "&detail0=" + $("#detail0").val(),
		complete: function(data) {

		console.log(data.responseText);
		}
	})



		// Thuc hien post data lên server, nếu thành công thì ghi vào local session "currentUser"
		document.getElementById('createForm').onsubmit = function(event) {		
			event.preventDefault();

/*			$.ajax({
            type: 'post',
            url: $('form').attr( 'action' ),
            data: $('form').serialize()  + "&detail0=" + $("#detail0").val(),
            success: function (data) {
              console.log(data);
            }
          });


          */
      }
  }
)
      function IsJsonString(str) {
      	try {
      		JSON.parse(str);
      	} catch (e) {
      		return false;
      	}
      	return true;
      }

  
  

	function createDatePicker() {
		$("#startDate").dateDropdowns({
			submitFieldName: '#startDate',
			submitFormat: "yyyy-mm-dd"
		});

	}


//google auto complete search place
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
            //getTrips();
            address = removeDiacritics(place.formatted_address);
        }
    })
}