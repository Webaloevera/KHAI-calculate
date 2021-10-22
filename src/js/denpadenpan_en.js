/*
Plugin URI: https://cherdev.ru/
Author: Cherenkov Dmitriy,Inc.
Author URI: https://cherdev.ru/
*/

jQuery(function($){
  if (!$('#cd-denpadenpan-container_en').length)return;
  var log10 = Chart.helpers.log10;

  var labels=["напруженість електричного поля","Отриманий рівень потужності","Середнє місто","Велике місто","Вільний простір"];
  var colors=["rgba(47, 205, 180, 0.75)","rgba(242, 115, 152, 0.75)","rgba(128, 0, 128, 0.75)"];

  var scaletype = 'linear';
  var graphtype = 'freespace';

  var config = {
     type: 'line',
     data: {
         labels: [],
         datasets: []
     },
     options: {
       responsive: true,
       title: {
         display: true,
         text: 'Інструмент розрахунку поширення хвилі'
       },
       scales: {
         xAxes: [{
           type: scaletype,
           position: 'bottom',
           scaleLabel: {
             labelString: 'Distance gvv(m)',
             display: true,
           }
         }],
         yAxes: [{
           type: 'linear',
           id: 'strength',
           position: 'right',
           ticks: {
             max:140,
             min:-10,
             fontColor: colors[0],
             userCallback: function(tick) {
               return tick.toString();
             }
           },
           scaleLabel: {
             labelString: 'dBμV/m',
             display: true,
             fontColor: colors[0]
           }
         },{
           type: 'linear',
           id: 'power',
           position: 'left',
           ticks: {
             max:0,
             min:-150,
             fontColor: colors[1],
             userCallback: function(tick) {
               return tick.toString();
             }
           },
           scaleLabel: {
             labelString: 'dBm',
             display: true,
             fontColor: colors[1]
           }
         }]
       }
     }
   };

  $(".denpadenpan-plugin-input").keyup(function(){
    calcDenpaDenpan();
  });

  var mode=0;
  $('.denpadenpan-plugin-mode').click(function(){
    graphtype = $('[name="denpadenpan-plugin-mode"]:checked').val();
    calcDenpaDenpan();
  });

  $('#cd-denpadenpan-logmode').change(function(){
    scaletype = scaletype === 'linear' ? 'logarithmic' : 'linear';
    myChart.options.scales.xAxes[0].type = scaletype;
    myChart.update();
  });

  function calcE(dist,params){
    var dB = params["_a"] + params["_b"] * log10(dist) + params["_c"] - params["_d"];
    var Pr = params["_p"] + params["_tx"] + params["_rx"] - dB;
    var Vm = (Math.PI / params["_h"]) * Math.sqrt((480/params["_rxx"])*Math.pow(10,(Pr-30)/10));

    return 20* log10(Vm * 1000000);
  }

  function calcDenpaDenpan(){

    var distance = $("#cd-denpadenpan-distance").val();
    if(isNaN(distance) || distance=="" || distance.indexOf('-') != -1 || distance == 0) return false;
    distance = parseFloat(distance);

    var helz = $("#cd-denpadenpan-helz").val();
    if(isNaN(helz) || helz=="" || helz.indexOf('-') != -1 || helz == 0) return false;

    var hacho = 300000000 / (helz * 1000000);

    var hb = $("#cd-denpadenpan-antena_tx").val();
    if(isNaN(hb) || hb=="" || hb.indexOf('-') != -1 || hb == 0) return false;
    hb = parseFloat(hb);

    var hm = $("#cd-denpadenpan-antena_rx").val();
    if(isNaN(hm) || hm=="" || hm.indexOf('-') != -1 || hm == 0) return false;
    hm = parseFloat(hm);

    var power = $("#cd-denpadenpan-power").val();
    if(isNaN(power) || power=="") return false;
    power = parseFloat(power);
    var mW = Math.pow(10,power/10);
    $("#cd-denpadenpan-mwpower").text(mW.toFixed(3)+"mW");

    var txgain = $("#cd-denpadenpan-gain_tx").val();
    if(isNaN(txgain) || txgain=="") return false;
    txgain = parseFloat(txgain);
    var txgainX = Math.pow(10,txgain/10);

    var rxgain = $("#cd-denpadenpan-gain_rx").val();
    if(isNaN(rxgain) || rxgain=="") return false;
    rxgain = parseFloat(rxgain);
    var rxgainX = Math.pow(10,rxgain/10);

    var firststep = Math.pow(10,String(Math.floor(distance)).length - 4);
    var start = distance/1000;
    var step = Math.pow( distance / start , 1 / 1000) ;
    var niceRange = Chart.helpers.niceNum(distance, false);
    var spacing = Chart.helpers.niceNum(niceRange/10 , true);
    var memori = [];
    for(var i = firststep; i < distance; i *= step){
      memori.push(i);
    }
    for(var i = spacing; i < distance; i += spacing){
      memori.push(i);
    }
    memori.push(distance);
    memori.push(firststep);
    memori.sort(function(a,b){
        if( a < b ) return -1;
        if( a > b ) return 1;
        return 0;
    });

    config.data.datasets=[];

    //自由空間
    var newDatasetS = {
        yAxisID: 'strength',
        label: labels[0],
        backgroundColor: colors[0],
        borderColor: colors[0],
        data: [],
        fill: false
    };
    var newDatasetP = {
        yAxisID: 'power',
        label: labels[1],
        backgroundColor: colors[1],
        borderColor: colors[1],
        data: [],
        fill: false,
        pointStyle: 'triangle',
        borderDash: [10]
    }
    if(graphtype === 'freespace'){
      var freespace = 4 * Math.PI / hacho;
      for(var i = 0; i < memori.length; i++ ){
        if( memori[i] < distance/100)  continue;
        
        var dB = 20 * log10( freespace * memori[i]);
        var Pr = power + txgain + rxgain - dB;
        newDatasetP.data.push( {x: (memori[i]).toFixed(3), y: Pr.toFixed(1)} );
        var Vm = (Math.PI / hacho) * Math.sqrt((480/rxgainX)*Math.pow(10,(Pr-30)/10));
        var E = 20* log10(Vm * 1000000);
        newDatasetS.data.push( {x: (memori[i]).toFixed(3), y: E.toFixed(1)} );
      }
    }else{
      var pt = Math.pow(10,(power-30)/10);
      var loss=0;
      for(var i = 0; i < memori.length; i++ ){
        if( memori[i] < distance/100)  continue;
        var r = Math.sqrt(Math.pow(memori[i],2) + Math.pow(hb+hm,2)) - Math.sqrt(Math.pow(memori[i],2) + Math.pow(hb-hm,2));
        var E = Math.sqrt(30 * pt * txgainX) / memori[i];
        var Er = 20 * log10(2 * E * Math.abs(Math.sin(Math.PI * r / hacho)*1000000))-loss;
        newDatasetS.data.push( {x: (memori[i]).toFixed(3), y: Er.toFixed(1)} );
        var vm = (2 * E) * Math.sin(Math.PI * r /hacho);
        var Pr = 10 * log10( (Math.pow(vm,2) / (120*Math.PI)) * ( Math.pow(hacho,2) * rxgainX / (4 * Math.PI))) + 30;
        newDatasetP.data.push( {x: (memori[i]).toFixed(3), y: Pr.toFixed(1)} );
      }
    }
    config.data.datasets.push(newDatasetS);
    config.data.datasets.push(newDatasetP);
    myChart.options.scales.xAxes[0].ticks.min = distance / 100;
    myChart.update();
  }

  var ctx = document.getElementById("denpadenpan_canvas_en").getContext("2d");
  var myChart = new Chart(ctx,config);

  calcDenpaDenpan();

});
