import AccountRegister from "../../component/account_register";
import react from "react";

ReactDOM.render(<AccountRegister/>, document.getElementById("account__registration"))

;
(function($) {
  var $onboard = $('.onboard');
  var $slider = $('.slides');
  var $slides = $('.slide');

  var curIndex = 0;

  function supportsCSS(type){
	var prefixes = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' ');
	if (type === 'transition') {
	  prefixes = 'transition WebkitTransition MozTransition OTransition msTransition'.split(' ');
	}
	for(var i=0; i<prefixes.length; i++) {
      if (document.createElement('div').style[prefixes[i]] !== undefined) {
  	    if (type === 'transform') {
  		  return (prefixes[i] === 'transform') ? prefixes[i] : '-' + prefixes[i].replace('T', '-t').toLowerCase();
        }else if(type === 'transition'){
          return (prefixes[i] === 'transition') ? prefixes[i] : '-' + prefixes[i].replace('T', '-t').toLowerCase();
	    }
	  }
    }
	return false;
  }

  var cssTransforms = supportsCSS('transform'),
  transformString = '';
  if(cssTransforms){
	transformString = cssTransforms + ': translate3d(-{{offset}}vw, 0, 0); ';
  }else{
    transformString = 'left: -{{offset}}px; ';
  }

  function addNavigation() {
    var navHtml = '<ul class="nav">';
	for(var i=0; i<$slides.length; i++){
	  navHtml += '<li></li>';
	}
	navHtml += '</ul><a class="skip" href="#">すぐに始める ></a>';
	$onboard.append(navHtml);
	$('.nav').children().bind('click', function(){
	  if (curIndex === 3)
	    return false;
	  slide($(this).index());
	}).first().addClass('active');
  }

  function slide(index){
    curIndex = index;
	var transform = (!index) ? '' : transformString.replace('{{offset}}', (curIndex * 100));
	$slider.attr('style', transform).addClass('slidesAnim');
	setTimeout(function(){ $slider.attr('class', 'slides');
	$onboard.attr('class', 'onboard active-slide--' + curIndex); }, 200);
	$('.nav li').removeAttr('class').eq(curIndex).addClass('active');
	$slider.offset().height;
  }

  function dragSlides() {
	var diff = 0, direction, origMouseX;

	function dragStart(event) {
	  var orig = (event.type === 'mousedown') ? event.originalEvent : event.originalEvent.touches[0];
	  origMouseX = orig.pageX;
	  $slider.bind('touchmove', dragMove).bind('mousemove', dragMove).bind('mouseleave', dragOff).bind('mouseup', dragOff).bind('touchend', dragOff).bind('touchcancel', dragOff);
	}

	function dragMove(event) {
	  var origEv = (event.type === 'touchmove') ? event.originalEvent.touches[0] : event.originalEvent;
	  var mouseX = origEv.pageX;
	  diff = Math.round(mouseX - origMouseX);
	  direction = (diff < 0) ? '<' : '>';
      // @platong めくる速さはこの倍率をいじる
	  var offset = Math.abs((curIndex * 100) - diff / 20);
	  if (direction === '>' && curIndex === 0 || direction === '<' && curIndex === 3)
	    return;
	  $slider.attr('style', transformString.replace('{{offset}}', offset));
	}

	function dragOff(event) {
	  var newIndex = (direction === '<') ? curIndex + 1 : curIndex - 1,
		origEv = (event.type === 'touchend' || event.type === 'touchcancel') ? event.originalEvent.changedTouches[0] : event.originalEvent;
	  var mouseX = origEv.pageX, offset = curIndex * 100;
	  diff = Math.round(mouseX - origMouseX) ;
	  $slider.unbind('touchmove', dragMove).unbind('mousemove', dragMove).unbind('mouseleave', dragOff).unbind('mouseup', dragOff).unbind('touchend', dragOff).unbind('touchcancel', dragOff);
	  if(direction === '>' && curIndex === 0 || direction === '<' && curIndex === 3) 
		return;
      if(newIndex !== 4 && diff != 0){
  	  // @platong 何％めくったら次に飛ぶかはこの辺はいじる
        if ( diff > 80*2 || diff < -80*2 ) {
  	      slide(newIndex);
  		  return;
     	}
        $slider.attr('style', transformString.replace('{{offset}}', offset)).addClass('slidesAnim');
  	    setTimeout(function(){ $slider.removeClass('slidesAnim'); }, 200);
	  }
	}

    $slides.bind('touchstart', dragStart);
    $slides.bind('mousedown', dragStart);
  }

  addNavigation();
  dragSlides();
  $('.skip').bind('click', function(event){
    event.preventDefault();
	if (curIndex === 3)
	  return false;
	slide(3);
  });

})(jQuery);
