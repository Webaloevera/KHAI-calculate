/*
Plugin URI: https://cherdev.ru/
Author: Cherenkov Dmitriy,Inc.
Author URI: https://cherdev.ru/
*/

jQuery(function($){
  if (!$('#cd-mutualconversion-container').length)return;
  var log10 = Chart.helpers.log10;

  $(".cd-mutualconv-plugin-value").keyup(function(){
    calcMutualConversion();
  });
  $(".cd-mutualconv-plugin-input").change(function(){
    calcMutualConversion();
  });
  $(".cd-mutualconv-plugin-mode").change(function(){
    calcMutualConversion();
  });

  function chkNumber(val){
    //console.log(val);
    //return val;
    //return val.toExponential();
    //if(String(val).length > 10)
    if(parseInt(val) > 10000)
      return val.toExponential(3);
    if(parseFloat(val) < 0.000001)
      return val.toExponential(3);
    else if(String(parseFloat(val)).split("0").length - 1 > 3)
      return val.toExponential(3);
    else if (String(parseFloat(val)).length > 3)
      return val.toFixed(3);
    else
      return val;
  }
  function chkNumberDB(val){
    //console.log(val);
    return val.toFixed(2);
  }
  function pow10(val){
  }

  function calcMutualConversion(){
    var impedance = parseFloat($('[name="cd-mutualconv-radio"]:checked').val());

    var volt = $("#cd-mutualconv-volt").val();
    if(isNaN(volt) || volt=="" || volt.indexOf('-') != -1 || volt == 0) return false;
    volt = parseFloat(volt);

    var power = $("#cd-mutualconv-power").val();
    if(isNaN(power) || power=="" || power.indexOf('-') != -1 || power == 0) return false;
    power = parseFloat(power);

    var voltdb = $("#cd-mutualconv-voltdb").val();
    if(isNaN(voltdb) || voltdb=="" ) return false;
    voltdb = parseFloat(voltdb);

    var powerdb = $("#cd-mutualconv-powerdb").val();
    if(isNaN(powerdb) || powerdb=="" ) return false;
    powerdb = parseFloat(powerdb);

    var powerPP = volt * volt / impedance;
    $("#cd-mutualconversion-volt0").text(chkNumber(volt * Math.pow(10,$("#cd-mutualconv-selectvolt").val() - $("#cd-mutualconv-selectvolt_b").val())));
    $("#cd-mutualconversion-power0").text(chkNumber(powerPP * Math.pow(10,$("#cd-mutualconv-selectvolt").val() * 2 - $("#cd-mutualconv-selectpower_b").val())));
    $("#cd-mutualconversion-dbvolt0").text(chkNumberDB(20 * log10( volt ) + 20 *( $("#cd-mutualconv-selectvolt").val() - $("#cd-mutualconv-selectvoltdb_b").val() )));
    $("#cd-mutualconversion-dbpower0").text(chkNumberDB(10 * log10(powerPP) + 10 * ( $("#cd-mutualconv-selectvolt").val() * 2 - $("#cd-mutualconv-selectpowerdb_b").val())));

    var voltPP = Math.sqrt(power * Math.pow(10,$("#cd-mutualconv-selectpower").val()) * impedance);
    $("#cd-mutualconversion-volt1").text(chkNumber(voltPP * Math.pow(10, - $("#cd-mutualconv-selectvolt_b").val())));
    $("#cd-mutualconversion-power1").text(chkNumber(power * Math.pow(10,$("#cd-mutualconv-selectpower").val() - $("#cd-mutualconv-selectpower_b").val())));
    $("#cd-mutualconversion-dbvolt1").text(chkNumberDB(20 * log10(voltPP)+ 20 * (- $("#cd-mutualconv-selectvoltdb_b").val())));
    $("#cd-mutualconversion-dbpower1").text(chkNumberDB(10 * log10(power) - 10 * ($("#cd-mutualconv-selectpowerdb_b").val() - $("#cd-mutualconv-selectpower").val())));

    var voltdbPP = Math.pow(10, voltdb / 20);
    var newpower = voltdbPP * voltdbPP / impedance;
    $("#cd-mutualconversion-volt2").text(chkNumber(voltdbPP * Math.pow(10,$("#cd-mutualconv-selectvoltdb").val() - $("#cd-mutualconv-selectvolt_b").val())));
    $("#cd-mutualconversion-power2").text(chkNumber(newpower * Math.pow(10,$("#cd-mutualconv-selectvoltdb").val()*2 - $("#cd-mutualconv-selectpower_b").val())));
    $("#cd-mutualconversion-dbvolt2").text(chkNumberDB(voltdb+ 20 * ($("#cd-mutualconv-selectvoltdb").val() - $("#cd-mutualconv-selectvoltdb_b").val())));
    $("#cd-mutualconversion-dbpower2").text(chkNumberDB(10 * log10(newpower) + 10 * ($("#cd-mutualconv-selectvoltdb").val()*2 - $("#cd-mutualconv-selectpowerdb_b").val())));

    powerPP = Math.pow(10, powerdb / 10);
    var newvolt = Math.sqrt(powerPP * Math.pow(10,$("#cd-mutualconv-selectpowerdb").val()) * impedance);
    $("#cd-mutualconversion-volt3").text(chkNumber(newvolt * (Math.pow(10, - $("#cd-mutualconv-selectvolt_b").val()))));
    $("#cd-mutualconversion-power3").text(chkNumber(powerPP / (Math.pow(10,$("#cd-mutualconv-selectpower_b").val() - $("#cd-mutualconv-selectpowerdb").val()))));
    $("#cd-mutualconversion-dbvolt3").text(chkNumberDB(20 * log10(newvolt) + 20 * ( - $("#cd-mutualconv-selectvoltdb_b").val())));
    $("#cd-mutualconversion-dbpower3").text(chkNumberDB(powerdb - 10 * ($("#cd-mutualconv-selectpowerdb_b").val() - $("#cd-mutualconv-selectpowerdb").val())));
  }

  calcMutualConversion();

});
