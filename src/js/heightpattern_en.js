/*
Plugin URI: https://cherdev.ru/
Author: Cherenkov Dmitriy,Inc.
Author URI: https://cherdev.ru/
*/

jQuery(function($){
  if (!$('#cd-heightpattern-container').length)return;

  $(".cd-heightpattern-input").keyup(function(){
    calcHeightpattern();
  });

  function calcHeightpattern(){
    var helz = $("#cd-heightpattern-helz").val();
    if(isNaN(helz) || helz=="" || helz.indexOf('-') != -1 || helz == 0) return false;

    var height = $("#cd-heightpattern-height").val();
    if(isNaN(height) || height=="" || height.indexOf('-') != -1 || height == 0) return false;

    var distance = $("#cd-heightpattern-distance").val();
    if(isNaN(distance) || distance=="" || distance.indexOf('-') != -1 || distance == 0) return false;

    var hacho = 300000000 / (helz * 1000000);

    var pitch = (hacho * distance)/(2*height);

    $("#cd-heightpattern-pitch").text(pitch.toFixed(1) + " м");
  }

  calcHeightpattern();

});
