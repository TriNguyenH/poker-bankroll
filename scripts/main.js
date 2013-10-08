/************************************************************
 * My Poker Bankroll                                        *
 ***********************************************************/
$(function() {

    //document.addEventListener("deviceready", deviceready, true);

    deviceready();

    getCurrentSession();

    $('#btnCalculate').on("click", function(e) {

        $subtotal = 0;

        try { $subtotal = parseFloat($("#subtotal").val()); }
        catch (err) { $subtotal = 0; }

        if ($subtotal > 0) {

            $num_people = parseInt($("#number_of_participant").val());

            $each = $subtotal / $num_people;

            $("#span10").html("$" + Math.round(($subtotal * 1.10) / $num_people * 100) / 100);

            $("#span15").html("$" + Math.round(($subtotal * 1.15) / $num_people * 100) / 100);

            $("#span18").html("$" + Math.round(($subtotal * 1.18) / $num_people * 100) / 100);

            $(".result").css("display", "block");
        }
    });
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
    alert(e.message);
}

function dbReady() {

    $('#btnAddTransaction').on("click", function(e) {
        db.transaction(function(tx) {
            var d = new Date();
            d.setDate(d.getDate() - randRange(1, 30));
            var amount = parseFloat($('#amount').val());
            var description = "test";
            tx.executeSql("insert into transactions(amount, type) value(?,?,?)", [amount, description]);
        }, errorHandler, function() { alert("added"); });
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
























function getCurrentSession() {
    $hasCurrentSession = true;
    
    //Get current session
    if ($hasCurrentSession == true) {

        $transaction = $("#transaction");
        $transaction.addClass("active");
        $transaction.html("Session started on 1/1/1900 12:00 PM");
        $transaction.show();
        
        $transaction = $("#li_session");

        $transaction.removeClass('add');

        $transaction.addClass('close');
        $transaction.addClass('stop');

        $transaction.find("a").first().text("Stop Current Session");
    }
}

function addFund() {
    alert("Fund added");
}

function startSession() {

}

function stopSession() {

}

function displayBalance() {

}

function displayStatistics() {

}

function displaySessions() {

}

function displayTransactions() {

}