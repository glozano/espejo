function init() {

	var main = document.querySelector('main');
	var bgCamera = document.getElementById('bg');
	var mosaicContainer = document.getElementById('mosaic');
	var videoWidth= 0, videoHeight = 0;
	var videoElement;
	var shooter;
	// var imagesPerRow = 2;
	var maxImages = 20;

	window.addEventListener('resize', onResize);

	GumHelper.startVideoStreaming(function(error, stream, videoEl, width, height) {
		if(error) {
			alert('Cannot open the camera. Sad times: ' + error.message);
			return;
		}

		videoElement = videoEl;

		videoWidth = width / 4;
		videoHeight = height / 4;

		main.appendChild(videoElement);

		videoElement.width = width / 4;
        videoElement.height = height / 4;

		shooter = new VideoShooter(videoElement);

		onResize();

		startCapturing();

	});

	function startCapturing() {
		
		shooter.getShot(onFrameCaptured, 10, 0.2, function onProgress(progress) {
			// Not doing anything in the callback,
			// but you could animate a progress bar or similar using the `progress` value
		});

	}

	function onFrameCaptured(pictureData) {
		var img = document.createElement('img');
		img.src = pictureData;

		var imageSize = getImageSize();

		img.style.width = imageSize[0] + 'px';
		img.style.height = imageSize[1] + 'px';

		mosaicContainer.insertBefore(img, mosaicContainer.firstChild);

		if(mosaicContainer.childElementCount > maxImages) {
			mosaicContainer.removeChild(mosaicContainer.lastChild);	
		}

		setTimeout(startCapturing, 10);
	}

	function getImageSize() {
		var windowWidth = window.innerWidth;
		if(windowWidth < 1000){
			var imageWidth = Math.round(windowWidth / 2)-1;
            maxImages = 10;
		}else{
            var imageWidth = Math.round(windowWidth / 5)-1;
		}
		var imageHeight = (imageWidth / videoWidth) * videoHeight;

		return [ imageWidth, imageHeight ];
	}

	function onResize(e) {

		// Don't do anything until we have a video element from which to derive sizes
		if(!videoElement) {
			return;
		}
		
		var imageSize = getImageSize();
		var imageWidth = imageSize[0] + 'px';
		var imageHeight = imageSize[1] + 'px';

		for(var i = 0; i < mosaicContainer.childElementCount; i++) {
			var img = mosaicContainer.children[i];
			img.style.width = imageWidth;
			img.style.height = imageHeight;
		}

		// videoElement.style.width = imageWidth;
		// videoElement.style.height = imageHeight;
	
	}

}

window.addEventListener('DOMContentLoaded', init);
