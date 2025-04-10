var token = localStorage.getItem("token");
async function loadAllProductSelect(add) {
    var url = 'http://localhost:8080/api/product/public/findAll-list';
    const response = await fetch(url, {
        method: 'GET'
    });
    var list = await response.json();
    var main = '<option selected disabled>Chọn sản phẩm</option>';
    if (add == false) {
        main = '<option selected value="-1">Tất cả sản phẩm</option>'
    }
    for (i = 0; i < list.length; i++) {
        main += `<option value="${list[i].id}">${list[i].name}</option>`
    }
    document.getElementById("sanpham").innerHTML = main
    const ser = $("#sanpham");
    ser.select2({
        placeholder: "Chọn sản phẩm",
    });
}

async function loadColor(idpro) {
    var url = 'http://localhost:8080/api/product/admin/findById?id=' + idpro;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var result = await response.json();
    document.getElementById("gianhap").value = result.price
    var list = result.productColors;
    var main = '<option selected disabled>Chọn màu sắc</option>';
    for (i = 0; i < list.length; i++) {
        main += `<option value="${list[i].id}">${list[i].colorName}</option>`
    }
    document.getElementById("colors").innerHTML = main
    const ser = $("#colors");
    ser.select2({});
    document.getElementById("colors").onchange = function() {
        var idColor = document.getElementById("colors").value;
        for (i = 0; i < list.length; i++) {
            if (list[i].id == idColor) {
                var listSize = list[i].productSizes;
                var main = '';
                for (j = 0; j < listSize.length; j++) {
                    main += `<option value="${listSize[j].id}">${listSize[j].sizeName}</option>`
                }
                document.getElementById("sizes").innerHTML = main
                const ser = $("#sizes");
                ser.select2({});
                break;
            }
        }
    }
}


async function loadImportP(page, idproduct, from, to) {
    var size = 5;
    var url = 'http://localhost:8080/api/import-product/admin/findAll?page=' + page + '&size=' + size;
    if (idproduct != null) {
        url = 'http://localhost:8080/api/import-product/admin/findByProductAndDate?page=' + page + '&size=' + size + '&idproduct=' + idproduct;
        if (from != null && to != null && from != "" && to != "") {
            url += '&from=' + from + '&to=' + to;
        }
    }
    if (idproduct == null) {
        if (from != null && to != null && from != 'null' && to != 'null') {
            url = 'http://localhost:8080/api/import-product/admin/findByProductAndDate?page=' + page + '&size=' + size + '&from=' + from + '&to=' + to;;
        }
    }
    console.log(url)
    const response = await fetch(url, {
        method: 'GET'
    });
    var result = await response.json();
    console.log(result)
    var list = result.content;
    var totalPage = result.totalPages;

    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<tr>
                    <td>${list[i].id}</td>
                    <td>
                        Sản phẩm: <span class="bold">${list[i].productName}</span><br>
                        Màu sắc: <span class="bold">${list[i].colorName}</span><br>
                        Size: ${list[i].productSize.sizeName}
                    </td>
                    <td>${list[i].quantity}</td>
                    <td>${list[i].importPrice}</td>
                    <td>${list[i].importTime}<br>${list[i].importDate}</td>
                    <td>${list[i].description}</td>
                    <td class="sticky-col" style="text-align: center;vertical-align: middle;">
                        <i onclick="deleteImport(${list[i].id})" class="fa fa-trash-alt iconaction"></i>
                    </td>
                </tr>`
    }
    document.getElementById("listImport").innerHTML = main
    var mainpage = ''
    for (i = 1; i <= totalPage; i++) {
        mainpage += `<li onclick="loadImportP(${(Number(i) - 1)},${idproduct},'${from}','${to}')" class="page-item"><a class="page-link" href="#listsp">${i}</a></li>`
    }
    document.getElementById("pageable").innerHTML = mainpage
}

function filterImportProduct() {
    // idproduct,
    // from,
    // to;
    var idproduct = document.getElementById("sanpham").value;
    var from = document.getElementById("start").value;
    var to = document.getElementById("end").value;
    if (idproduct == -1) {
        idproduct = null
    }
    if (from == "" || to == "") {
        from = null;
        to = null;
    }
    loadImportP(0, idproduct, from, to);
}

async function saveImportPro() {
    var uls = new URL(document.URL)
    var id = uls.searchParams.get("id");
    var sizes = document.getElementById("sizes").value
    var soluong = document.getElementById("soluong").value
    var gianhap = document.getElementById("gianhap").value
    var description = tinyMCE.get('editor').getContent()
    if (sizes == null) {
        alert("hãy chọn kích thước sản phẩm");
    }
    var url = 'http://localhost:8080/api/import-product/admin/create';
    if (id != null) {
        url = 'http://localhost:8080/api/import-product/admin/update';
    }
    importPro = {
        "id": id,
        "quantity": soluong,
        "importPrice": gianhap,
        "description": description,
        "productSize": {
            "id": sizes
        }
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(importPro)
    });
    if (response.status < 300) {
        swal({
                title: "Thông báo",
                text: "thêm/sửa đơn nhập thành công!",
                type: "success"
            },
            function() {
                window.location.href = 'importproduct'
            });
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}

async function deleteImport(id) {
    var con = confirm("Bạn chắc chắn muốn xóa đơn hàng này?");
    if (con == false) {
        return;
    }
    var url = 'http://localhost:8080/api/import-product/admin/delete?id=' + id;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    if (response.status < 300) {
        toastr.success("xóa đơn thành công!");
        await new Promise(r => setTimeout(r, 1000));
        window.location.reload();
    }
    if (response.status == exceptionCode) {
        var result = await response.json()
        toastr.warning(result.defaultMessage);
    }
}