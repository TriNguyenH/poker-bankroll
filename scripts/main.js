/************************************************************
 * My Poker Bankroll                                        *
 * Created by Tri Nguyen                                    *
 * http://triapp.co                                         *
 ***********************************************************/
$(function() {

    //document.addEventListener("deviceready", deviceready, true);

    deviceready();

    if ($('#balance').length > 0) displayBalance();

    if ($('#tblTransactions').length > 0) displayTransactions();

    if ($('#tblSessions').length > 0) displaySessions();

});

function deviceready() {
    db = window.openDatabase("pokerbankroll", "1.0", "My Poker Bankroll", 1000000);
    db.transaction(setupDB, errorHandler, dbReady);
}

function setupDB(tx) {
    //Transactions
    tx.executeSql('create table if not exists transactions(id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                  'amount FLOAT, type TEXT, created DATE)');

    //Sessions
    tx.executeSql('create table if not exists sessions(id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                  'location TEXT, start_date DATE, hours FLOAT, amount FLOAT)');
}

function errorHandler(e) {
    //alert(e.message);
    return false;
}

/******************************************************
 * At this point, we know that local database exist
*******************************************************/
function dbReady() {

    $('#btnAddTransaction').on("click", function(e) {
        $amount = 0;

        $type = $('#type').val();

        try { $amount = Math.abs(parseFloat($('#amount').val())); }
        catch (err) { $amount = 0; }

        if ($amount > 0) {

            if ($type == "Withdrawal") { $amount = $amount * -1; }

            // Insert new transaction into the database
            db.transaction(function(tx) {
                var d = new Date();
                tx.executeSql("insert into transactions(amount, type, created) values(?,?,?)", [$amount, $type, d]);
            }, errorHandler, function() {
                $object = $('#message');
                $object.removeClass('error').addClass('success');
                $object.html('Transaction has been added.');
                $('#amount').val('');
            });
        }
        else {
            $object = $('#message');
            $object.removeClass('success').addClass('error');
            $object.html('Enter all required fields.');
        }
    });

    $('#btnAddSession').on("click", function(e) {
        $amount = 0;
        $hours = 0;
        $date = new Date();
        $location = $('#location').val();

        try { $amount = Math.abs(parseFloat($('#amount').val())); }
        catch (err) { $amount = 0; }

        try { $hours = Math.abs(parseFloat($('#hours').val())); }
        catch (err) { $hours = 0; }

        try { $date = new Date($('#date').val()); }
        catch (err) { $date = new Date(); }

        if ($amount > 0) {
            if ($('#status').val() == "Loss") { $amount = $amount * -1; }
            
            // Insert new session into the database
            db.transaction(function(tx) {
                var d = new Date();
                tx.executeSql("insert into sessions(location, start_date, hours, amount) values(?,?,?,?)", [$location, $date, $hours, $amount]);
            }, errorHandler, function() {
                $object = $('#message');
                $object.removeClass('error').addClass('success');
                $object.html('Session has been added.');
                $('#amount').val('');
                $('#hours').val('');
                $('#location').val('');
            });
        }
        else {
            $object = $('#message');
            $object.removeClass('success').addClass('error');
            $object.html('Enter all required fields.');
        }
    });
}

function displayBalance() {
    db.transaction(function(tx) {

        $sessionTotal = 0;
        $transactionTotal = 0;

        //Get Session Total = win - loss
        tx.executeSql("select SUM(amount) as total from sessions", [],
        function(tx, results) {
            if (results.rows.length == 0) {
                return false;
            }

            $sessionTotal = parseFloat(results.rows.item(0).total);
        }
        , errorHandler);

        //Get Session Total = win - loss
        tx.executeSql("select SUM(amount) as total from transactions", [],
        function(tx, results) {
            if (results.rows.length == 0) {
                return false;
            }
            $transactionTotal = parseFloat(results.rows.item(0).total);
        }
        , errorHandler);

    }, errorHandler, function() {
        $("#balance").html("BALANCE: " + formatCurrency($sessionTotal + $transactionTotal));
    });
}

