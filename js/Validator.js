function Validator(formSelector) {
  var formRules = {};

  _this = this;

  var validatorRules = {
    required: function (value) {
      return value ? undefined : "Vui lòng nhập vào trường này";
    },
    account: function (value) {
      // Giả đò đây là API danh sách tên account :))))
      var listStaff = JSON.parse(localStorage.getItem("listStaff"))
      var listAccount = listStaff.map(function (staff) {
        return staff.account;
      })

      var isNewName = true;
      listAccount.forEach((account) => {
        if (value === account) {
          isNewName = false;
        }

      })
      return (isNewName) ? undefined : "Tài khoản này đã tồn tại trên hệ thống";
    }
    ,
    digitalSignature: function (value) {
      var validation =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[0-9a-zA-Z!@#$%^&*(),.?":{}|<>]{4,}$/
      return validation.test(value) ? undefined : "Vui lòng nhập mật khẩu hợp lệ";
    }

    ,
    stringVN: function (value) {
      var validation = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/
        ;

      return validation.test(value) ? undefined : 'Vui lòng nhập tên hợp lệ'
    },
    email: function (value) {
      var emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
      return emailPattern.test(value) ? undefined : 'Vui lòng nhập email hợp lệ';
    },
    min: function (min) {
      return function (value) {
        return value.length >= +min ? undefined : `Vui lòng nhập tối thiểu ${min} ký tự`;
      }
    },
    max: function (max) {
      return function (value) {
        return value.length <= +max ? undefined : `Vui lòng nhập tối đa ${max} ký tự`;
      }
    },
    minValue: function (min) {
      return function (value) {
        return +value >= +min ? undefined : `Vui lòng nhập giá trị tối thiểu là ${min}`
      }
    },
    maxValue: function (max) {
      return function (value) {
        return +value <= +max ? undefined : `Vui lòng nhập giá trị tối đa là ${max}`
      }
    }
    ,
    date: function (value) {

      var date = value.split("/");
      var month = +date[0];
      var day = +date[1];
      var year = +date[2];
      var isDate = false;
      if (year >= 1582) {
        switch (month) {
          case 1:
          case 3:
          case 5:
          case 7:
          case 8:
          case 10:
          case 12:
            if (day <= 31 && day >= 1) {
              isDate = true;
            }
            break;
          case 4:
          case 6:
          case 9:
          case 11:
            if (day <= 30 && day >= 1) {
              isDate = true;
            }
            break;
          case 2:
            if (year % 400 === 0 ||
              (year % 4 === 0 && year % 100 !== 0)) {
              if (day <= 28 && day >= 1) {
                isDate = true;
              }
            } else {
              if (day <= 29 && day >= 1) {
                isDate = true;
              }
            }
            break;
          default:
            isDate: false;
            break;
        }
      } else {
        isDate = false;
      }

      return isDate ? undefined : "Vui lòng nhập ngày hợp lệ";
    },
    number: function (value) {
      return !isNaN(value) ? undefined : "Vui lòng nhập vào số"
    },
    password: function (value) {
      var validation =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[0-9a-zA-Z!@#$%^&*(),.?":{}|<>]{4,}$/
      return validation.test(value) ? undefined : "Vui lòng nhập mật khẩu hợp lệ";
    },
  }


  var formElement = document.querySelector(formSelector);

  if (formElement) {

    var inputs = formElement.querySelectorAll("[name][rules]")

    for (var input of inputs) {
      var rules = input.getAttribute("rules").split("|");

      for (var rule of rules) {
        var ruleInfo;
        var isRuleHasValue = rule.includes(":");

        if (isRuleHasValue) {
          ruleInfo = rule.split(":");
          rule = ruleInfo[0];
        }

        var ruleFunc = validatorRules[rule];
        if (isRuleHasValue) {
          ruleFunc = ruleFunc(ruleInfo[1]);
        }

        if (Array.isArray(formRules[input.name])) {
          formRules[input.name].push(ruleFunc);
        } else {
          formRules[input.name] = [ruleFunc];
        }


      }

      input.onblur = handleValidate;
      input.oninput = handleClearError;
    }


  }


  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }

  function handleValidate(event) {

    var rules = formRules[event.target.name];
    var errorMessage;
    for (var rule of rules) {
      errorMessage = rule(event.target.value);
      if (errorMessage) break;
    }

    if (errorMessage) {
      var formGroup = getParent(event.target, ".form-group");
      if (formGroup) {
        var formMessage = formGroup.querySelector(".form-message");
        if (formMessage) {
          formMessage.innerText = errorMessage;
        }
      }

    }
    return !errorMessage;

  }

  function handleClearError(event) {
    var formGroup = getParent(event.target, ".form-group");
    var formMessage = formGroup.querySelector(".form-message");

    formMessage.innerText = "";

  }

  formElement.onsubmit = function (event) {
    event.preventDefault();

    var input = formElement.querySelectorAll("[name][rules]");

    var isValid = true;

    for (var input of inputs) {
      if (!handleValidate({ target: input })) {
        isValid = false;
      }
    }

    if (isValid) {
      if (typeof _this.onSubmit === "function") {

        var enableInputs = formElement.querySelectorAll("[name]");

        var formValues = Array.from(enableInputs).reduce(function (values, input) {
          switch (input.type) {
            case 'radio':
              values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
              break;
            case 'checkbox':
              if (!input.matches('checked')) {
                values[input.name] = '';
                return values;
              }
              if (!Array.isArray(values[input.name])) {
                values[values[input.name]] = [];
              }
              values[values[input.name]].push()
              break;
            case 'file':
              values[input.name] = input.files;
              break;
            default:
              values[input.name] = input.value
          }
          return values;
        }, {});
        _this.onSubmit(formValues)
      } else {
        formElement.submit();
      }
    }

  }

}