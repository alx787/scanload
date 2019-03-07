
var scanload = {};
scanload.module = [];

scanload.module = (function () {

    var rowTemplate = '<tr __style__>'
        + '<td class="column_1">__name__</td>'
        + '<td class="column_2">__size__</td>'
        + '<td class="column_3"><input type="checkbox" __checked__></td>'
        + '</tr>';

    // + '<td class="column_3"><input type="checkbox" checked></td>'

    // переменная для блокирования всех операций
    var lockOperations = false;


    ////////////////////////////////////////////
    // получить текущие вложения задачи
    ////////////////////////////////////////////
    var issueAttachments = function(issueId) {

        var responseObj = AJS.$.ajax({
            url: AJS.params.baseURL + "/rest/api/2/issue/" + issueId,
            type: 'get',
            dataType: 'json',
            async: false,
        });

        var attachs = [];

        if (responseObj.statusText == "success") {
            var jsonObj = JSON.parse(responseObj.responseText);

            var attachsArr = jsonObj.fields.attachment;
            var attachsArrLength = jsonObj.fields.attachment.length;

            for (var i = 0; i < attachsArrLength; i++) {
                arrElem = {};
                arrElem.id = attachsArr[i].id;
                arrElem.filename = attachsArr[i].filename;
                arrElem.size = attachsArr[i].size;

                attachs.push(arrElem);
            }
        }

        // console.log("issue attachments");
        // console.log(attachs);

        return attachs;
    }


    ////////////////////////////////////////////
    // заполнить таблицу файлов в папке загрузки
    ////////////////////////////////////////////
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

                var tableObjTr = AJS.$("table#filesOnLocalSide tbody tr");

                var tableObjTrLength = tableObjTr.length;

                // соберем строки которые отмечены галками
                // чтоб сохранить галки при обновлении таблицы
                var checkedRows = []; // массив строк - имена файлов которые были отмечены галками

                for (var i = 0; i < tableObjTrLength; i++) {
                    if (AJS.$(AJS.$(tableObjTr[i]).children()[2]).find("input[type='checkbox']").attr("checked") == "checked") {
                        checkedRows.push(AJS.$(tableObjTr[i]).children()[0].innerText);
                    }
                }

                console.log(" =========== сохраненнные строки ===========");
                console.log(checkedRows);


                var tableObj = AJS.$("table#filesOnLocalSide tbody");

                // очистка таблицы
                tableObj.empty();

                // получим существующие вложения
                var issueIdObj = AJS.$("a#key-val");
                // массив с вложениями в формате JSON obj
                var issueAttachsJson = [];

                if (issueIdObj.length == 1) {
                    issueAttachsJson = issueAttachments(issueIdObj.text());
                }

                // признак того что имя файла найдено во вложениях
                var findInAttach = false;
                // признак того что имя файла было отмечено ранее перед обновлением
                var findInChecked = false;


                var currAttachLength = issueAttachsJson.length;

                for (var i = 0; i < json_size; i++) {

                    //ищем среди текущих вложений
                    findInAttach = false;
                    for (var ii = 0; ii < currAttachLength; ii++) {
                        if (jsonObj[i].name == issueAttachsJson[ii].filename) {
                            findInAttach = true;
                        }
                    }

                    //ищем среди ранее отмеченных галками
                    findInChecked = false;
                    for (var ii = 0; ii < currAttachLength; ii++) {
                        if (checkedRows.indexOf(jsonObj[i].name) != -1) {
                            findInChecked = true;
                        }
                    }

                    // заполняем значения строки
                    rowStr = rowTemplate.replace("__name__", jsonObj[i].name);
                    rowStr = rowStr.replace("__size__", jsonObj[i].size);


                    // если вложение есть в задаче то установим красный цвет
                    if (findInAttach) {
                        rowStr = rowStr.replace("__style__", "style=\"color: #FF0000;\"");
                    } else {
                        rowStr = rowStr.replace("__style__", "");
                    }

                    // если был отмечен перед обновлением то отметим заново
                    if (findInChecked) {
                        rowStr = rowStr.replace("__checked__", "checked=\"checked\"");
                    } else {
                        rowStr = rowStr.replace("__checked__", "");
                    }


                    // добавляем строку
                    tableObj.append(rowStr);
                }

                // console.log(data);
                // user = data.username;
            }
        });

        return true;

    }



    ////////////////////////////////////////////
    // загрузка отмеченных файлов
    ////////////////////////////////////////////
    var loadselected = function() {
        // alert(instr_1);
        console.log("============= loadselected =============");
        //
        // if (lockOperations) {
        //     console.log(" lockOperations is true ");
        //     lockOperations = false;
        // } else {
        //     console.log(" lockOperations is false ");
        //     lockOperations = true;
        // }

        // таблица
        var tableObj = AJS.$("table#filesOnLocalSide tbody tr");
        var tableObjLength = tableObj.length;

        var filesToLoad = [];

        for (var i = 0; i < tableObjLength; i++) {

            if (AJS.$(AJS.$(tableObj[i]).children()[2]).find("input[type='checkbox']").attr("checked") == "checked") {
                filesToLoad.push(AJS.$(tableObj[i]).children()[0].innerText);
            }
        }


        console.log(filesToLoad);
        console.log(filesToLoad.length);

        if (filesToLoad.length > 0) {

            var jsonObj = {};
            jsonObj.issueId = AJS.$("a#key-val").text();
            jsonObj.username = AJS.params.loggedInUser;
            jsonObj.filesToLoad = filesToLoad;


            AJS.$.ajax({
                url: AJS.params.baseURL + "/rest/exploreattach/1.0/scanload/getfile",
                type: 'post',
                dataType: 'json',
                data: JSON.stringify(jsonObj),
                async: true,
                contentType: "application/json; charset=utf-8",
                success: function(data) {

                    var dataLength = data.length;
                    var strMess = "";

                    for (var i = 0; i < dataLength; i++) {
                        strMess = strMess + '<li>' + data[i] + '</li>';
                    }

                    strMess = '<ul>' + strMess +'</ul>';

                    var myFlag = AJS.flag({
                        title: "Загружены вложения",
                        type: 'success',
                        body: strMess,
                    });

                    console.log(data);

                    // console.log(data);
                    // user = data.username;
                },
                error: function(data) {
                    var myFlag = AJS.flag({
                        type: 'error',
                        body: 'Ошибка загрузки',
                    });

                },
            });

        }

    }


    ////////////////////////////////////////////
    // загрузка файлов со сканера
    ////////////////////////////////////////////
    var loadfromscanner = function () {
        var myFlag = AJS.flag({
            title: "Не реализовано",
            type: 'success',
            body: "Функционал в планах",
        });

    }

    return {
        refresh:refresh,
        loadselected:loadselected,
        loadfromscanner:loadfromscanner
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
