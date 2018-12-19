function StartSeach() {
    //先取得目前的row數
    var num = document.getElementById("table").rows.length;
    //防止把標題跟原本的第一個刪除XD
    if (num > 0) {
        for (i = 0; i < num; i++) {
            document.getElementById("table").deleteRow(-1);
        }
    }

    var t = document.getElementById('tb').value;
    var g = t.substring(0, 1);
    if (g == '台') {
        t = t.replace('台', '臺');
    } else { };

    var url = "https://ptx.transportdata.tw/MOTC/v2/Rail/TRA/Station?$select=StationID%2CStationName&$filter=StationName%2FZh_tw%20eq%20'" + t + "'&$top=30&$format=JSON"
    $.ajax({
        type: "GET",
        url: url,
        contentType: "application/json; charset=utf-8",
        headers: GetAuthorizationHeader(),
        success: function (data) {
            if (data.length == 0) {
                console.log('查無資料');
                $('#statusBar').text('查無資料');
            }
            else {
                $('#statusBar').text(t + '車站即時電子看板');

                var d = new Date();
                datetext = d.toTimeString();
                var time = datetext.split(' ')[0];
                console.log(time);
                var id = "";

                $.each(data, function (i, item) {
                    if (i == 0) {
                        id = item.StationID;
                    }
                    else { }
                })
                var url = "https://ptx.transportdata.tw/MOTC/v2/Rail/TRA/LiveBoard/Station/" + id + "?$select=TrainNo%2CDirection%2CTrainTypeID%2CEndingStationName%2CScheduledArrivalTime%2CDelayTime&$format=JSON";
                $.ajax({
                    type: "GET",
                    url: url,
                    contentType: "application/json; charset=utf-8",
                    headers: GetAuthorizationHeader(),
                    success: function (data) {
                        $('#table').append('<tr><th>方向</th><th>車次</th><th>車種</th><th>訖站</th><th>延遲</th><th>預估到站</th></tr>');

                        $.each(data, function (i, item) {
                            var delayTime = item.DelayTime;
                            var arrivalTime = item.ScheduledArrivalTime;

                            //車種
                            var trainClass = item.TrainClassificationID;
                            switch (trainClass) {
                                case "1132":
                                    trainClass = "區間快"
                                    break;

                                case "1102":
                                    trainClass = "太魯閣"
                                    break;
                                case "1107":
                                    trainClass = "普悠瑪"
                                    break;

                                case "1103":
                                    trainClass = "自強"
                                    break;
                                case "1104":
                                    trainClass = "自強"
                                    break;
                                case "1106":
                                    trainClass = "自強"
                                    break;
                                case "1108":
                                    trainClass = "自強"
                                    break;
                                case "1100":
                                    trainClass = "自強"
                                    break;
                                case "1101":
                                    trainClass = "自強"
                                    break;

                                case "1110":
                                    trainClass = "莒光"
                                    break;
                                case "1111":
                                    trainClass = "莒光"
                                    break;
                                case "1112":
                                    trainClass = "莒光"
                                    break;
                                case "1113":
                                    trainClass = "莒光"
                                    break;
                                case "1115":
                                    trainClass = "莒光"
                                    break;
                                case "1110":
                                    trainClass = "莒光"
                                    break;

                                case "1120":
                                    trainClass = "復興"
                                    break;
                                case "1122":
                                    trainClass = "復興"
                                    break;
                                default:
                                    trainClass = "區間";
                            };


                            //console.log(arrivalTime);
                            var arrivalTime = arrivalTime.split(':');
                            var hours = parseInt(arrivalTime[0]);
                            var minutes = parseInt(arrivalTime[1]);
                            var seconds = arrivalTime[2];
                            minutes = minutes + delayTime;

                            if (minutes >= 60 && minutes < 120) {
                                minutes = minutes - 60;
                                hours = hours + 1;
                                //if (hours >= 24) { hours = hours - 24 };
                            }
                            else if (minutes >= 120 && minutes < 180) {
                                minutes = minutes - 120;
                                hours = hours + 2;
                                //if (hours >= 24) { hours = hours - 24 };
                            }
                            else if (minutes >= 180) {

                            }
                            else { };

                            hours = hours.toString();
                            minutes = minutes.toString();

                            if (minutes.length < 2) {
                                minutes = 0 + minutes;
                            } else { };
                            arrivalTime = hours + ':' + minutes + ':' + seconds;
                            console.log(arrivalTime);

                            if (arrivalTime > time) {
                                var direction = item.Direction;
                                var trainNo = item.TrainNo;
                                var endStop = item.EndingStationName.Zh_tw;

                                if (direction == 0) { direction = "順行" }
                                else { direction = "逆行" };

                                //修改arrivalTime格式
                                var hours = parseInt(hours);
                                if (hours >= 24) { hours = hours - 24 }
                                else { };
                                hours = hours.toString();
                                if (hours.length < 2) {
                                    hours = 0 + hours;
                                } else { };

                                //先取得目前的row數
                                var num = document.getElementById("table").rows.length;
                                //建立新的tr 因為是從0開始算 所以目前的row數剛好為目前要增加的第幾個tr
                                var Tr = document.getElementById("table").insertRow(num);
                                Td = Tr.insertCell(Tr.cells.length);
                                Td.innerHTML = '<td class="cell">' + direction + '</td>';
                                Td = Tr.insertCell(Tr.cells.length);
                                Td.innerHTML = '<td class="cell">' + trainNo + '</td>';
                                Td = Tr.insertCell(Tr.cells.length);
                                Td.innerHTML = '<td class="cell">' + trainClass + '</td>';
                                Td = Tr.insertCell(Tr.cells.length);
                                Td.innerHTML = '<td class="cell">' + endStop + '</td>';
                                Td = Tr.insertCell(Tr.cells.length);
                                Td.innerHTML = '<td class="cell">' + delayTime + '分' + '</td>';
                                Td = Tr.insertCell(Tr.cells.length);
                                Td.innerHTML = '<td class="cell">' + arrivalTime + '</td>';
                            }
                            else { }
                        })
                    }
                })
            }
        }
    })
}
function GetAuthorizationHeader() {
    var AppID = '6fa41fdd4768445796e6616251609648';
    var AppKey = 'AYlzlwsYEA8gamqCwxy8Pg2cc38';

    var GMTString = new Date().toGMTString();
    var ShaObj = new jsSHA('SHA-1', 'TEXT');
    ShaObj.setHMACKey(AppKey, 'TEXT');
    ShaObj.update('x-date: ' + GMTString);
    var HMAC = ShaObj.getHMAC('B64');
    var Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';

    return { 'Authorization': Authorization, 'X-Date': GMTString /*,'Accept-Encoding': 'gzip'*/ }; //如果要將js運行在伺服器，可額外加入 'Accept-Encoding': 'gzip'，要求壓縮以減少網路傳輸資料量
}
