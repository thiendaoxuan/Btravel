var activateState = -1;
var tripID;
var tripID = getUrlParameter('tripID')
var canInteract = false;

$(document).ready(function() {
    localStorage.removeItem('commentNum')
    $("#groupChatModal").on("shown.bs.modal", function() {
        if (!localStorage.commentNum) loadComment();
    })
    localStorage.setItem('timeRestrictJointLeave', "30")
    $("#join_leave").hide();

    
    
    getTripInfo(tripID);



})

function getTripInfo(tripID) {
    $("#waitspin").show();

    var result;
    var posting = $.post(infoURL, {
        tripID: tripID,
        token: localStorage.token
    });
    posting.done(function(data) {
        //alert(data);
        result = JSON.parse(data);
        if (result.code) {
            if (result.code != 0) {
                showMessageBox("Error", "You cant view this Trip")
                $("#messageBox").on('hidden.bs.modal', function () {
    			window.location.href = 'findTrip.html';
    			})
            }
        }
        displayInfo(result);
        $("#waitspin").hide();
        getHighLightsInfo(tripID);
        if (localStorage.token) {
            checkJoint();
        }
        peopleInTrip();
        decreaseTime();
    });
}

function displayInfo(dataJSON_root) {
    dataJSON = dataJSON_root.data

    $("#cover").attr('src', stripslashes(dataJSON.cover))
    $("#title").text(dataJSON.title);
    $("#guideName").text(dataJSON.userName);
    $("#summaryText").text(dataJSON.summary);
    $("#mainDestText").text(getPlaceText(dataJSON.mainDest))
    initMap(dataJSON.mainDest)
    if (dataJSON.startDate) $("#departureDetail").text(dataJSON.startDate)
    $("#groupSizeDetail").text(dataJSON.minMember + '-' + dataJSON.maxMember +
        ' people')
    $("#priceDetail").text(dataJSON.price + '$')
    $('#durationDetail').text(dataJSON.duration + 'h')
    if (dataJSON.avatarLink) $("#guideAvatar").attr('src',
        stripslashes(dataJSON.avatarLink))
    $("#guideFirstName").text(dataJSON.firstName)
    $("#guideLastName").text(dataJSON.lastName)
    $("#guideBirthDate").text(dataJSON.birthDate)
    $("#guideEmail").text(dataJSON.email)
    if (dataJSON.phone) $("#guidePhone").text(dataJSON.phone)
    $("#viewGuide").attr('href', 'userView.html?userName=' + dataJSON.userName)
    activateState = dataJSON.Activate
    if (dataJSON_root.isHost == "1") {
        $("#modify").css("visibility", "visible");
        if (activateState != 2) $("#modify2").hide();
        $("#join_leave").remove();
        $("#group_chat_icon").show()
    }
    if (activateState == 1) {
        $("#join_leave").remove();
        $("#modify2").remove();
        $("#modify1").remove();
    }
}

function getHighLightsInfo(tripID) {
    var posting = $.post(highLightsURL, {
        tripID: tripID
    });
    posting.done(function(data) {
        result = JSON.parse(data);
        $("#break1").after(createHightLightsHTML(result));
    });
}

function createHightLightsHTML(dataJSON) {
    var result = "";
    for (i = 0; i < dataJSON.length; i = i + 1) {
        var highLigh = "<div id='highLightArea'><img src='" +
            stripslashes(dataJSON[i].pictureURL) +
            "' class='tripImages'><h4 class='centerText detailTitle'>" +
            dataJSON[i].highLightTitle +
            "</h4><p class='highLightInfo'>" + dataJSON[i].highLightDescription +
            "</p></div>"
        result = result + highLigh;
    }
    return result;
}

