function selectedSelect(e) {
    var options = document.getElementsByTagName('option');
    for (var i=0;i<options.length;i++) {
        if (options[i].selected) {
            return true;
        }
    }
    $('.status-msg').html('You must select a poll');
    return false;
}

$(document).ready(function() {
    $('#btnSubmit').on('click', selectedSelect);
});