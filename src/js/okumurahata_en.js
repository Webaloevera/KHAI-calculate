/*
Plugin URI: https://cherdev.ru/
Author: Cherenkov Dmitriy,Inc.
Author URI: https://cherdev.ru/
*/

jQuery(function($){
  if (!$('#cd-okumurahata-container_en').length)return;
  var log10 = Chart.helpers.log10;
  var logmode = 'linear';
  var scalemode = 'strength';
  var config = {
        type: 'line',
        data: {
            labels: [],
            datasets: []
        },
        options: {
        title: {
          display: true,
          text: 'Крива Окумура-Хата'
        },
        scales: {
          xAxes: [{
            type: logmode,
            position: 'bottom',
            scaleLabel: {
              labelString: 'Відстань (км)',
              display: true,
            }
          }],
          yAxes: [{
            type: 'linear',
            ticks: {
              userCallback: function(tick) {
                return tick.toString();
              }
            },
            scaleLabel: {
              labelString: 'Напруженість електричного поля (dBμV/m)',
              display: true
            }
          }]
        }
      }
    };

  $(".okumurahata-plugin-input").keyup(function(){
    calcOkumuraHata();
  });

  $('#cd-okumurahata-logmode').change(function(){
    logmode = logmode === 'linear' ? 'logarithmic' : 'linear';
    myChart.options.scales.xAxes[0].type = logmode;
    myChart.update();
  });

  $('#cd-okumurahata-scalemode').change(function(){
    scalemode = scalemode === 'strength' ? 'power' : 'strength';
    if(scalemode === 'strength'){
      myChart.options.scales.yAxes[0].scaleLabel.labelString = 'Напруженість електричного поля (dBμV/m)';
    }else{
      myChart.options.scales.yAxes[0].scaleLabel.labelString = 'Отримана потужність (дБм)';
    }
    calcOkumuraHata();
  });

  function calcS(dist,params){
    var dB = params["_a"] + params["_b"] * log10(dist) + params["_c"] - params["_d"];
    var Pr = params["_p"] + params["_tx"] + params["_rx"] - dB;
    var Vm = (Math.PI / params["_h"]) * Math.sqrt((480/params["_rxx"])*Math.pow(10,(Pr-30)/10));

    return 20* log10(Vm * 1000000);
  }
  function calcP(dist,params){
    var dB = params["_a"] + params["_b"] * log10(dist) + params["_c"] - params["_d"];
    var Pr = params["_p"] + params["_tx"] + params["_rx"] - dB;

    return Pr;
  }

  function calcOkumuraHata(){
    var distance = $("#cd-olumurahata-distance").val();
    if(isNaN(distance) || distance=="" || distance.indexOf('-') != -1 || distance == 0) return false;
    distance = parseFloat(distance);

    var helz = $("#cd-olumurahata-helz").val();
    if(isNaN(helz) || helz=="" || helz.indexOf('-') != -1 || helz == 0) return false;
    helz = parseFloat(helz);

    var hacho = 300000000 / (helz * 1000000);

    var hb = $("#cd-olumurahata-antena_tx").val();
    if(isNaN(hb) || hb=="" || hb.indexOf('-') != -1 || hb == 0) return false;
    hb = parseFloat(hb);

    var hm = $("#cd-olumurahata-antena_rx").val();
    if(isNaN(hm) || hm=="" || hm.indexOf('-') != -1 || hm == 0) return false;
    hm = parseFloat(hm);

    var power = $("#cd-olumurahata-power").val();
    if(isNaN(power) || power=="") return false;
    power = parseFloat(power);
    var mW = Math.pow(10,power/10);
    $("#cd-olumurahata-mwpower").text(mW.toFixed(3)+"мВт");

    var txgain = $("#cd-olumurahata-gain_tx").val();
    if(isNaN(txgain) || txgain=="") return false;
    txgain = parseFloat(txgain);
    var txgainX = Math.pow(10,txgain/10);

    var rxgain = $("#cd-olumurahata-gain_rx").val();
    if(isNaN(rxgain) || rxgain=="") return false;
    rxgain = parseFloat(rxgain);
    var rxgainX = Math.pow(10,rxgain/10);

    var A = 69.55 + 26.26 * log10(helz) - 13.82 * log10(hb);
    var B = 44.9 - 6.55 * log10(hb);
    var C1= -4.78 * Math.pow(log10(helz),2) + 18.33 * log10(helz) - 40.94;
    var C2= -2 * Math.pow( log10(helz/28),2 ) -5.4;
    var D1= (1.1 * log10(helz) - 0.7) * hm - ((1.56*log10(helz)) - 0.8);
    var D2= 8.29 * Math.pow(log10( 1.54 * hm),2) - 1.1;
    var D3= 3.2 * Math.pow(log10(11.75 * hm),2) - 4.97;

    var calcval={
     _0:{_a: A,_b: B,_c: C1,_d: D1,_p: power,_tx: txgain,_rx: rxgain,_txx: txgainX,_rxx: rxgainX,_p: power,_h: hacho},
     _1:{_a: A,_b: B,_c: C2,_d: D1,_p: power,_tx: txgain,_rx: rxgain,_txx: txgainX,_rxx: rxgainX,_p: power,_h: hacho},
     _2:{_a: A,_b: B,_c:  0,_d: D1,_p: power,_tx: txgain,_rx: rxgain,_txx: txgainX,_rxx: rxgainX,_p: power,_h: hacho}};

    if (helz < 400){
      calcval["_3"] = {_a: A,_b: B,_c:  0,_d: D2,_p: power,_tx: txgain,_rx: rxgain,_txx: txgainX,_rxx: rxgainX,_p: power,_h: hacho};
    }else{
      calcval["_3"] = {_a: A,_b: B,_c:  0,_d: D3,_p: power,_tx: txgain,_rx: rxgain,_txx: txgainX,_rxx: rxgainX,_p: power,_h: hacho};
    }
    
    var labels = ["Відкрита земля","Передмістя","Середнє місто","Велике місто","Вільний простір"];
    if( (navigator.browserLanguage || navigator.language || navigator.userLanguage).substr(0,2) !== 'ja') {
      labels=["Відкрита земля","Передмістя","Середнє місто","Велике місто","Вільний простір"];
      config.options.title.text= 'крива Окумура-Хата';
      config.options.scales.xAxes[0].scaleLabel.labelString = 'Distance(m)';
    }
    var colors=["rgba(255, 0, 0, 0.75)","rgba(0, 0, 255, 0.75)","rgba(0, 255, 255, 0.75 )","rgba(0, 204, 0, 0.75)","rgba(128, 0, 128, 0.75)"];
    var pointStyle=['circle','triangle','rect','rectRot','cross',]
    var lineStyle=[[5],[5,2],[9,2],[10]];

    var start = distance / 1000;
    var step = Math.pow( distance / start , 1 / 50) ;
    var startstep = Math.pow(10,String(Math.floor(distance)).length - 4);

    var niceRange = Chart.helpers.niceNum(distance, false);
    var spacing = Chart.helpers.niceNum(niceRange/10 , true);
    var memori = [];
    for(var i = start; i < spacing; i *= step){
      if(i < startstep*12)continue;
      memori.push(i);
    }
    for(var i = spacing; i < distance; i += spacing){
      memori.push(i);
    }
    memori.push(distance);
    memori.push(startstep);

    memori.sort(function(a,b){
        if( a < b ) return -1;
        if( a > b ) return 1;
        return 0;
    });

    config.data.datasets=[];
    for(var j = 0; j< Object.keys(calcval).length;j++){
      var newDataset = {
        label: labels[j],
        backgroundColor: colors[j],
        borderColor: colors[j],
        data: [],
        fill: false,
        pointRadius: 3,
        pointStyle: pointStyle[j],
        borderDash: lineStyle[j]
      };
      for(var i = 0; i < memori.length; i++ ){
         if (scalemode === 'strength'){
           var E=calcS(memori[i],calcval["_"+j]);
           newDataset.data.push( {x: (memori[i]).toFixed(3), y: E.toFixed(1)} )
         }else{
           var Pr=calcP(memori[i],calcval["_"+j]);
           newDataset.data.push( {x: (memori[i]).toFixed(3), y: Pr.toFixed(1)} )
         }
      }

      config.data.datasets.push(newDataset);
    }
    // вільний простір
    var newDataset = {
        label: labels[4],
        backgroundColor: colors[4],
        borderColor: colors[4],
        data: [],
        fill: false,
        pointRadius: 2,
        pointStyle: pointStyle[4]
    };
    var freespace = 4 * Math.PI / hacho * 1000;
    for(var i = 0; i < memori.length; i++ ){
       var dB = 20 * log10( freespace * memori[i]);
       var Pr = power + txgain + rxgain - dB;
       if (scalemode === 'strength'){
         var Vm = (Math.PI / hacho) * Math.sqrt((480/rxgainX)*Math.pow(10,(Pr-30)/10));
         var E = 20* log10(Vm * 1000000);
         newDataset.data.push( {x: (memori[i]).toFixed(3), y: E.toFixed(2)} )
       }else{
         newDataset.data.push( {x: (memori[i]).toFixed(3), y: Pr.toFixed(2)} )
       }
    }
    config.data.datasets.push(newDataset);

    myChart.update();
  }

  var ctx = document.getElementById("okumurahata_canvas_en").getContext("2d");
  var myChart = new Chart(ctx,config);

  calcOkumuraHata();

});
