jQuery Slider Plugin
====================

Usage
-----

HTML:
    <script src="jquery.js"></script> 
    <script src="jquery.timers.js"></script>
    <script src="jquery.slider.js"></script>

    <div id="slider">
        <ul>
            <li><img src="image1.jpg" /></li>
            <li><img src="image2.jpg" /></li>
            <li><img src="image3.jpg" /></li>
        </ul>
    </div>

JS:
    $(function(){
        $('#slider').slider();
    });

Options
-------

* resolution (10) - how many parts divide active area - higher = smoother transitions
* arrows (true) - wherher use left and right arrows or not
* left ('#left') - left arrow selector
* right ('#right') - right arrow selector
* interval (20) - internal interval to refresh position
* area (false) - active area sliding
* load (false) - whether plugin should load images in slider - usefull with unknown images width
* attr ('jq') - html attribute where the source of image is stored - used with "load"
* remove (true) - whether remove unloaded image - used with "load"
* loop (false) - infinite loop
* center(false) - whether center slides when their width is less than slider width


License
-------

MIT