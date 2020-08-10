/** Niche-Selection-Tool.js **/
var appUserSessionToken = 'e01338cc07b7547d52ed04da2cc047c4665bc409';
niche_endpoint = appEndPoint + 'niche/'

$(document).ready(function () {

    $.ajax({
        url: niche_endpoint,
        type: 'GET',
        dataType: 'json',
        headers: {
            'authorization': 'Token ' + appUserSessionToken
        },
        cache: true,
        contentType: 'application/json; charset=utf-8',
        success: function (result) {
            $.each(result['data'], function (index, value) {
                if (activeNicheID == value['id']) {
                    isActiveNicheID = true;
                    console.log('Active niche.');
                } else {
                    isActiveNicheID = false;
                    console.log('Not active niche.');
                }
                $("#activeNicheSelection").append(new Option(value['name'], value['id']), isActiveNicheID);
                // add niches to the local database
                db.transaction(function (nx) {
                    console.log('Preparing for Log Transactions');
                    nx.executeSql("INSERT INTO niches (id, uuid, name) VALUES (null, value['id'], value['name'])");
                });
            });
            console.log('We got the data.');
        },
        error: function (error) {
            console.log('An Error Occured While Pulling Niches from the API');
        }
    });

});

/** Load the Create Niche Form **/
$(document).on('click', '.createNiche', function(){
    $("#centerLgModal .modal-title").html('Create Niche');
    $("#centerLgModal .modal-body").load("app/components/niche/create.html");
    $("#centerLgModal").modal('show');
    // $('#nicheListTable').DataTable().clear().destroy();
    // loadNicheListTable();
});

/** Load the Create Niche Form **/
$(document).on('click', '.listNiches', function(){
    $("#appTitle").html('Your Niche');
    $("#app-content").load("app/components/niche/list.html", function(){
        // $("#nicheListTable").dataTable().clear().destroy();
        $('#nicheListTable').DataTable({
            "serverSide": true,
            "processing": true,
            "ajax": {
                "url": appEndPoint + "niche/",
                "dataSrc": "data",
            },
            "columns": [
                {"data": "name"},
                {"data": "domain"},
                {
                    "mRender": function (data, type, row) {
                        return '<div class="text-right">' +
                            '<a class="btn btn-success" href="/{% url "niche_edit_view" %}?id=' + row.id + '">Edit</a> ' +
                            '<a class="btn btn-info" href="/?niche_selection=' + row.id + '">Make Active</a> ' +
                            '<button class="btn btn-primary getBrandPlanList" id="" href="" data-niche-id="' + row.id + '">Brand Plans</button>' +
                            '</div>';
                    }
                }
            ]
        });
    });

});

$(document).on('submit', '#createNicheForm', function(e) {

        e.preventDefault(); // avoid to execute the actual submit of the form.

        var form = $(this);
        var url = form.attr('action');

        $.ajax({
            type: "POST",
            url: appEndPoint + "niche/",
            data: form.serialize(), // serializes the form's elements.
            success: function(data)
            {
               Swal.fire('Niche Created', 'Your Niche Was Created Succesfully', 'success');
            }
        });


});




/* Change Active Niche */
$(document).on('change', '#activeNicheSelection', function () {
    setCookie('activeNicheID', this.value, 1);
    $("option[value='" + this.value + "']").attr('selected', 'selected');
    console.log('Active Niche ID: ' + activeNicheID);
});