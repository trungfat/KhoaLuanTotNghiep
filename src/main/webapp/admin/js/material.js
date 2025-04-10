async function loadResult() {
    var url = 'http://localhost:8080/api/material/public/all';
    const response = await fetch(url, {
    });
    var list = await response.json();

    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<tr>
                    <td>${list[i].id}</td>
                    <td>${list[i].name}</td>
                    <td class="sticky-col">
                        <i onclick="deleteResult(${list[i].id})" class="fa fa-trash-alt iconaction"></i>
                        <a href="#" data-bs-toggle="modal" data-bs-target="#addtk" onclick="loadAResult(${list[i].id})"><i class="fa fa-edit iconaction"></i></a>
                    </td>
                </tr>`
    }
    document.getElementById("listresult").innerHTML = main
}

function clearData(){
    document.getElementById("idres").value = ""
    document.getElementById("name").value = ""
}


async function loadAResult(id) {
    const response = await fetch('http://localhost:8080/api/material/public/findById?id=' + id, {
    });
    var result = await response.json();
    document.getElementById("idres").value = result.id
    document.getElementById("name").value = result.name
}


async function saveResult() {
    var payload = {
        "id": document.getElementById("idres").value,
        "name": document.getElementById("name").value,
    }
    const response = await fetch('http://localhost:8080/api/material/admin/create', {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(payload)
    });
    if (response.status < 300) {
        toastr.success("Thành công");
        loadResult();
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}

async function deleteResult(id) {
    var con = confirm("Bạn chắc chắn muốn xóa item này?");
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/material/admin/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("xóa thành công!");
        loadResult();
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}