function initMap(address, callback) {
    var minZoomLevel = 12;
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'address': address
    }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var mapProp = {
                center: results[0].geometry.location,
                zoom: 8,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById(
                "googleMap"), mapProp);
            var icon = {
                url: "img/here_icon.ico", // url
            };
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,
                icon: "img/here_icon.png"
            });
            // Ko cho zoom quá sâu hoặc drag khỏi tâm bản đồ
            google.maps.event.addListener(map, 'dragend',
                function() {
                    // We're out of bounds - Move the map back within the bounds
                    var c = map.getCenter(),
                        x = c.lng(),
                        y = c.lat()
                    map.setCenter(new google.maps.LatLng(
                        y, x));
                    // Limit the zoom level
                    google.maps.event.addListener(map,
                        'zoom_changed',
                        function() {
                            if (map.getZoom() >
                                minZoomLevel) map.setZoom(
                                minZoomLevel);
                        });
                });
        }
    });
}

function decreaseTime() {
    var timeRestrictJointLeave = localStorage.timeRestrictJointLeave;
    time = parseInt(timeRestrictJointLeave);
    if (time == 0) return;
    time = time - 1;
    localStorage.setItem('timeRestrictJointLeave', time);
    window.setTimeout(decreaseTime, 1000);
}

function joinTrip() {
    var encryptedID = localStorage.currentUserID;
    var result;
    var timeRestrictJointLeave = localStorage.timeRestrictJointLeave;
    if (!timeRestrictJointLeave) localStorage.setItem('timeRestrictJointLeave', "30");
    else if (timeRestrictJointLeave == "0") localStorage.setItem('timeRestrictJointLeave', "30");
    else {
        string = "Please read and consider carefully before joining any trip. Try again in " + localStorage.timeRestrictJointLeave +
            " seconds"
        showMessageBox("Don't rush your decision", string);
        return;
    }
    var posting = $.post(joinTripURL, {
        token: localStorage.token,
        tripID: tripID
    });
    posting.done(function(data) {
        result = JSON.parse(data);
        if (result.code) {
            if (!codeHandler(result.code)) return
        }
        if (result.code == 0) {
            showMessageBox('Success',
                'You have successfully sign-up for this trip, please join group discussion or contact guide for more information'
            )
            $("#join_leave").text('Leave Trip')
            $("#join_leave").attr("onclick", 'leaveTrip()')
            $("#join_leave").attr("style", 'background-color: #ff6600;')
            $("#group_chat_icon").show()
        } else showMessageBox('Error',
            'Unable to join trip, please try again, sorry for this inconvinience')
    });
}

function leaveTrip() {
    var result;
    localStorage.setItem('timeRestrictJointLeave', '30');
    decreaseTime();
    var posting = $.post(leaveTripURL, {
        token: localStorage.token,
        tripID: tripID
    });
    posting.done(function(data) {
        result = JSON.parse(data)
        if (result.code == 0) {
            showMessageBox('Success', 'You have left this trip.')
            $("#join_leave").text('Join Trip')
            $("#join_leave").attr("onclick", 'joinTrip()')
            $("#join_leave").attr("style", 'background-color: #33cc33;')
            $("#group_chat_icon").hide()
        } else showMessageBox('Error',
            'Unable to leave trip, please try again, sorry for this inconvinience')
    });
}

function checkJoint() {
    var result;
    var posting = $.post(checkJointURL, {
        token: localStorage.token,
        tripID: tripID
    });
    posting.done(function(data) {
        result = JSON.parse(data)
        if (result.code == 1) {
            $("#join_leave").text('Leave Trip')
            $("#join_leave").attr("onclick", 'leaveTrip()')
            $("#join_leave").attr("style", 'background-color: #ff6600;')
            $("#group_chat_icon").show()
        }
        $("#join_leave").show();
    });
}

function peopleInTrip() {
    var result;
    var posting = $.post(peopleInTripURL, {
        tripID: tripID
    });
    posting.done(function(data) {
        result = JSON.parse(data)
        if (result.code == 5000) showMessageBox("Error", "Query Failed !");
        if (result.code == 0) {
            for (i = 0; i < result.PeopleInTrip.length; i++) {
                addPeople(result.PeopleInTrip[i].avatarLink, result.PeopleInTrip[i].userName)
            }
        }
    });
}

