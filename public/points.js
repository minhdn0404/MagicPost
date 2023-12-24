
$(document).ready(function() {
    // Form post request
    $('#create-point').submit(function(e) {
        e.preventDefault();

        // Form atttributes
        var pointName = $('#pointName').val();
        var pointAddress = $('#pointAddress').val();
        var pointType = $('#pointType').val();
        var url = $(this).attr('action');

        console.log(pointName, " ", pointAddress, " ", pointType, " ", url);

        $.post(url, {
            name: pointName, 
            address: pointAddress, 
            type: pointType})
        .done(function(data) {
            location.reload();
            console.log("Point saved");
            console.log(data);
        })
    })

    // Delete a point
    $('#delete-point').click(function(e) {
        e.preventDefault();

        const endpoint = `/manager/points/${this.dataset.doc}`;
        console.log(endpoint);

        // Fetch API to endpoint
        fetch(endpoint, {
            method: 'DELETE'
        })
        // pass json to data object
        .then((response) => response.json()) 
        // Redirect to /points
        .then((data) => window.location.href = data.redirect)
        .catch((err) => console.log(err));
    })
})
