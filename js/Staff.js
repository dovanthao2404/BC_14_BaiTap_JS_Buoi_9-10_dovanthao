function Staff(account, fullName, email, password, startingDate, basicSalary, position, workingHours, totalSalary, classification
) {
  this.account = account,
    this.fullName = fullName,
    this.email = email,
    this.password = password,
    this.startingDate = startingDate,
    this.basicSalary = basicSalary,
    this.position = position,
    this.workingHours = workingHours,
    this.classification = classification,
    this.salary,
    this.arrayProperties = [this.account, this.fullName, this.email, this.password, this.startingDate, this.basicSalary, this.position, this.workingHours, this.classification]
}

Staff.prototype.staffAssessment = function () {
  var excellent = "Xuất sắc";
  var veryGood = "Giỏi";
  var good = "Khá";
  var ordinary = "Trung bình"
  if (this.workingHours >= 192) {
    this.classification = excellent;
  } else if (this.workingHours >= 176) {
    this.classification = veryGood;
  } else if (this.workingHours >= 160) {
    this.classification = good;
  } else {
    this.classification = ordinary;
  }
}

Staff.prototype.calculationOfSalary = function () {
  var boss = "Sếp";
  var headOfDepartment = "Trưởng phòng";
  var regularStaff = "Nhân viên";

  if (this.position === boss) {
    this.salary = this.basicSalary * 3;
  } else if (this.position === headOfDepartment) {
    this.salary = this.basicSalary * 2;
  } else {
    this.salary = this.basicSalary;
  }
}
