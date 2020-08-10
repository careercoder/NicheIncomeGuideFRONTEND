/* we need a way to translate the query to get it's similar items */
function getSimiliarID(query_id){

    var similiarID = '';

    $.ajax({
        url: appEndPoint + "analytics/",
        context: document.body
    }).done(function() {
        $( this ).addClass( "done" );
    });

    return similiarID;
}


/** get ideations from selected active brand plan */
$(document).on('click', '.getIdeations', function () {
    $("#appTitle").html('Brand Plans');
    bpid = $(this).attr('data-niche-id')
    $("#app-content").load("app/components/ideation/list.html", function () {

        $('#ideationListTable').DataTable({
            /* */
            destroy: true,
            dom: 'Bfrtip',
            buttons: [
                'copy', 'csv', 'excel', 'pdf', 'print'
            ],
            "serverSide": true,
            "processing": true,
            "ajax": {
                "url": appEndPoint + "ideation/",
                "dataSrc": "data",
                "data": {"brand_plan__id": $(this).attr('data-brandplan-id')},
            },
            "columns": [{
                "data": "query.query"
            },
                {
                    "data": "brand_plan.category"
                },
                {
                    "data": "brand_plan.niche.name"
                },
                {
                    "mRender": function (data, type, row) {
                        return '<div class="text-right">' +
                            '<div class="btn-group btn-group-sm" role="group" aria-label="Basic example">' +
                            '<a class="btn btn-success" href="{% url "niche_edit_view" %}?id=' + row.id + '"><i class="fa fa-pencil" aria-hidden="true"></i></a> ' +
                            '<a class="btn  btn-info getIdeationAnalysis" href="#" data-ideation-id="' + row.id + '" data-query-id="' + row.query.id + '" >Analyze</a> ' +
                            '<a class="btn   btn-primary" href="#">Brand Plan</a>' +
                            '</div>' +
                            '</div>';
                    }
                }
            ]
        })

    });
});

$(document).on('click', '.getIdeationAnalysis', function () {


    $("#appTitle").html('Ideation Analysis');
    let idid = $(this).attr('data-ideation-id');
    let qid = $(this).attr('data-query-id');

    $('#similarSearchListTable').DataTable().clear().destroy();

    $("#app-content").load("app/components/ideation/analyze-intent.html", function () {

        $('#similarSearchListTable').DataTable({
            destroy: true,
            "serverSide": true,
            "oSearch": false,
            "processing": true,
            "searching": false,
            "paging":   false,
            "ordering": false,
            "info":     false,
            "ajax": {
                "url": appEndPoint + "analytics/similarsearch/933168b7-2927-4f7b-bc1c-419c84de352a/",
                "dataSrc": "data.related",
                "data": {"query__id": qid},
            },
            "columns": [
                {"data": "query"},
                {
                    "mRender": function (data, type, row) {
                        return '<a class="btn btn-success" href="/brandplan/edit/?id=' + row.id + '">Edit</a> ' +
                            '<a class="btn btn-dark showIdeationsBTN getIdeations" data-brandplan-id="' + row.id + '">Ideations</a>';

                    }
                }
            ]
        });
        /* rankin */
        $('#rankingListTable').DataTable({
            /* */
            dom: 'Bfrtip',
            buttons: [
                'copy', 'csv', 'excel', 'pdf', 'print',
                {
                    extend: "print",
                    customize: function(win)
                    {
                        var last = null;
                        var current = null;
                        var bod = [];

                        var css = '@page { size: landscape; }',
                            head = win.document.head || win.document.getElementsByTagName('head')[0],
                            style = win.document.createElement('style');

                        style.type = 'text/css';
                        style.media = 'print';

                        if (style.styleSheet)
                        {
                            style.styleSheet.cssText = css;
                        }
                        else
                        {
                            style.appendChild(win.document.createTextNode(css));
                        }

                        head.appendChild(style);
                    }
                },
            ],
            "serverSide": true,
            "processing": true,
            "ajax": {
                "url": appEndPoint + "serp/",
                "dataSrc": "data",
                "data": {"query__id": qid }
            },
            "columns": [{
                "mRender": function(data, type, row) {
                    return '<a target="_blank" rel="nofollow noreferer" href="' + row.page.full_link + '" title="' + row.page.full_link + '">' + row.page.title + '</a>'

                }
            },
                {
                    "data": "page.domain.domain"
                },
                {
                    "data": "position"
                },
                {
                    "data": "page.word_count"
                },


                {
                    "mRender": function(data, type, row) {
                        return '<div class="text-right">' +
                            '<div class="btn-group btn-group-sm" role="group" aria-label="Basic example">' +
                            '<a class="btn  btn-info" href="/ideation/analyze/' + row.id + '/">Analyze</a> ' +
                            '</div>' +
                            '</div>';
                    }
                }
            ]
        });


    });





});
