
var staffManager = new StaffManager();

var staff = new Validator("#formAddStaff");
staffManager.start();
var pwdPage = 1;
showListStaff(staffManager.listStaff);

document.querySelector("#tableDanhSach").addEventListener("click", delegationTable)
document.querySelector("#btnThem").addEventListener("click", function () {
  callModal("Thêm nhân viên", false, 1);
  updateForm();
})
document.querySelector("#btnTimNV").addEventListener("click", findStaffByClassification)
document.querySelector("#searchName").addEventListener("input", findStaffByClassification)

/**
 *
 * @param {Lấy dữ liệu từ form tạo một staff mới}
 */
staff.onSubmit = function (data) {
  updateForm();
  function addStaff(data) {
    var dataStaff = [];
    var count = 0;
    for (var key in data) {
      dataStaff[count] = data[key]
      count++;
    }

    var newStaff = new Staff(...dataStaff);
    staffManager.addStaff(newStaff);
  }
  addStaff(data);
  showListStaff(staffManager.listStaff);
}


/**
 *
 * @param {Xử lý update cập nhật khi sửa account}
 */
function handleUpdate(account) {
  var inputs = document.querySelectorAll("[name][rules]")
  for (var i = 0; i < staffManager.listStaff.length; i++) {
    if (staffManager.listStaff[i].account === account) {
      for (var j = 0; j < inputs.length; j++) {
        if (j === 0)
          staffManager.listStaff[i].account = inputs[j].value;
        if (j === 1)
          staffManager.listStaff[i].fullName = inputs[j].value;
        if (j === 2)
          staffManager.listStaff[i].email = inputs[j].value;
        if (j === 3)
          staffManager.listStaff[i].password = inputs[j].value;
        if (j === 4)
          staffManager.listStaff[i].startingDate = inputs[j].value;
        if (j === 5)
          staffManager.listStaff[i].basicSalary = inputs[j].value;
        if (j === 6)
          staffManager.listStaff[i].position = inputs[j].value;
        if (j === 7)
          staffManager.listStaff[i].workingHours = inputs[j].value;
      }
      staffManager.listStaff[i].calculationOfSalary();
      staffManager.listStaff[i].staffAssessment();
    }
  }
  staffManager.saveLocalStorage();

}

document.querySelector("#ulPhanTrang").addEventListener("click", function (event) {
  if (event.target.id.includes("page")) {
    var id = event.target.id.split("-");
    pwdPage = id[1];
    showListStaff(staffManager.listStaff);
  }
})

/**
 *
 * @param {Hiển thị danh sách ra màn hinh}
 */
function showListStaff(staffManager) {
  var tableDanhSach = document.getElementById("tableDanhSach");
  var ulPagination = document.getElementById("ulPhanTrang");
  ulPagination.innerHTML = '';
  var totalStaff = staffManager.length;
  var row = 4;
  var totalPages = Math.ceil(totalStaff / row);
  var html = "";
  var htmlPagination = "";


  for (var i = 1; i <= totalPages; i++) {
    htmlPagination += `<li class="page-item"><a class="page-link" href="#" id="page-${i}">${i}</a></li>`
  }
  ulPagination.innerHTML = htmlPagination;

  var startPage = (pwdPage - 1) * row
  var endPage = pwdPage * row;
  if (totalStaff < endPage) {
    endPage = totalStaff;
  }

  for (var i = startPage; i < endPage; i++) {
    html += `
    <tr>
    <th>${staffManager[i].account}</th>
    <th>${staffManager[i].fullName}</th>
    <th>${staffManager[i].email}</th>
    <th>${staffManager[i].startingDate}</th>
    <th>${staffManager[i].position}</th>
    <th>${staffManager[i].salary}</th>
    <th>${staffManager[i].classification}</th>
    <th>
    <button class="btn btn-danger" data-action="delete" data-account="${staffManager[i].account}" >Xóa</button>
    <button class="btn btn-warning" data-action="change" data-account="${staffManager[i].account}" data-toggle="modal" data-target="#myModal">Sửa</button>
    </th>
  </tr>
    `
  }
  tableDanhSach.innerHTML = html;
}


/**
 *
 * @param {Bắt sự kiện khi người dùng click vào table}
 */
function delegationTable(event) {
  var account = event.target.getAttribute("data-account");
  var action = event.target.getAttribute("data-action");
  if (action === "change") {
    callModal("Sửa nhân viên", true, 2);
    var staff = staffManager.listStaff.find(function (staff) {
      return staff.account == account;
    })
    updateForm(staff);

    document.querySelector("#btnCapNhat").addEventListener("click", function () {
      handleUpdate(staff.account);
      showListStaff(staffManager.listStaff);
    })
  }

  if (action === "delete") {
    staffManager.removeStaff(account);
    pwdPage = 1;
    showListStaff(staffManager.listStaff);
  }
}


/**
 *
 * @param {Update form}
 */
function updateForm(Staff) {
  var inputs = document.querySelectorAll("[name][rules]")

  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].name !== "ngaylam" && !Staff) {
      inputs[i].value = "";
    }
    if (Staff) {
      inputs[i].value = Staff.arrayProperties[i];
    }
  }
}

/**
 *
 * @param {Xóa thông báo lỗi}
 */
function removeMessage() {
  var listMessage = document.querySelectorAll(".form-message");

  Array.from(listMessage).forEach(function (message) {
    message.innerHTML = ''
  })

}


/**
 *
 * @param {Gọi modal hiển thị theo param}
 */
function callModal(modalTitle, readOnly, type) {
  document.querySelector("#header-title").innerText = modalTitle;
  if (readOnly) {
    document.querySelector("#tknv").setAttribute("disabled", "");
  } else {
    document.querySelector("#tknv").removeAttribute("disabled");
  }
  if (type === 1) {
    updateForm();
    removeMessage();
    document.querySelector("#btnThemNV").style.display = "block";
    document.querySelector("#btnCapNhat").style.display = "none";
  } else {
    removeMessage()
    document.querySelector("#btnThemNV").style.display = "none";
    document.querySelector("#btnCapNhat").style.display = "block";
  }
}


/**
 *
 * @param {Tìm nhân viên theo xếp loại}
 */
function findStaffByClassification() {

  var content = document.querySelector("#searchName").value;
  var listStaffFinded = staffManager.findStaffByClassification(content);

  pwdPage = 1;
  showListStaff(listStaffFinded);

}