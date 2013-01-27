(function () {
    var debug = window.location.host === 'localhost';

    require.config({
        paths: {
            jquery: 'lib/jquery',
            underscore: 'lib/underscore.custom'
        },
        urlArgs: debug ? (new Date()).getTime() : undefined,
        waitSeconds: 60
    });

    requirejs.onError = function (error) {
        console.log(error);
    };

    define(function (require) {
        var $ = require('jquery');

        var video = $('video'),
            color = $('img.color'),
            colorCanvas = $('<canvas height="480" width="640" />')[0],
            colorContext = colorCanvas.getContext('2d'),
            gray = $('img.gray'),
            grayCanvas = $('<canvas height="160" width="120" />')[0],
            grayContext = grayCanvas.getContext('2d');

        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;

        navigator.getUserMedia({ video: true }, function (stream) {
            video.attr({ src: window.URL.createObjectURL(stream) });

            video.on('click', function (event) {
                colorContext.drawImage(video[0], 0, 0, 640, 480);
                // color
                color.attr({ src: colorCanvas.toDataURL('image/jpeg') });
                // grayscale
                var imageData = colorContext.getImageData(0, 0, 160, 120),
                    data = imageData.data;
                for (var i = 0, length = data.length; i < length; i += 4) {
                    var luminance = Math.floor((data[i] + data[i+1] + data[i+2]) / 3);
                    data[i] = data[i+1] = data[i+2] = luminance;
                }
                grayContext.putImageData(imageData, 0, 0);
                gray.attr({ src: grayCanvas.toDataURL('image/jpeg') });
            });

        });



        // fire it up
        $(document).ready(function (event) {
            $('body').removeClass('requiring');
        });

    });
})();
