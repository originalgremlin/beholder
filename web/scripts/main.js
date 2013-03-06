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

        // TODO: add dots for eyes and nose, or a square for the head
        // TODO: pull out a rectangle which contains the face but little else
        // TODO: turn that rectangle into grayscale
        // TODO: send a subset of the grayscale data to the server for saving

        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
        navigator.getUserMedia({ video: true }, function (stream) {
            var video = $('video'),
                ul = $('ul'),
                canvas = $('<canvas height="480" width="640" />')[0],
                context = canvas.getContext('2d');

            video.attr({ src: window.URL.createObjectURL(stream) });
            drawHeadRectangle();

            var count = 0, maxCount = 100, delay = 300;
            var interval = window.setInterval(function () {
                if (++count >= maxCount)
                    window.clearInterval(interval);
                var img, imageData, data;
                // get image context
                context.drawImage(video[0], 0, 0, 640, 480);
                imageData = context.getImageData(0, 0, 640, 480),
                data = imageData.data;
                // convert to grayscale
                for (var i = 0, length = data.length; i < length; i += 3)
                    data[i] = data[i+1] = data[i+2] = Math.floor(data[i] * 0.30 + data[i+1] * 0.59 + data[i+2] * 0.11);
                // draw grayscale image
                context.putImageData(imageData, 0, 0);
                ul.append($('<li />').append($('<img />').attr({ src: canvas.toDataURL('image/jpeg'), width: 160, height: 120 })));
            }, delay);
        });

        var drawHeadRectangle = function () {
            var context = $('canvas')[0].getContext('2d');
            context.clearRect(0, 0, 640, 480);
            context.setStrokeColor('#ff0000');
            context.setLineWidth(5);
            context.strokeRect(170, 40, 300, 400);
        };

        // fire it up
        $(document).ready(function (event) {
            $('body').removeClass('requiring');
        });

    });
})();
