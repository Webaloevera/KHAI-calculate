/*
Plugin URI: https://cherdev.ru/
Author: Cherenkov Dmitriy,Inc.
Author URI: https://cherdev.ru/
*/

jQuery(function($){
  if (!$('#cd-fresnelzone-container_en').length)return;

  $(".fresnel-plugin-input").keyup(function(){
    calcFresnel();
  });

  function calcFresnel(){
    var distance = $("#cd-fresnel-distance").val();
    if(isNaN(distance) || distance=="" || distance.indexOf('-') != -1 || distance == 0) return false;
    distance = parseFloat(distance);

    var helz = $("#cd-fresnel-helz").val();
    if(isNaN(helz) || helz=="" || helz.indexOf('-') != -1 || helz == 0) return false;
    helz = parseFloat(helz);

    var hacho = 300000000 / (helz * 1000000);

    var fresnel = Math.sqrt(hacho * distance)/2;

    $("#cd-fresnelzone-antena").text(fresnel.toFixed(1) + " м");
    fresnel = fresnel * 0.6;
    $("#cd-fresnelzone-antena60").text(fresnel.toFixed(1)+" м");
  }

  calcFresnel();

});
