/**Works on all versions prior and including Cordova 1.6.1 
* by mcaesar
*  MIT license
*  
*/

(function() {
    /* This increases plugin compatibility */
    var cordovaRef = window.PhoneGap || window.Cordova || window.cordova; // old to new fallbacks

    /**
    * The Java to JavaScript Gateway 'magic' class 
    */
    function GooglePlusShareImage() { }

    /**
    * Save the base64 String as a PNG file to the user's Photo Library
    */
    GooglePlusShareImage.prototype.saveImage = function(b64String, params, win, fail) {
        cordovaRef.exec(win, fail, "GooglePlusShareImage", "saveImage", [b64String, params]);
    };

    cordovaRef.addConstructor(function() {
        if (!window.plugins) {
            window.plugins = {};
        }
        if (!window.plugins.GooglePlusShareImage) {
            window.plugins.GooglePlusShareImage = new GooglePlusShareImage();
        }
    });

})(); 