function getTransactionalBalance() {
    $amount = 0;

    db.transaction(function(tx) {
        tx.executeSql("select * from transactions", [],
        function(tx, results) {
            if (results.rows.length == 0) {
                return amount;
            }

            $table = $('#tblSessions');

            for (var i = 0; i < results.rows.length; i++) {

            }
        }
    , errorHandler);
    }, errorHandler, function() { });

    return $amount;
}

function displaySessions() {
    db.transaction(function(tx) {
        tx.executeSql("select * from sessions order by start_date desc", [],
        function(tx, results) {
            if (results.rows.length == 0) {
                return false;
            }

            $table = $('#tblSessions');

            for (var i = 0; i < results.rows.length; i++) {

                var d = new Date(results.rows.item(i).start_date);

                $table.append('<tr class="' + (i % 2 == 0 ? 'bgcolor0' : 'bgcolor1') + '">' +
                                '<td class="action"><img src="images/delete.png" onclick="removeRecord(\'session\',' + results.rows.item(i).id + ', this);" /></td>' +
                                '<td class="date" >' + d.getMonth() + '/' + d.getDate() + '/' + d.getFullYear() + '</td>' +
                                '<td>' + results.rows.item(i).location + '</td>' +
                                '<td class="right">' + results.rows.item(i).hours + ' hrs</td>' +
                                '<td class="right">' + formatCurrency(results.rows.item(i).amount) + '</td>' +
                              '</tr>');
            }
        }
    , errorHandler);
    }, errorHandler, function() { });
}

function removeRecord(type, id, element) {
    var removed = false;

    switch (type) {
        case "transaction":
            db.transaction(function(tx) {
                tx.executeSql("delete from transactions WHERE id = " + id);
            }, errorHandler, function() {
                //remove the row
                $row = $(element).parent().parent();
                $row.remove();

                $object = $('#message');
                $object.removeClass('error').addClass('success');
                $object.html('You have removed a record with id = ' + id);
            });
            break;

        case "session":
            db.transaction(function(tx) {
                tx.executeSql("delete from sessions WHERE id = " + id);
            }, errorHandler, function() {
                //remove the row
                $row = $(element).parent().parent();
                $row.remove();

                $object = $('#message');
                $object.removeClass('error').addClass('success');
                $object.html('You have removed a record with id = ' + id);
            });
            break;

        default:

            break;
    }

    return removed;
}

function displayTransactions() {
    db.transaction(function(tx) {
        tx.executeSql("select * from transactions order by created desc", [],
        function(tx, results) {
            if (results.rows.length == 0) {
                return false;
            }

            $table = $('#tblTransactions');

            for (var i = 0; i < results.rows.length; i++) {

                var d = new Date(results.rows.item(i).created);

                $table.append('<tr class="' + (i % 2 == 0 ? 'bgcolor0' : 'bgcolor1') + '">' +
                                '<td class="action"><img src="images/delete.png" onclick="removeRecord(\'transaction\',' + results.rows.item(i).id + ', this);" /></td>' +
                                '<td class="date" >' + d.getMonth() + '/' + d.getDate() + '/' + d.getFullYear() + '</td>' +
                                '<td>' + results.rows.item(i).type + '</td>' +
                                '<td class="right">' + formatCurrency(results.rows.item(i).amount) + '</td>' +
                              '</tr>');
            }
        }
    , errorHandler);
    }, errorHandler, function() { });
}

function formatCurrency(amount) {
    var strFormatted = "";

    $amount = 0;

    try { $amount = Math.abs(parseInt(amount)); }
    catch (err) { $amount = 0; }

    strFormatted = $amount.toFixed(0);

    switch (strFormatted.length) {
        case 4: case 5: case 6:
            strFormatted = (amount < 0 ? "-" : "") + "$" + strFormatted.substring(0, strFormatted.length - 3) + "," + strFormatted.substring(strFormatted.length-3, strFormatted.length);
            break;
        default:
            strFormatted = (amount < 0 ? "-" : "") + "$" + strFormatted;
            break;
    }
    
    return strFormatted;
}