function addPeople(zavatar, userName) {
    var avatar;
    if (!zavatar) avatar = "img/unknownAvatar.png";
    else avatar = zavatar;
    var HTML = "<div class='row detail_margin'> <div class='col-xs-2'>" +
        "  <img class='detail_icon' src='" + avatar +
        "'> </div> <div class='col-xs-10 centerVertical'> <span class='detailTitle'>  &nbsp " + userName +
        "</span></div></div>"
    var $result = $(HTML);
    $("#peopleInTrip").append($result)
}
/*
function endTrip (){
    link = "http://51304928.host22.com/deleteTrip.php"
    var result;
    
    var posting = $.post(link, {
        
        tripID: tripID,
        token : localStorage.token
    });
    posting.done(function(data) {
        window.location.href = 'findTrip.html';
    })
        
        
       
        
    }
    */
function makeCommentHTML(data) {
    avatarLink = 'img/unknownAvatar.png'
    if (data.avatarLink) avatarLink = data.avatarLink
    var HTML = "<div class='row'>" +
        "<div class='col-xs-2'>" +
        "<img class='avatar_chat' src = '" + avatarLink + "'>" +
        "</div>" +
        "<div class='col-xs-10'>" +
        "<span class='userName_chat' id = 'userName_chat'> " + data.userName + ":</span>" +
        "<span>&nbsp </span>" +
        "<span class='text_chat' id = 'text_chat'> " + data.text + " </span>" +
        "</div>" +
        "</div>"
    return HTML
}

function loadComment() {
    commentNum = 5
    if (localStorage.commentNum) commentNum = parseInt(localStorage.commentNum) + 5
    var posting = $.post(getCommentURL, {
        tripID: tripID,
        token: localStorage.token,
        commentNum: commentNum
    });
    posting.done(function(data) {
        data = JSON.parse(data)
        if (data.code == '4000') {
            $('#loadMoreComment').hide();
            return;
        }
        $('#comment_box').empty()
        commentData = data.comments
        for (i = commentData.length - 1; i > -1; i--) {
            html = makeCommentHTML(commentData[i])
            $('#comment_box').append(html)
        }
        if (commentData.length < commentNum) $('#loadMoreComment').hide();
        else $('#loadMoreComment').show();
        localStorage.setItem('commentNum', commentNum)
    })
}

function postComment() {
    text = '';
    text = $("#writeComment").val();
    if (text.length < 1) return
    var posting = $.post(postCommentURL, {
        tripID: tripID,
        token: localStorage.token,
        text: text
    })
    posting.done(function(data) {
        if (data == '3') return
        loadComment()
        $("#writeComment").val('')
    })
}

function startTrip() {
    alert(tripID)
    if (activateState != 2) return;
    var start = confirm("Do you want to start this trip ?");
    if (!start) {
        return;
    }
    var posting = $.post(startTripURL, {
        tripID: tripID,
        token: localStorage.token
    });
    posting.done(function(data) {
        dataJSON = JSON.parse(data)
        alert(data)
        if (dataJSON.code == 0) {
            location.reload();
        } else showMessageBox("Error", "Please try again later")
    })
}

function closeTrip() {
    //Caancel trip
    if (activateState != 0) {
        var confirmz = confirm("Are you sure you want to cancel this trip ?");
        if (confirmz) {
            var posting = $.post(endTripURL, {
                tripID: tripID,
                token: localStorage.token
            });
            posting.done(function(data) {
                dataJSON = JSON.parse(data)
                if (dataJSON.code == 0) {
                    location.reload();
                } else showMessageBox("Error", "Please try again later")
            })
        }
        return
    }
    // end trip
    var end = confirm("Are you sure you want end this trip ? You will be rated by guest in trip");
    if (!end) {
        return;
    }
    var posting = $.post(endTripURL, {
        tripID: tripID,
        token: localStorage.token
    });
    posting.done(function(data) {
        dataJSON = JSON.parse(data)
        if (dataJSON.code == 0)
            location.reload();
        else showMessageBox("Error", "Please try again later")
    })
}