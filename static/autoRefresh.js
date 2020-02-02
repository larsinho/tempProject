
setInterval(                               //Periodically 
    function()
    {
        $.get('output.txt', function(data) {
            console.log(data)
         }, 'text');
    },
    500);                                    // And do it every 500ms