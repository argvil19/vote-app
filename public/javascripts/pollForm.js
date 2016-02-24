function addOpt(e) {
	var optName = $('#optName').val();
	var opts = $('#voteOpts').html();

	if (!optName) {
		$('#poll-opt-mes').html('You must set the vote option name');
		return false;
	} else if(checkDuplicate(optName)) {
		$('#poll-opt-mes').html("You can't have duplicated vote options");
		return false;
	}

	function checkDuplicate(string) {
		var arr = document.getElementsByTagName('option');
		for (var i=0;i<arr.length;i++) {
			if (arr[i].value === string) {
				return true;
			}
		}
		return false;
	}

	$('#poll-opt-mes').empty();
	$('#voteOpts').html(opts + '<option value="' + optName + '">' + optName + '</option>');
	return false;
}

function delOpt(e) {
	var options = document.getElementsByTagName('option');

	if (!options) {
		return false;
	}
	for (var i=0; i<options.length;i++) {
		if (options[i].selected) {
			$(options[i]).remove();
			break;
		}
	}
	return false;
}

function submitForm(e) {
	$('#poll-nm-mes').empty();
	var pollName = $('#pollName').val();
	var options = document.getElementsByTagName('option');
	var opts = [];
	if (!pollName) {
		$('#poll-nm-mes').html('You must specify a poll name');
		return false;
	} else if(document.getElementsByTagName('option').length < 2) {
		$('#poll-nm-mes').html('Your poll must have at least two vote options');
		return false;
	}

	for (var i=0; i<options.length;i++) {
		opts.push(options[i].value);
	}

	$('#hiddenOpts').val(JSON.stringify(opts));
	return true;
}

$(document).ready(function() {
	$('#addOpt').on('click', addOpt);
	$('#rmvOpt').on('click', delOpt);
	$('#btnSubmit').on('click', submitForm);
})