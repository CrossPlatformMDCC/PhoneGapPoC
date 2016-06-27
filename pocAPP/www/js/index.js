/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
 var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        navigator.accelerometer.watchAcceleration(onAccSuccess, onAccError, 
            {frequency: 100});
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        //console.log('Received Event: ' + id);
    }
};

var position;
var photos = [];
var photoIndex = 0;
var mudou = false;

var canvas,
context,
image,
imgObj,
noise = 20;

// onSuccess: Get a snapshot of the current acceleration
function onAccSuccess(acceleration) {
    // console.log(acceleration.x);
    // document.getElementById('camera_status').innerHTML = '\nAcceleration X: ' + acceleration.x + '\n';
    if(acceleration.x > 4 && !mudou){
        showPicture(photoIndex-1);
        mudou = true;
    }
    if(acceleration.x < -4 && !mudou){
        showPicture(photoIndex+1);
        mudou = true;
    }
    if(acceleration.x > -2 && acceleration.x < 2){    
        mudou = false;
    }
}
// onError: Failed to get the acceleration
function onAccError() {
    // document.getElementById('camera_status').innerHTML = 'onError!';
}

function showPicture(index){
    if(index >= photos.length)
        index = 0;
    if(index < 0)
        index = photos.length-1;
    var img = document.getElementById('camera_image');
    img.src = photos[index];
    photoIndex = index;
    if(photos.length > 0)
        $("#nImage").html(index+1 + " de " + photos.length);
}

/**
 * Take picture with camera
 */
 function takePicture() {
    navigator.camera.getPicture(
        function(uri) {
            var img = document.getElementById('camera_image');
            img.style.visibility = "visible";
            img.style.display = "block";
            img.src = uri;
            photos[photos.length] = uri;
            // document.getElementById('camera_status').innerHTML = "Success";
            photoIndex = photos.length;
            $("#nImage").html(photoIndex + " de " + photos.length);
        },
        function(e) {
            //console.log("Error getting picture: " + e);
            // document.getElementById('camera_status').innerHTML = "Error getting picture.";
        },
        { quality: 100,
          correctOrientation: true, 
          targetWidth: 1100,
          DestinationType: navigator.camera.DestinationType.FILE_URI,
          sourceType : Camera.PictureSourceType.CAMERA,
          encodingType: Camera.EncodingType.JPEG,
          saveToPhotoAlbum: true});
};

// ----- upload fotos -----

//function uploadPhoto() {

  //  var win = function(r) {
    //console.log("Code = " + r.responseCode);
    //console.log("Response = " + r.response);  
    //console.log("Sent = " + r.bytesSent);
    //}

    //var fail = function(error) {
      //  alert("An error has occurred: Code = " = error.code);
    //}

    //var options = new FileUploadOptions();
    //options.fileKey="file";
    //options.fileName="arquivo";
    //options.mimeType="image/jpeg";
    //options.httpMethod = "POST";

    //var params = new Object();
    //params.value1 = "test";
    //params.value2 = "param";

    //options.params = params;
    //options.chunkedMode = false;

    //var filePath =  canvas.toDataURL();

    //var ft = new FileTransfer();
    //ft.upload(filePath, "http://loccam.great.ufc.br/downloadFiles/upload/recebeUpload.php", win, fail, options);
//}

//-----------------------------------



function shareLocation() {
    navigator.geolocation.getCurrentPosition(locationSuccess,locationError);
};

function locationSuccess(position) {
    var currentLocation = position.coords.latitude + ',' + position.coords.longitude;
    var link = "https://maps.google.com/maps?q=" + currentLocation;
    window.plugins.socialsharing.share('Compartilhar posição', null, null, link);
}

function locationError(error) {
    alert('Error code: ' + error.code + '\n' +
      'Message: ' + error.message + '\n');
}

