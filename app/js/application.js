const appVersion = '1.0.0';
// const appEndPoint = 'http://localhost:8000/api/v1/'; // https://api.nicheincomeguide.com/api/v1/';
const appEndPoint = 'https://api.nicheincomeguide.com/api/v1/';
/** Cookie Crisp - Set and Get Cookie Data **/
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// set cookie
setCookie('appUserSessionToken', 'e01338cc07b7547d52ed04da2cc047c4665bc409', 3)
// GET SESSION DETAILS
var appUserSessionToken = 'e01338cc07b7547d52ed04da2cc047c4665bc409'; // getCookie('appUserSessionToken');
// WEBSQL START DB
var db = openDatabase('nigdb4', '1.0', 'Niche Income Guide', 2 * 1024 * 1024);
// CREATE TABLES NEEDED FOR APPLICATION CACHING
db.transaction(function (tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS niches (id integer primary key autoincrement, uuid VARCHAR(35), name VARCHAR(50))");
});

/* loading */
// var $loading = $('.se-pre-con').hide();
// $(document).ajaxStart(function () { $loading.show(); }).ajaxStop(function () { $loading.hide(); });


/** Niche-Selection-Tool.js **/
$(document).ready(function () {
    console.log('Document is Ready');

    $.ajaxSetup({
        headers: {
            'authorization': "Token " + appUserSessionToken
        }
    });

    activeNicheID = getCookie('activeNicheID');
    console.log('activeNicheID');


    /* Brand Plan Table */
    $(document).on('click', '.updateBrandPlan', function () {

        $('#brandPlanListTable').DataTable({
            destroy: true,
            "serverSide": true,
            "processing": true,
            "ajax": {
                "url": appEndPoint + "brandplan/",
                "dataSrc": "data",
                "data": {"niche__id": $(this).attr('data-niche-id')}
            },
            "columns": [
                {"data": "category"},
                {"data": "estimated_post"},
                {
                    "mRender": function (data, type, row) {
                        return '<a class="btn btn-success" href="/brandplan/edit/?id=' + row.id + '">Edit</a> ' +
                            '<a class="btn btn-dark showIdeationsBTN" data-brandplan-id="' + row.id + '">Ideations</a>';

                    }
                }
            ]
        })
    });


    /** get ideations from selected active brand plan */
    $(document).on('click', '.showIdeationsBTN', function () {

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
                                '<a class="btn  btn-info" href="/ideation/analyze/' + row.id + '/">Analyze</a> ' +
                                '<a class="btn   btn-primary" href="#">Brand Plan</a>' +
                                '</div>' +
                                '</div>';
                        }
                    }
                ]
            })
        });



});

