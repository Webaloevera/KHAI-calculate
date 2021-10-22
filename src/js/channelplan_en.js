/*
Plugin URI: https://cherdev.ru/
Author: Cherenkov Dmitriy,Inc.
Author URI: https://cherdev.ru/
*/

jQuery(function ($) {
    if (!$('#cd-channelplan-container').length) return;

    const _426_tbl = [
        [426.0250, 12.5, 1, 10],
        [426.0250, 25, 1, 4],
        [426.0375, 25, 1, 4],
        [426.2500, 12.5, 1, 48],
        [426.2625, 25, 1, 24]];
    const _429_tbl = [
        [429.2500, 12.5, 7, 46],
        [429.1750, 12.5, 1, 46],
        [429.8125, 12.5, 1, 10]];
    const _449_tbl = [
        [449.7125, 12.5, 1, 15]];
    const _469_tbl = [
        [469.4375, 12.5, 11, 15]];
    const _800_tbl = [
        [806.1250, 125.0, 7, 30],
        [797.1250, 125.0, 1, 71]];
    const _1216_tbl = [
        [1216.0375, 25.0, 2, 20],
        [1216.0125, 25.0, 1, 40],
        [1216.0000, 50.0, 1, 21]];
    const _1252_tbl = [
        [1252.0375, 25.0, 2, 20],
        [1252.0125, 25.0, 1, 40],
        [1252.0000, 50.0, 1, 21]];
    const _EU434_tbl = [
        [433.0750, 25.0, 1, 69]];
    const _EU863_tbl = [
        [863.1250, 125.0, 1, 15]];
    const _EU869_tbl = [
        [868.0250, 25.0, 1, 79]];
    const _UK458_tbl = [
        [458.5250, 25.0, 1, 27]];
    const _KR447_tbl = [
        [447.2750, 12.5, 1, 58]];
    const _CH418_tbl = [
        [418.7250, 12.5, 1, 57]];
    const _2400_tbl = [
        [2402.5, 1000, 0, 76]];

    const mhztable = {
        _426: _426_tbl,
        _429: _429_tbl,
        _449: _449_tbl,
        _469: _469_tbl,
        _800: _800_tbl,
        _1216: _1216_tbl,
        _1252: _1252_tbl,
        _EU434: _EU434_tbl,
        _EU863: _EU863_tbl,
        _EU869: _EU869_tbl,
        _UK458: _UK458_tbl,
        _KR447: _KR447_tbl,
        _CH418: _CH418_tbl,
        _2400: _2400_tbl
    }

    const MAX_CH = 100;
    const MAX_ROW = 4;
    const MAX_COL = MAX_CH / MAX_ROW;
    
    $('#cd-channelplan-channelselect table').remove();
    var table = $('<table id="channelselect">');
    for (var x = 0; x < MAX_COL; x++) {
        var tr = $("<tr></tr>").appendTo(table);
        for (var y = 0; y < MAX_ROW; y++) {
            var xy = y * MAX_COL + x;
            $("<td><label class='channel' id='label" + xy + "'><input class='cd-channelplan-chsel' name='in" + xy + "' value='" + xy + "' type='checkbox' ><span class='helt'></span></label></td>").appendTo(tr);
        }
    }
    $("#cd-channelplan-channelselect").append(table);

    function changeHzValue(mhz) {
        $.each(mhztable[mhz], function (index, value) {
            if (mhz.indexOf('EU') != -1) {
                if (mhz.indexOf('434') != -1) {
                    var optxt = "433.0750 - 434.7750 MHz, " + value[1] + " kHz, " + value[2] + " - " + value[3] + " ch";
                } else if (mhz.indexOf('863') != -1) {
                    var optxt = "863.1250 - 864.8750 MHz, " + value[1] + " kHz, " + value[2] + " - " + value[3] + " ch";
                } else {
                    var optxt = "868.0250 - 869.9750 MHz, " + value[1] + " kHz, " + value[2] + " - " + value[3] + " ch";
                }

            } else {
                var optxt = (value[0]).toFixed(4) + " - " + (value[0] + value[1] * (value[3] - value[2]) / 1000).toFixed(4) + " MHz, " + value[1] + " kHz, " + value[2] + " - " + value[3] + " ch";
            }
            $('#cd-channelplan-selectvalue').append($("<option>").val(index).text(optxt));
        });
        var index = $('#cd-channelplan-selectvalue').val();
        $("#cd-channelplan-helz").val(mhztable[mhz][index][0]);
        $("#cd-channelplan-span").val(mhztable[mhz][index][1])
        $("#cd-channelplan-startCh").val(mhztable[mhz][index][2])
        $("#cd-channelplan-endCh").val(mhztable[mhz][index][3])
        changeInput();
    }

    changeHzValue($('#cd-channelplan-selecthz').val());

    // Сбросить начальное значение при изменении полосы частот
    $('#cd-channelplan-selecthz').change(function () {
        $('#cd-channelplan-selectvalue option').remove();
        clearChk();
        changeHzValue($('#cd-channelplan-selecthz').val());
    });

    $('#cd-channelplan-selectvalue').change(function () {
        var mhz = $('#cd-channelplan-selecthz').val();
        var index = $('#cd-channelplan-selectvalue').val();
        $("#cd-channelplan-helz").val(mhztable[mhz][index][0]);
        $("#cd-channelplan-span").val(mhztable[mhz][index][1])
        $("#cd-channelplan-startCh").val(mhztable[mhz][index][2])
        $("#cd-channelplan-endCh").val(mhztable[mhz][index][3])
        clearChk();
        changeInput();
    });

    // Настройки соседнего канала
    var sidecheck = $("#cd-channelplan-sidecheck").prop('checked');
    $('#cd-channelplan-sidecheck').change(function () {
        sidecheck = $("#cd-channelplan-sidecheck").prop('checked');
        clearChk();
    });


    $('#cd-channelplan-clearbutton').on('click', function () {
        clearChk();
    });

    function clearChk() {
        $('table#channelselect input:checkbox').prop('checked', false);
        $("table#channelselect .helt").css({
            'background-color': ''
        });
    }

    function checkNum(data) {
        if (isNaN(data) || data == "" || data.indexOf('-') != -1) {
            return false;
        } else {
            return true;
        }
    }

    function changeInput() {
        var helz = $("#cd-channelplan-helz").val();
        if (checkNum(helz) == false) return false;
        helz = parseFloat(helz);

        var span = $("#cd-channelplan-span").val();
        if (checkNum(span) == false) return false;
        span = parseFloat(span) / 1000.0

        var startCh = $("#cd-channelplan-startCh").val();
        if (checkNum(startCh) == false) return false;

        var endCh = $("#cd-channelplan-endCh").val();
        if (checkNum(endCh) == false) return false;

        for (var i = 0; i < MAX_CH; i++) {
            if (i >= startCh && i <= endCh) {
                var ch = (helz + span * (i - startCh)).toFixed(4);
                $("#label" + i + " .helt").text("[" + i + "]" + ch.toString());
                $(":input[name^='in" + i + "']").prop('disabled', false);
            } else {
                $("#label" + i + " .helt").text("");
                $(":input[name^='in" + i + "']").prop('disabled', true);
            }
        }
    }

    function arrayCountValues(arr) {
        var v, freqs = {};

        // для каждого v в массиве увеличить счетчик частоты в таблице
        for (var i = arr.length; i--;) {
            v = arr[i];
            if (freqs[v]) freqs[v] += 1;
            else freqs[v] = 1;
        }

        // вернуть таблицу частот
        return freqs;
    }

    $('.cd-channelplan-baseval').keyup(function () {
        changeInput();
    });

    $('.cd-channelplan-chsel').change(function (event) {
        var startCh = $("#cd-channelplan-startCh").val();
        var endCh = $("#cd-channelplan-endCh").val();

        $("table#channelselect .helt").css({
            'background-color': ''
        });

        event.preventDefault();
        var selectedIDs = [];
        var avoidIDs = [];
        var doubleIDs = [];

        $('table#channelselect input:checkbox:checked').map(function () {
            var ids = parseInt($(this).val(), 10);
            selectedIDs.push(ids);
            doubleIDs.push(ids * 2);

            avoidIDs.push(ids);
            if (sidecheck) {
                avoidIDs.push(ids - 1);
                avoidIDs.push(ids + 1);
            }
        });

        if (selectedIDs.length == 0) return;

        // Расчет двухволновой интермодуляции третьего порядка
        for (var j = 0; j < doubleIDs.length; j++) {
            for (var i = 0; i < selectedIDs.length; i++) {
                if (j == i) continue;
                avoidIDs.push(doubleIDs[j] - selectedIDs[i]);
            }
        }

        // Расчет интермодуляции 3-го порядка для 3 волн
        if (selectedIDs.length >= 3) {
            for (var x = 0; x < selectedIDs.length; x++) {
                for (var y = 0; y < selectedIDs.length; y++) {
                    for (var z = 0; z < selectedIDs.length; z++) {
                        if (x == y || y == z || z == x) continue;
                        var calc = selectedIDs[y] - selectedIDs[z] + selectedIDs[x];
                        if (calc > 0) avoidIDs.push(calc);
                    }
                }
            }
        }

        var freq = arrayCountValues(avoidIDs);

        // Дублированный список
        var b = avoidIDs.filter(function (x, i, self) {
            return self.indexOf(x) === i;
        });

        for (var i = 0; i < b.length; i++) {
            if (freq[b[i]] >= 2 && $.inArray(b[i], selectedIDs) != -1) {
                $("#label" + b[i] + " .helt").css({
                    'background-color': 'red'
                });
            } else if (freq[b[i]] == 1 && $.inArray(b[i], selectedIDs) != -1) {
                $("#label" + b[i] + " .helt").css({
                    'background-color': 'lime'
                });
            } else {
                $("#label" + b[i] + " .helt").css({
                    'background-color': 'yellow'
                });
            }
        }
    });
});