function logIn(){
    var $loginStatus = $('#login_status');

    googleapi.authorize({
        client_id: '797617424834-rn2l04h8s4v5u3jf9io3643ed9p9revp.apps.googleusercontent.com',
        client_secret: '',
        redirect_uri: 'http://localhost',
        scope: 'https://www.googleapis.com/auth/analytics.readonly'
    }).done(function(data) {
            // $loginStatus.html('Token: ' + data.access_token);
            // $("#btnLogin").hide();
            // $("#btnShare").show();
            //console.log(data);
            $("#btnShare").prop("disabled", true);
        }).fail(function(data) {
            $loginStatus.html(data.error);
        });
    };

    var googleapi = {
        authorize: function(options) {
            var deferred = $.Deferred();

        //Build the OAuth consent page URL
        var authUrl = 'https://accounts.google.com/o/oauth2/auth?' + $.param({
            client_id: options.client_id,
            redirect_uri: options.redirect_uri,
            response_type: 'code',
            scope: options.scope
        });

        //Open the OAuth consent page in the InAppBrowser
        var authWindow = window.open(authUrl, '_blank', 'location=no,toolbar=no');

        //The recommendation is to use the redirect_uri "urn:ietf:wg:oauth:2.0:oob"
        //which sets the authorization code in the browser's title. However, we can't
        //access the title of the InAppBrowser.
        //
        //Instead, we pass a bogus redirect_uri of "http://localhost", which means the
        //authorization code will get set in the url. We can access the url in the
        //loadstart and loadstop events. So if we bind the loadstart event, we can
        //find the authorization code and close the InAppBrowser after the user
        //has granted us access to their data.
        $(authWindow).on('loadstart', function(e) {
            var url = e.originalEvent.url;
            var code = /\?code=(.+)$/.exec(url);
            var error = /\?error=(.+)$/.exec(url);

            if (code || error) {
                //Always close the browser when match is found
                authWindow.close();
            }

            if (code) {
                //Exchange the authorization code for an access token
                $.post('https://accounts.google.com/o/oauth2/token', {
                    code: code[1],
                    client_id: options.client_id,
                    client_secret: options.client_secret,
                    redirect_uri: options.redirect_uri,
                    grant_type: 'authorization_code'
                }).done(function(data) {
                    deferred.resolve(data);
                }).fail(function(response) {
                    deferred.reject(response.responseJSON);
                });
            } else if (error) {
                //The user denied access to the app
                deferred.reject({
                    error: error[1]
                });
            }
        });

return deferred.promise();
}
};

// ----- effects functions -----
function canvasToImage() {
    image.src = canvas.toDataURL();
}

function grayscaleImage() {
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    for (var i = 0, n = imageData.data.length; i < n; i += 4) {
        var grayscale = imageData.data[i] * .3 + imageData.data[i+1] * .59 + imageData.data[i+2] * .11;
        imageData.data[i] = grayscale; // red
        imageData.data[i+1] = grayscale; // green
        imageData.data[i+2] = grayscale; // blue
    }
    context.putImageData(imageData, 0, 0);
    canvasToImage();
}
function processSepia() {
    var imageData = context.getImageData(0,0,canvas.width,canvas.height);
    var r, g, b;
    for (var i=0; i < imageData.data.length; i+=4) {
        r = imageData.data[i];
        g = imageData.data[i+1];
        b = imageData.data[i+2];
        imageData.data[i] = r * 0.393 + g * 0.769 + b * 0.189;
        imageData.data[i+1] = r * 0.349 + g * 0.686 + b * 0.168;
        imageData.data[i+2] = r * 0.272 + g * 0.534 + b * 0.131;
        
        
        
    }
    context.putImageData(imageData, 0, 0);
    canvasToImage();
};

function invertColors() {
    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    for (var i = 0, n = imageData.data.length; i < n; i += 4) {
        imageData.data[i] = 255 - imageData.data[i];     // red
        imageData.data[i+1] = 255 - imageData.data[i+1]; // green
        imageData.data[i+2] = 255 - imageData.data[i+2]; // blue
    }
    context.putImageData(imageData, 0, 0);
    canvasToImage();
}

function reset() {
    image = document.getElementById('camera_image');
    context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, 10, 10); // reduce the image
}

