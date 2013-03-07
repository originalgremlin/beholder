(function () {
    var debug = window.location.host === 'localhost';

    require.config({
        paths: {
            jquery: 'lib/jquery',
            recorder: 'lib/recorder',
            underscore: 'lib/underscore'
        },
        shim: {
            'recorder': { exports: 'Recorder' }
        },
        urlArgs: debug ? (new Date()).getTime() : undefined,
        waitSeconds: 60
    });

    requirejs.onError = function (error) {
        console.log(error);
    };

    define(function (require) {
        var $ = require('jquery'),
            Recorder = require('recorder');

        window.URL = window.URL || window.webkitURL;
        window.audioContext = window.audioContext || window.webkitAudioContext;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

        navigator.getUserMedia({ audio: true, video: true }, function (stream) {
            // audio
            // http://codeartists.com/post/36746402258/how-to-record-audio-in-chrome-with-native-html5-apis
            // WARNING: need to enable "Web Audio Input" under "chrome://flags/"
            var acontext = new window.audioContext(),
                mediaStreamSource = acontext.createMediaStreamSource(stream),
                recorder = new Recorder(mediaStreamSource);

            // video
            var video = $('video'),
                ul = $('ul'),
                canvas = $('<canvas height="480" width="640" />')[0],
                context = canvas.getContext('2d');
            video.attr({ src: window.URL.createObjectURL(stream) });
            drawHeadRectangle();

            $('a.startRecording').on('click', function (event) {
                // record audio for 30 seconds
                recorder.record();
                window.setTimeout(function () {
                    recorder.stop();
                    recorder.exportWAV(function (s) {
                        $('audio')[0].src = window.URL.createObjectURL(s);
                    });
                }, 5000);

                // take snapshots
                var count = 0,
                    maxCount = 10,
                    delay = 300;
                var interval = window.setInterval(function () {
                    if (++count >= maxCount)
                        window.clearInterval(interval);
                    var img, imageData, data;
                    // get image context
                    context.drawImage(video[0], 0, 0, 640, 480);
                    imageData = context.getImageData(0, 0, 640, 480),
                    data = imageData.data;
                    // convert to grayscale
                    for (var i = 0, length = data.length; i < length; i += 3) {
                        data[i] = data[i+1] = data[i+2] = Math.floor(data[i] * 0.30 + data[i+1] * 0.59 + data[i+2] * 0.11);
                    }
                    // draw grayscale image
                    context.putImageData(imageData, 0, 0);
                    ul.append($('<li />').append($('<img />').attr({ src: canvas.toDataURL('image/jpeg'), width: 160, height: 120 })));
                }, delay);
            });
        });

        var drawHeadRectangle = function () {
            var context = $('canvas')[0].getContext('2d');
            context.clearRect(0, 0, 640, 480);
            context.setFillColor("rgba(255, 255, 255, 0.6)");
            context.fillRect(0, 0, 640, 480);
            context.clearRect(220, 90, 200, 300);
            context.setStrokeColor('#ff0000');
            context.setLineWidth(5);
            context.strokeRect(220, 90, 200, 300);
        };

        // fire it up
        $(document).ready(function (event) {
            $('body').removeClass('requiring');
        });

    });
})();
