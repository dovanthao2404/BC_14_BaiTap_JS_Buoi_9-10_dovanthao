
function StaffManager() {
  this.listStaff =
    JSON.parse(localStorage.getItem("listStaff")) || [];
}

StaffManager.prototype.start = function () {
  if (this.listStaff === []) return;

  this.listStaff = this.listStaff.map(function (staff) {
    return new Staff(
      staff.account,
      staff.fullName,
      staff.email,
      staff.password,
      staff.startingDate,
      staff.basicSalary,
      staff.position,
      staff.workingHours,
      staff.totalSalary,
      staff.classification
    )
  })
  this.calculationOfSalary();
}


StaffManager.prototype.saveLocalStorage = function () {
  localStorage.setItem("listStaff", JSON.stringify(this.listStaff));
}


StaffManager.prototype.addStaff = function (staff) {
  staff.calculationOfSalary();
  staff.staffAssessment();
  this.listStaff.push(staff);
  this.saveLocalStorage();
}

StaffManager.prototype.removeStaff = function (account) {
  this.listStaff = this.listStaff.filter(function (staff) {
    return staff.account !== account;
  })
  this.saveLocalStorage();
}

StaffManager.prototype.calculationOfSalary = function () {
  for (var staff of this.listStaff) {
    staff.calculationOfSalary();
  }
}

StaffManager.prototype.staffAssessment = function () {
  for (var staff of this.listStaff) {
    staff.staffAssessment();
  }
}

StaffManager.prototype.findStaffByClassification = function (classification) {
  var staffTemp = this.listStaff.filter(function (staff, index) {
    classification = classification.trim().toLowerCase();
    var classificaitonStaff = staff.classification.toLowerCase().trim();
    return classificaitonStaff.includes(classification);
  })
  return staffTemp;
}