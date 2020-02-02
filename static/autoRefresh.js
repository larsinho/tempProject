
function fetchdata() {
    $.ajax({
        url: '/index/add/ajax',
        type: 'post',
        success: function (data) {
            // Perform operation on the return value
            console.log(data)
            tempJS_1 = 'Inside:' + String(data[0]) + ' C';
            tempJS_2 = 'Inside:' + String(data[1]) + ' C';

            document.getElementById('temp1').innerText = tempJS_1;
            document.getElementById('temp2').innerText = tempJS_2;
        }
    });
}

$(document).ready(function () {
    setInterval(fetchdata, 5000);
});