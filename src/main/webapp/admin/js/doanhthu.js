var token = localStorage.getItem("token");
async function revenueYear(nam) {
    if (nam < 2000) {
        nam = new Date().getFullYear()
    }
    var url = 'http://localhost:8080/api/statistic/admin/revenue-year?year=' + nam;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var list = await response.json();
    console.log(list);
    var main = '';
    for (i = 0; i < list.length; i++) {
        if (list[i] == null) {
            list[i] = 0
        }
    }


    var lb = 'doanh thu năm ' + nam;
    if (window.myChart) {
            window.myChart.destroy();
        }

    const ctx = document.getElementById("chart").getContext('2d');
    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["tháng 1", "tháng 2", "tháng 3", "tháng 4",
                "tháng 5", "tháng 6", "tháng 7", "tháng 8", "tháng 9", "tháng 10", "tháng 11", "tháng 12"
            ],
            datasets: [{
                label: lb,
                backgroundColor: 'rgba(161, 198, 247, 1)',
                borderColor: 'rgb(47, 128, 237)',
                data: list,
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        callback: function(value) {
                            return formatmoney(value);
                        }
                    }
                }]
            }
        },
    });
}

function loadByNam() {
    var nam = document.getElementById("nams").value;
    revenueYear(nam);
}

async function revenueByDateRange() {
    let fromDate = document.getElementById("fromDate").value;
    let toDate = document.getElementById("toDate").value;

    if (!fromDate || !toDate) {
        alert("Vui lòng chọn khoảng ngày hợp lệ!");
        return;
    }

    let url = `http://localhost:8080/api/statistic/admin/revenue-range?fromDate=${fromDate}&toDate=${toDate}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    let list = await response.json();

    console.log(list);

    let labelDays = [];
    let tempDate = new Date(fromDate);
    let endDate = new Date(toDate);

    while (tempDate <= endDate) {
        labelDays.push(tempDate.toISOString().split("T")[0]);
        tempDate.setDate(tempDate.getDate() + 1);
    }

    if (window.myChart) {
        window.myChart.destroy();
    }

    const ctx = document.getElementById("chart").getContext('2d');
    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labelDays,
            datasets: [{
                label: `Doanh thu từ ${fromDate} đến ${toDate}`,
                backgroundColor: 'rgba(161, 198, 247, 1)',
                borderColor: 'rgb(47, 128, 237)',

                borderWidth: 1,
                data: list,
            }]
        },
        options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                callback: function(value) {
                                    return formatmoney(value);
                                }
                            }
                        }]
                    }
                },
    });
}

const VND = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
});

function formatmoney(money) {
    return VND.format(money);
}

async function loadLichSuNap() {
    $('#example').DataTable().destroy();
    var start = document.getElementById("start").value
    var end = document.getElementById("end").value
    var url = 'http://localhost:8080/api/admin/all-history-pay';
    if (start != "" && end != "") {
        url = 'http://localhost:8080/api/admin/all-history-pay?start=' + start + '&end=' + end;
    }
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var list = await response.json();
    var main = '';
    for (i = 0; i < list.length; i++) {
        main += `<tr>
                    <td>${list[i].createdTime}<br>${list[i].createdDate}</td>
                    <td>${list[i].orderId}</td>
                    <td>MOMO</td>
                    <td>${list[i].orderId}</td>
                    <td>${list[i].totalAmount}</td>
                    <td>Đã nhận</td>
                    <td>${list[i].user.username}</td>
                </tr>`
    }
    document.getElementById("listichsu").innerHTML = main
    $('#example').DataTable();
}
async function loadProductStock() {
    var url = 'http://localhost:8080/api/statistic/admin/product-stock';
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
            'Authorization': 'Bearer ' + token
        })
    });
    var list = await response.json();
    var main = '';
    for (var i = 0; i < list.length; i++) {
        main += `<tr>
                    <td>${list[i].productCode}</td>
                    <td>${list[i].productName}</td>
                    <td>${list[i].category}</td>
                    <td>${list[i].stockQuantity}</td>
                </tr>`;
    }
    document.getElementById("stockList").innerHTML = main;
    $('#stockTable').DataTable();
}
window.onload = function() {
    revenueYear(new Date().getFullYear());
    loadProductStock();
}