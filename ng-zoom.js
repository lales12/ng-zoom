(function(){
    angular.module('ngHammer',[]).directive('ngHammer', function(){
        // Runs during compile
        return {
            // name: '',
            // priority: 1,
            // terminal: true,
            // scope: {}, // {} = isolate, true = child, false/undefined = no change
            // controller: function($scope, $element, $attrs, $transclude) {},
            // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
            // template: '',
            // templateUrl: '',
            // replace: true,
            // transclude: true,
            // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
            link: function($scope, iElm, iAttrs, controller) {
                console.log(iElm[0]);
                var previousScaleFactor = 1,
                    scaleFactor = 1,
                    MIN_ZOOM = 1,
                    MAX_ZOOM = 3,
                    cssOrigin = '',
                    originX = 0,
                    originY = 0,
                    lastPos;


                var hammertime = Hammer(iElm[0], {
                    transform_always_block: true,
                    transform_min_scale: 1,
                    transform_max_scale: 2
                });

                hammertime.on('transformstart', function(event){
                    //We save the initial midpoint of the first two touches
                    e = event.gesture
                    var tch1 = [e.touches[0].clientX, e.touches[0].clientY],
                        tch2 = [e.touches[1].clientX, e.touches[1].clientY],
                        tcX = (tch1[0]+tch2[0])/2,
                        tcY = (tch1[1]+tch2[1])/2;

                    originY = (tcY)/scaleFactor;
                    originX = (tcX)/scaleFactor;

                    cssOrigin = originX +'px '+ originY+'px';

                })

                hammertime.on('touch', function (event) {
                    console.log(scaleFactor);
                    if(event.gesture.touches.length === 2){
                        //console.log('prevent')
                        event.gesture.preventDefault()
                    }
                })
                hammertime.on('touchmove', function (evn) {
                    var newOriginX,
                        newOriginY,
                        change = false;

                    if (scaleFactor !== 1){


                        newOriginX = originX - (evn.touches[0].clientX -lastPos.clientX);
                        newOriginY = originY - (evn.touches[0].clientY - lastPos.clientY);

                        if(newOriginX > 0 && newOriginX < $(evn.target).width()){
                            originX = newOriginX;
                            change = true;
                        }
                        if(newOriginY > 0 && newOriginY < $(evn.target).height()){
                            originY = newOriginY;
                            change = true
                        }
                        if(change){
                            lastPos = evn.touches[0];
                            event.preventDefault()
                            cssOrigin = originX +'px '+ originY+'px';

                            $(e.target).css({
                                webkitTransformOrigin: cssOrigin,
                 
                                transformOrigin: cssOrigin,
                            });
                        }
                    }
                })
                
                hammertime.on('touchstart', function (evn) {
                    lastPos = evn.touches[0];
                })
                hammertime.on('touchend', function(evn){
                    lastPos = undefined;
                })

                hammertime.on('transform', function(event) {

                    var factor = event.gesture.scale -1;

                    scaleFactor = previousScaleFactor + factor*0.4;

                    scaleFactor = Math.max(MIN_ZOOM, Math.min(scaleFactor,MAX_ZOOM));

                    previousScaleFactor = scaleFactor;

                    transform(event);
                });

                function transform(e) {
                    //We’re going to scale the X and Y coordinates by the same amount
                    var cssScale = 'scaleX('+ scaleFactor +') scaleY('+ scaleFactor+')';
                    //console.log(cssOrigin);
                    $(e.target).css({
                        width: cssScale,
                        webkitTransformOrigin: cssOrigin,
         
                        transform: cssScale,
                        transformOrigin: cssOrigin,
                    });
         
                }
                    
            }
        };
    });
})

