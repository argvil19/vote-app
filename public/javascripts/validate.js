function validateEmail(e) {
    e.preventDefault();
	var email = document.getElementById('email').value;
	var re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
	
	if(!re.test(email)) {
		$('.message-status').html('You must introduce a valid email');
	} else {
		$('.message-status').empty();
		$(this).unbind('submit').submit();
	}
}

$(document).ready(function() {
    $(document.forms[0]).on("submit", validateEmail);
});