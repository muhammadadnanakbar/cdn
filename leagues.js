$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});
var id;
$(document).ready(function () {
    var status = 5;
    var line = "";
    //  $("#caregiveractive").addClass("active");
    try
    {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        //var sParameterName = sURLVariables[0].split('=');
    }
    catch
    {
        status =5;
    }

    fill(status);
    $("#myTable").on('click', '.btn', function () {
        try{
            var currentRow = $(this).closest("tr");
            id = currentRow.find("td:eq(0)").text();
        }
        catch(err)
        {

        }
    });
});
function fill(status)
{
    var _token = $("input[name=_token]").val();
    try
    {
        $tab.destroy();
    }
    catch(ex)
    {

    }
    $tab =  $('#myTable').DataTable({
        destroy: true,
        "ordering": true,
        responsive: true,
        processing: false,
        serverSide: true,

        ajax: "getleagues",
        columns: [

            {data: 'id', name: 'id'},
            {data: 'name', name: 'name'},
            {data: 'type', name: 'type'},
            {data: 'country', name: 'country'},
            {
                data: null, orderable: false, searchable: false, render: function (data, type, row) {
                    var pic =  '<img src="' + data.logo + '" alt="Logo" width="35">';
                    return pic;
                }
            },
            {data: 'season', name: 'season'},
            {
                data: null, orderable: false, searchable: false, render: function (data, type, row) {
                    var date = new Date(data.start_date).toDateString();
                    return date;
                }
            },
            {
                data: null, orderable: false, searchable: false, render: function (data, type, row) {
                    var date = new Date(data.end_date).toDateString();
                    return date;
                }
            },
            {data: 'status', name: 'status'},
            {
                data: null, orderable: false, searchable: false, render: function (data, type, row) {
                    var date = new Date(data.created_at).toDateString();
                    return date;
                }
            },
            {
                data: null, orderable: false, searchable: false, render: function (data, type, row) {
                    var date = new Date(data.updated_at).toDateString();
                    return date;
                }
            },
            {
                data: null, orderable: false, searchable: false, render: function (data, type, row) {
                    //var action = '<div class="dropdown"><button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="bx bx-dots-vertical-rounded"></i></button><div class="dropdown-menu"><a class="dropdown-item" onclick="deletes('+data.id+')" href="javascript:void(0);"><i class="bx bx-trash me-1"></i>Delete</a>';
                    var action = '<div class="dropdown"><button type="button" class="btn p-0 dropdown-toggle hide-arrow" data-bs-toggle="dropdown"><i class="bx bx-dots-vertical-rounded"></i></button><div class="dropdown-menu"><a class="dropdown-item" href="edit-league/'+data.lg_id+'"><i class="bx bx-edit-alt me-1"></i> Edit</a><a class="dropdown-item" href="fixture?league_id='+data.lg_id+'"><i class="bx bx-edit-alt me-1"></i> View Fixtures</a><a class="dropdown-item" onclick="deletes('+data.lg_id+')" href="javascript:void(0);"><i class="bx bx-trash me-1"></i>Delete</a>';
                    //action=action+'<a class="dropdown-item" onclick="updatestatus('+0+','+data.id+')" href="javascript:void(0);"><i class="bx bx-user me-1"></i> Blocked</a><a class="dropdown-item" onclick="sendnnotification('+data.id+')" href="javascript:void(0);"><i class="bx bx-user me-1"></i>Notification</a></div></div>';
                    return action;
                }
            },

        ],

    });
}
function sendnnotification(id){
    Swal.fire({
        title: "Notification!",
        html: '<input class="swal2-input"  placeholder="Write something" type="text" style="display: flex;"> <input class="swal2-file" placeholder="Write something" type="file" style="display: flex;">',
        text: "Write Messge Here:",

        type: "input",
        showCancelButton: true,
        closeOnConfirm: false,
        animation: "slide-from-top",

        inputPlaceholder: "Write something",
        onBeforeOpen: () => {
            $(".swal2-file").change(function () {
                var reader = new FileReader();
                reader.readAsDataURL(this.files[0]);
            });
        }
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            if (result.value) {
                var formData = new FormData();
                var file = $('.swal2-file')[0].files[0];

                formData.append("image", file);

                var texts =$('.swal2-input').val();
                formData.append("text", texts);
                formData.append("id", id);
                $.ajax({
                    headers: { 'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content') },
                    method: 'post',
                    url:"/userNotify",
                    data: formData,
                    processData: false,
                    contentType: false,

                    success:function(data){
                        console.log(data);
                        if(data.status===true){

                            Swal.fire({
                                icon: 'success',
                                title: data.res,
                            }).then((result) => {
                                // location.reload();
                            });
                        }
                        else{
                            Swal.fire('Error', data.res, 'error')

                        }
                    },
                    error: function (err) {
                        // jq("#load").hide();
                        alert(err.responseText);
                        Swal.fire('Error', 'Error while processing', 'error')
                    }
                });
            }
        }
        else if (result.isDenied) {
        }
    });
}
//----------------------------------------------------------------------------------------------//
function sendCommNotify(){

    var texts=$('#msg_text').val();
    var id=$('#msg_com_id').val();
    alert(id);

    $('#exLargeModal').modal('hide');
    console.log(new FormData(document.getElementById('comNote')));
    let myform = document.getElementById("myform");

    Swal.fire({
        title: 'Do you want schedule notification?',
        showDenyButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            //jq("#load").show();
        } else if (result.isDenied) {
        }
    });
}

//---------------------------------------------------------------------------------------//

function updatestatus(status,id)
{
    Swal.fire({
        title: 'Do you want update status of  the selected user?',
        showDenyButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            //jq("#load").show();
            $.ajax({
                type:'PUT',
                data:{
                    "_token": $("input[name=_token]").val(),
                    'status' :status,
                    'id':id,
                },
                url:"/updateUserStatus",
                success:function(data){
                    Swal.fire({
                        icon: 'success',
                        title: "Success",
                    }).then((result) => {
                        location.reload();
                    });

                },
                error: function (err) {
                    // jq("#load").hide();
                    alert(err.responseText);
                    Swal.fire('Error', 'Error while processing', 'error')
                }
            });
        } else if (result.isDenied) {
        }
    });
}
function deletes(id)
{
    Swal.fire({
        title: 'Do you want to delete the selected league?',
        showDenyButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            //jq("#load").show();
            $.ajax({
                type:'PUT',
                data:{
                    "_token": $("input[name=_token]").val(),

                    'id':id,
                },
                url:"/DeleteLeague",

                success:function(data){

                    Swal.fire({
                        icon: 'success',
                        title: "Success",
                    }).then((result) => {
                        location.reload();
                    });
                },
                error: function (err) {
                    // jq("#load").hide();
                    alert(err.responseText);
                    Swal.fire('Error', 'Error while processing', 'error')
                }
            });

        } else if (result.isDenied) {
        }
    });
}

function delete_all(id="")
{
    Swal.fire({
        title: 'Do you want to delete all the leagues?',
        showDenyButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            //jq("#load").show();
            $.ajax({
                type:'PUT',
                data:{
                    "_token": $("input[name=_token]").val(),

                    'id':id,
                    'del_all':1,
                },
                url:"/DeleteLeague",

                success:function(data){

                    Swal.fire({
                        icon: 'success',
                        title: "Success",
                    }).then((result) => {
                        location.reload();
                    });
                },
                error: function (err) {
                    // jq("#load").hide();
                    alert(err.responseText);
                    Swal.fire('Error', 'Error while processing', 'error')
                }
            });

        } else if (result.isDenied) {
        }
    });
}
