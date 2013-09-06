$(function() {

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