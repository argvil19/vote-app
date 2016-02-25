function dynamicColors() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgba(" + r + "," + g + "," + b + "";
};

function checkNewOpt() {
    var text = document.forms[1].optName.value;
    if (text) {
        return true;
    }
    
    $('.text-warning').html('You must specify a name for your new option');
    
    return false;
}

function checkSelected() {
    var items = $.makeArray($('.opts'));
    console.log(typeof items);
    
    for (var i=0;i<items.length;i++) {
        if (items[i].checked) {
            return true;
        }
    }
    
    $('.text-warning').html('You must check at least one option');
    
    return false;
}

$(document).ready(function() {
    Chart.defaults.global = {
    animation: true,
    animationSteps: 60,
    animationEasing: "easeOutQuart",
    showScale: true,
    scaleOverride: false,
    scaleSteps: null,
    scaleStepWidth: null,
    scaleLineColor: "rgba(0,0,0,.1)",
    scaleLineWidth: 1,
    scaleShowLabels: true,
    scaleLabel: "<%=value%>",
    scaleIntegersOnly: true,
    scaleBeginAtZero: false,
    scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
    scaleFontSize: 12,
    scaleFontStyle: "normal",
    scaleFontColor: "#666",
    responsive: false,
    maintainAspectRatio: true,
    showTooltips: true,
    customTooltips: false,
    tooltipEvents: ["mousemove", "touchstart", "touchmove"],
    tooltipFillColor: "rgba(0,0,0,0.8)",
    tooltipFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
    tooltipFontSize: 14,
    tooltipFontStyle: "normal",
    tooltipFontColor: "#fff",
    tooltipTitleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
    tooltipTitleFontSize: 14,
    tooltipTitleFontStyle: "bold",
    tooltipTitleFontColor: "#fff",
    tooltipYPadding: 6,
    tooltipXPadding: 6,
    tooltipCaretSize: 8,
    tooltipCornerRadius: 6,
    tooltipXOffset: 10,
    tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>",
    multiTooltipTemplate: "<%= value %>",
    onAnimationProgress: function(){},
    onAnimationComplete: function(){}
}
    var data = [];
    var votes = document.getElementsByClassName('votes');
    var opts = document.getElementsByClassName('opts');
    for (var i=0;i<opts.length;i++) {
        var color = dynamicColors();
        data.push({
            label:opts[i].value,
            color: color+",0.7)",
            highlight:color+",1)",
            value: parseInt(votes[i].value)
        });
    }
    
    var ctx = document.getElementById('myChart').getContext('2d');
    var myNewChart = new Chart(ctx).PolarArea(data, {
        scaleShowLine : true,
        angleShowLineOut : true,
        scaleShowLabels : false,
        scaleBeginAtZero : true,
        angleLineColor : "rgba(0,0,0,.1)",
        angleLineWidth : 1,
        pointLabelFontFamily : "'Arial'",
        pointLabelFontStyle : "normal",
        pointLabelFontSize : 10,
        pointLabelFontColor : "#666",
        pointDot : true,
        pointDotRadius : 3,
        pointDotStrokeWidth : 1,
        pointHitDetectionRadius : 20,
        datasetStroke : true,
        datasetStrokeWidth : 2,
        datasetFill : true,
        legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
    });
    
    var pollName = unescape(encodeURIComponent("Vote in my poll! " + $('strong')[0].innerHTML + " " + window.location));
    console.log(pollName);
    $('#btnTwitter').attr('href', "https://twitter.com/intent/tweet?text=" + pollName);
    
    $('#btnSubmitVote').on('click', checkSelected);
    $('#btnSubmit').on('click', checkNewOpt);
});