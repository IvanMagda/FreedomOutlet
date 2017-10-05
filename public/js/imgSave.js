function handleFileSelectMain(evt) {
    var self = this;
    var file = evt.target.files; // FileList object
    var f = file[0];
    // Only process image files.
    if (!f.type.match('image.*')) {
        alert("Image only please....");
    }
    var reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = (function(theFile) {
        return function(e) {
            // Render thumbnail.
            var span = document.createElement('span');
            span.innerHTML = ['<img class="thumb" style="width: 100%; height: 100%;" title="', escape(theFile.name), '" src="', e.target.result, '" />'].join('');
            var myNode = self.parentNode.parentNode.parentNode.parentNode.childNodes[0];
            while (myNode.firstChild) {
                myNode.removeChild(myNode.firstChild);
            }
            
            myNode.insertBefore(span, null);
        };
    })(f);
    // Read in the image file as a data URL.
    reader.readAsDataURL(f);
}

var imgInputs = document.getElementsByClassName('imgHolder');
var i = imgInputs.length;
while (i--)
  imgInputs[i].addEventListener('change', handleFileSelectMain, false);