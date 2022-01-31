﻿
function toDate(dStr, format) {
    var now = new Date();
    if (format == "h:m") {
        now.setHours(dStr.substr(0, dStr.indexOf(":")));
        now.setMinutes(dStr.substr(dStr.indexOf(":") + 1));
        now.setSeconds(0);
        return now;
    } else
        return "Invalid Format";
}



function submitOvertime() {

    var nik = $('#nikUser').val();
    var obj = new Object();
    obj.NIK = nik;
    obj.OvertimeRequests = listRequest;
    console.log(obj);
    var objJson = JSON.stringify(obj);
    console.log(objJson);

    $.ajax({
        url: "https://localhost:44388/API/OvertimeRequests/RequestForm",
        type: "POST",
        data: objJson,
        contentType: "application/json;charset=utf-8"
    }).done((result) => {
        if (result == 200) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: "Request Success",
                type: 'success'
            });
            $("table tbody").empty();
            listRequest = [];
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "Error, U Dont Have Manager!!",
                type: 'error'
            });
        }
    }).fail((error) => {
        console.log(error);
        Swal.fire({
            icon: 'failed',
            title: 'Failed',
            text: error.message,

        });
    });

    

}

$('#submitRequestOvertime').submit(function (e) {
    e.preventDefault();

    // do ajax now
    submitOvertime();
    //$('#formOvertime').trigger("reset");


});

let listRequest = [];



$(document).ready(function () {
    $("#buttonAdd").click(function () {
        var dateList = $("#date").val();
        var startTimeList = $("#startTime").val();
        var endTimeList = $("#endTime").val();
        var noteJobList = $("#overtimeNote").val();

        var timeDateStart = toDate(startTimeList, "h:m");
        console.log("st1: " + startTimeList);

        var timeDateEnd = toDate(endTimeList, "h:m");


        $.ajax({
            url: "https://localhost:44388/API/OvertimeLimits/OL01",
            type: "GET"
        }).done((result) => {
            var minus = timeDateEnd - timeDateStart;
            console.log("minus: " + minus);
            console.log(result);
            var max = result.maxOvertime.totalMilliseconds;
            console.log("max: " + max);

            if (endTimeList <= startTimeList) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: "Request Failed, Please check your request time",
                    type: 'error'
                });
            }
            else if (minus > max) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: "Request Failed, Overtime over the limit",
                    type: 'error'
                });
            }
            else {

                var row = "<tr><td>" + dateList + "</td><td>" + startTimeList + "</td><td>" + endTimeList + "</td><td>" + noteJobList + "</td>";
                $("table tbody").append(row);

                var objData = new Object();
                objData.date = dateList;
                objData.startTime = startTimeList;
                objData.endTime = endTimeList;
                objData.jobNote = noteJobList;
                console.log(objData);
                listRequest.push(objData);
                //MASIH GAGAL
                //$(".formOvertime").trigger("reset"); //reset form
                $(".input").val(""); //reset form
            }

        }).fail((error) => {
            console.log(error)
        })



    });
});

