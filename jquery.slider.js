/*!
 * jQuery Slider Plugin
 * Examples and documentation at: https://github.com/hamczu/jQuery-Slider
 * Copyright (c) 2011 Jakub Wolny - http://101studio.pl
 * Version: 0.1 (2011-09-20)
 * Dual licensed under the MIT and GPL licenses.
 * Requires: jQuery 
 * Requires: jQuery timers plugin
 */
;
(function($){
    
    var methods = {
        init : function( options ) {
            var settings = {
                resolution: 10,
                arrows: true,
                left: '#left',
                right: '#right',
                interval: 20,
                parts: 5,
                width: null,
                load: false,
                attr: 'jq',
                area: false,
                remove: true,
                horizontal: true,
                vertical: false,
                loop: false,
                center: false,
                navigate: false,
                sliderStyle: {
                    'overflow': 'hidden'
                },
                listStyle: {
                    'width': '10000px'
                }
            };
            
            return this.each(function() {        
                // If settings exist, lets merge them
                // with our default settings
                if (options ) { 
                    $.extend(settings, options);
                }
                
                var slide = $(this);        
                var list = slide.find('ul');
                if(settings.arrows){
                    var left = $(settings.left).hide();
                    var right = $(settings.right).hide();
                }else {
                    var left = right = $();
                }
                var position = 0;
                var width = slide.width();

                var inWidth = 0;
                var oldWidth = 0;
                var offset = 0;
                var widths = [];
                var links = [];
                var imgs = slide.find('img')
                var c = 0;
        
                if(settings.load){
                    imgs.each(function (i) {
                        var t = $(this);
                        if(settings.navigate){
                            var href = t.parent().attr('href');
                            links[i] = href.substr(href.lastIndexOf('/') + 1);
                        }
                
                        t.error(function(){
                            c++;

                            if(c == imgs.length){
                                load(); 
                            }                    
                            if(settings.remove){
                                t.parent().parent().remove();    
                            }
                        }).load(function() {
                            var temp = t;
                            var w = 0;
                            while(temp.parent()[0] != list[0]){
                                w = temp.outerWidth(true);
                                temp = temp.parent();
                            }
                            widths[i] = w;
                            inWidth += w;
                            t.siblings().width(t.width());
                            offset = inWidth - width;
                            c++;                    

                            if(c == imgs.length){
                                load(); 
                            }
                        }).attr('src', t.attr(settings.attr));
                    });
                }else {
                    inWidth = settings.width ? slide.children().children().length * settings.width : slide.children().width();
                    offset = inWidth - width;
                    load();
                }
        
                var u = Math.round(width / settings.parts);
                var start = Math.floor(settings.parts / 2) * u;
                var end = Math.ceil(settings.parts / 2) * u;
                var piece = Math.round(start / settings.resolution);        
                var mouse;     
        
                function load(){                    
                    if(inWidth > width){
                        list.css('margin-left', 0);
                        right.show();
                    }else {
                        left.hide();
                        right.hide();
                        if(settings.center){                            
                            list.css('margin-left', (width - inWidth)/ 2);
                        }                
                    }
            
                    for(var i = 1; i < widths.length; i++){
                        widths[i] = widths[i] ? widths[i] : 0;
                        widths[i] = widths[i] + widths[i - 1];                
                    }
            
                    if(settings.navigate){
                        var h = location.hash.substr(1);            
                        if(h == links[i]){
                            position = widths[i];
                            move();
                        }
                    }
            
                    //            console.log(settings.loop);
                    if(settings.loop){                
                        for(var i = 0; i < widths.length; i++){
                            if(widths[i] > width){
                                var elements = list.children(':lt(' + (i + 1) + ')').clone();                        
                                list.append(elements);
                                oldWidth = inWidth;
                                inWidth += widths[i];                        
                                offset = inWidth - width;
                                break;
                            }
                        }
                    }
                }
        
                slide.css(settings.sliderStyle);
                list.css(settings.listStyle);
        
                if(settings.horizontal){
                    var o = slide.offset().left;
                    slide.mousemove(function(e){
                        mouse = e.pageX - o;
                    });
                }
        
                if(settings.vertical){
                    var o = slide.offset().top;
                    slide.mousemove(function(e){
                        mouse = e.pageY - o;
                    });
                }
        
             
                if(settings.area){
                    slide.hover(function(e){                
                        move();  
                        slide.everyTime(settings.interval, 'time', function(){
                            move();
                        });
                    }, function(){
                        slide.stopTime('time');
                    });
                }

                if(settings.arrows){
                    left.hover(function(e){
                        mouse = 0;
                        move();
                        slide.everyTime(settings.interval, 'time', function(){
                            move();
                        });
                    }, function(){
                        slide.stopTime('time');
                    });

                    right.hover(function(e){
                        mouse = start + end;
                        move();
                        slide.everyTime(settings.interval, 'time', function(){
                            move();
                        });
                    }, function(){
                        slide.stopTime('time');
                    });       
                }
        
                function move(){
                    if (position > 0) {
                        if(mouse < start){
                            position -= settings.resolution - Math.round(mouse / piece);
                            slide.scrollLeft(position);
                        }
                        left.show();
                    }else{
                        left.hide();
                    }                
            
                    if(position < offset){
                        if (mouse > end) {
                            position += Math.round((mouse - end) / piece);
                            slide.scrollLeft(position);
                        }
                        right.show();
                    }else{
                        right.hide();
                    }
            
                    if(settings.loop){                        
                        if(position > oldWidth){
                            // have to be 1 because of sliding left
                            position = 1;
                        }
                
                        if(position <= 0){
                            position = oldWidth;
                        }
                    }
            
                    if(settings.navigate){
                        for(var i = 0; i < widths.length; i++){
                            if(position < widths[i]){
                                if(location.hash != links[i] && typeof links[i + 1] !== 'undefined' && links[i + 1]){
                                    location.hash = links[i + 1];    
                                }
                                break;
                            }
                        }
                    }
                }
            });
        },
        reset : function( ) {
        //            position = 0; // RESET STATE
        //            left.hide();
        //            slide.scrollTop(0);
        //            width = slide.width();
        //            u = Math.round(width / settings.parts);
        //            start = Math.floor(settings.parts / 2) * u;
        //            end = Math.ceil(settings.parts / 2) * u;
        //            piece = Math.round(start / settings.resolution);
        //            offset = inWidth - width;            
        //            if(inWidth > width){
        //                right.show();
        //            }
        }
    };

    $.fn.slider = function( method ) {
        // Method calling logic
        if ( methods[method] ) {
            return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof method === 'object' || ! method ) {
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
        }
    };
})(jQuery);