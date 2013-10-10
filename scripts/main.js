/************************************************************
 * My Poker Bankroll                                        *
 * Created by Tri Nguyen                                    *
 * http://triapp.co                                         *
 ***********************************************************/
$(function() {

    //document.addEventListener("deviceready", deviceready, true);

    deviceready();

    displayBalance();

    if ($('#tblTransactions').length > 0) displayTransactions();

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

        $description = $('#type').val();

        try { $amount = parseFloat($('#amount').val()); }
        catch (err) { $amount = 0; }

        if ($amount > 0) {
            // Insert new transaction into the database
            db.transaction(function(tx) {
                var d = new Date();
                tx.executeSql("insert into transactions(amount, type, created) values(?,?,?)", [$amount, $description, d]);
            }, errorHandler, function() {
                $object = $('#message');
                $object.removeClass('error').addClass('success');
                $object.html('Transaction has been added.');
            });
        }
        else {
            $object = $('#message');
            $object.removeClass('success').addClass('error');
            $object.html('Enter all required fields.');
        }
    });

    $('#clearButton').on("touchstart", function(e) {
        db.transaction(function(tx) {
            tx.executeSql("delete from log");
        }, errorHandler, function() { $("#result").html("Cleared all rows."); });
    });

    $("#ShowButton").on("touchstart", function(e) {
        db.transaction(function(tx) {
            tx.executeSql("select * from log order by created desc", [], gotLog, errorHandler);
        }, errorHandler, function() { });
    });
}

function gotLog(tx, results) {
    if (results.rows.length == 0) {
        $("#result").html("No data.");
        return false;
    }

    var s = "";

    for (var i = 0; i < results.rows.length; i++) {
        var d = new Date();
        d.setTime(results.rows.item(i).created);
        s += d.toDateString() + " " + d.toTimeString() + "<br/>";
    }

    $("#result").html(s);
}


function displayBalance() {

}

function displayStatistics() {

}

function displaySessions() {

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
                $object.html('You have removed a record with id ' + id);
            });
            break;

        case "session":

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

            $("#result").html(s);
        }
    , errorHandler);
    }, errorHandler, function() { });
}

function formatCurrency(amount) {
    var strFormatted = "";

    $amount = 0;

    try { $amount = parseFloat(amount); }
    catch (err) { $amount = 0; }

    strFormatted = "$" + $amount.toFixed(2); 

    return strFormatted;
}