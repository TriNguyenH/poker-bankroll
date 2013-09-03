$(function() {
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

            $(".result").css("display","block");
        }
    });
});