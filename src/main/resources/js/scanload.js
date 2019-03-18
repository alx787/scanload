
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
    // установить блокировку на выполнение операций
    ////////////////////////////////////////////
    var isAccessLocked = function() {
        return lockOperations;
    }

    var tryAccessLock = function() {
        if (!lockOperations) {
            lockOperations = true;
            return true;
        }
        return false;
    }

    var setAccessUnlock = function() {
        lockOperations = false;
        return true;
    }



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
    // проверить отличаются ли файлы в таблице
    // и файлы полученные с сервера
    ////////////////////////////////////////////
    // true - changed, false - not changed
    var tableISChanged = function(jsonData) {

        // console.log("=================================================================");
        // console.log("проверка того что те же файлы на сервере и в задаче в панели загрузки");
        //
        // console.log("данные полученные с сервера");
        // console.log(jsonData);

        // пробегаем по jsonData полученному с сервера и сравниваем их с таблицей на клиенте
        // если что то не сходится то сразу возвращаем true


        var tableObj = AJS.$("table#filesOnLocalSide tbody tr");
        var tableSize = tableObj.size();

        // если количество не сходится то безоговорочно есть изменения
        if (jsonData.length != tableSize) {
            return true;
        }


        // возвращаемое значение
        var retVal = true;


        var tableFilename = "";    // имя файла в таблице
        var tableFilesize = "";    // размер файла в таблице

        // проходим по jsonData
        for (var i = 0; i < jsonData.length; i++) {
            // console.log("====== " + jsonData[i].name + " ====== " + jsonData[i].size);

            retVal = true;

            // проходим по таблице
            for (var j = 0; j < tableSize; j++) {
                tableFilename = AJS.$(tableObj[j]).find(".column_1").text();
                tableFilesize = AJS.$(tableObj[j]).find(".column_2").text();

                //
                if ((jsonData[i].name == tableFilename) && (jsonData[i].size == tableFilesize)) {
                    retVal = false;
                }
            }

            if (retVal) {
                break;
            }

        }

        // AJS.$(AJS.$("table#filesOnLocalSide tbody tr")[1]).find(".column_2").text()

        return retVal;
    }



    ////////////////////////////////////////////
    // проверить есть ли файлы из таблицы
    // во вложениях, если есть то покрасить
    // строку красными, иначе обычным
    ////////////////////////////////////////////
    var colorizedRows = function() {

        // var json_size = jsonObj.length;

        // получим существующие вложения
        var issueIdObj = AJS.$("a#key-val");
        // массив с вложениями в формате JSON obj
        var issueAttachsJson = [];

        if (issueIdObj.length == 1) {
            issueAttachsJson = issueAttachments(issueIdObj.text());
        }

        // признак того что имя файла найдено во вложениях
        // var findInAttach = false;


        var currAttachLength = issueAttachsJson.length;


        var tableObj = AJS.$("table#filesOnLocalSide tbody tr");
        var tableSize = tableObj.size();

        var tableFilename = "";    // имя файла в таблице
        var tableFilesize = "";    // размер файла в таблице


        for (var i = 0; i < currAttachLength; i++) {

            console.log(" =================== ");
            console.log("issueAttachsJson[i] ");
            console.log(issueAttachsJson[i]);

            // проходим по таблице
            for (var j = 0; j < tableSize; j++) {
                tableFilename = AJS.$(tableObj[j]).find(".column_1").text();
                tableFilesize = AJS.$(tableObj[j]).find(".column_2").text();

                //
                // if ((issueAttachsJson[ii].filename == tableFilename) && (jsonData[i].size == tableFilesize)) {
                if ((issueAttachsJson[i].filename == tableFilename) && (issueAttachsJson[i].size == tableFilesize)) {
                    // нашли во вложениях - закрасить строку красным

                } else {
                    // не нашли во вложениях - закрасить строку черным

                }
            }



            //
            // //ищем среди текущих вложений
            // findInAttach = false;
            // for (var ii = 0; ii < currAttachLength; ii++) {
            //     if (jsonObj[i].name == issueAttachsJson[ii].filename) {
            //         findInAttach = true;
            //     }
            // }

        }

    }



    ////////////////////////////////////////////
    // заполнить таблицу файлов в папке загрузки
    ////////////////////////////////////////////
    var refresh = function() {

        // console.log("============= refresh =============");


        // if (AJS.$("table#filesOnLocalSide tbody").length == 0) {
        //     return false;
        // }

        // if (!tryAccessLock()) {
        //     return true;
        // }


        AJS.$.ajax({
            url: AJS.params.baseURL + "/rest/exploreattach/1.0/scanload/getdirectorycontent",
            type: 'get',
            dataType: 'json',
            async: true,
            success: function(data) {


                if (!tableISChanged(data)) {
                    // обновим цвета строк
                    colorizedRows();
                    // возврат
                    return;
                }

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

                    // обновление окна задачи
                    JIRA.trigger(JIRA.Events.REFRESH_ISSUE_PAGE, [JIRA.Issue.getIssueId()]);

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
    } , 4000);
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
