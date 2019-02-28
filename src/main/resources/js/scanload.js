
var scanload = {};
scanload.module = [];

scanload.module = (function () {

    var rowTemplate = '<tr><td headers="basic-name">__name__</td><td headers="basic-size">__size__</td></tr>';

    var refresh = function() {

        // console.log("============= refresh =============");


        // if (AJS.$("table#filesOnLocalSide tbody").length == 0) {
        //     return false;
        // }


        AJS.$.ajax({
            url: AJS.params.baseURL + "/rest/exploreattach/1.0/scanload/getdirectorycontent",
            type: 'get',
            dataType: 'json',
            async: true,
            success: function(data) {

                // console.log("============= refresh =============");
                // var jsonText = "[{\"name\":\"rc_display.json\",\"size\":272},{\"name\":\"fernflower.jar\",\"size\":245371},{\"name\":\"\u041e\u0431\u0440\u0430\u0437\u0435\u0446 \u043f\u0438\u0441\u044c\u043c\u0430 \u0431\u0435\u0437 \u043b\u043e\u0433\u043e\u0442\u0438\u043f\u0430 (1).docx\",\"size\":22800},{\"name\":\"rc_asm.json\",\"size\":338},{\"name\":\"rclog.txt\",\"size\":894},{\"name\":\"\u041d\u0435\u043e\u0431\u0445\u043e\u0434\u0438\u043c\u044b\u0435+\u0441\u0430\u043c\u043e\u0441\u0442\u043e\u044f\u0442\u0435\u043b\u044c\u043d\u044b\u0435+\u0434\u043e\u0440\u0430\u0431\u043e\u0442\u043a\u0438 (1).doc\",\"size\":122135},{\"name\":\"rc_blocks.json\",\"size\":29},{\"name\":\"\u041e\u043f\u0438\u0441\u0430\u043d\u0438\u0435\u041c\u043e\u0434\u0443\u043b\u0435\u0439\u0414\u0436\u0438\u0440\u044b.doc\",\"size\":23552},{\"name\":\"rc_cfr.json\",\"size\":1628}]"
                // var jsonObj = JSON.parse(jsonText);
                var jsonObj = data;
                // console.log(jsonObj);

                var json_size = jsonObj.length;
                var rowStr = "";

                // таблица
                var tableObj = AJS.$("table#filesOnLocalSide tbody");
                // очистка таблицы
                tableObj.empty();

                for (var i = 0; i < json_size; i++) {
                    // заполняем значения строки
                    rowStr = rowTemplate.replace("__name__", jsonObj[i].name);
                    rowStr = rowStr.replace("__size__", jsonObj[i].size);

                    // добавляем строку
                    tableObj.append(rowStr);
                }

                // console.log(data);
                // user = data.username;
            }
        });

        return true;

    }

    var openloadscreen = function() {
        // alert(instr_1);
        console.log("============= openloadscreenh =============");
    }

    return {
        refresh:refresh,
        openloadscreen:openloadscreen
    };
}());


// AJS.$(function () {
AJS.toInit(function() {


    // запуск обновления списка файлов

    setInterval(function(){
        if (AJS.$("table#filesOnLocalSide tbody").length != 0) {
            scanload.module.refresh();
        }
    } , 5000);

    // console.log("===================");
    // console.log(AJS.$("#button-refresh"));
    //
    //
    //
    //
    //
    //
    // AJS.$("#button-refresh").click(function () {
    //     alert(123);
    //
    //     console.log("===================");
    //     console.log("===================");
    //     console.log("===================");
    //
    // });


    // function callAlert1() {
    //     alert(1111);
    // }
    //
    // function callAlert2() {
    //     alert(2222);
    // }

});


// JIRA.bind(JIRA.Events.NEW_CONTENT_ADDED, function (e, context, reason) {
//
//     //////////////////////////////////////////////////////////////////
//     // обновление нашего блока после добавления вложения
//     if (reason === JIRA.CONTENT_ADDED_REASON.panelRefreshed) {
//         alert(456);
//
//     }
//
// });
