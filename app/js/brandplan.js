/* Brand Plan Table */
$(document).on('click', '.getBrandPlanList', function () {
    $("#appTitle").html('Brand Plans');
    nid = $(this).attr('data-niche-id');
    $("#app-content").load("app/components/brandplan/list.html", function () {
        $('#brandPlanListTable').DataTable({
            destroy: true,
            "serverSide": true,
            "processing": true,
            "ajax": {
                "url": appEndPoint + "brandplan/",
                "dataSrc": "data",
                "data": {"niche__id": nid}
            },
            "columns": [
                {"data": "category"},
                {"data": "estimated_post"},
                {
                    "mRender": function (data, type, row) {
                        return '<a class="btn btn-success" href="/brandplan/edit/?id=' + row.id + '">Edit</a> ' +
                            '<a class="btn btn-dark showIdeationsBTN getIdeations" data-brandplan-id="' + row.id + '">Ideations</a>';

                    }
                }
            ]
        });
    });

});


/** Load the Create Brand Plan Form **/
$(document).on('click', '.createBrandPlan', function () {
    $("#centerLgModal .modal-title").html('Create Brand Plan');
    $("#centerLgModal .modal-body").load("app/components/brandplan/create.html");
    $("#centerLgModal").modal('show');
});

$(document).on('submit', '#createBrandPlanForm', function (e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.
    var form = $(this);
    var data = $(this).serializeArray(); // convert form to array
    data.push({name: "niche_id", value: activeNicheID});
    $.ajax({
        type: "POST",
        url: appEndPoint + "brandplan/",
            data: $.param(data),
        success: function (data) {
            Swal.fire('Brand Plan Created', 'Your Brand Plan Was Added', 'success');
        }
    });
});



