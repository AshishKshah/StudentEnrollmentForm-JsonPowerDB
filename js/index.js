var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var dBName = "SCHOOL-DB";
var relationName = "STUDENT-TABLE";
var connToken = "90931922|-31949300021075139|90960818";

$("#rollNo").focus();

function saveRecNo2LS(jsonObj) {
  var lvData = JSON.parse(jsonObj.data);
  localStorage.setItem("recno", lvData.rec_no);
}

function getPrimaryIdAsJsonObj() {
  var rollNo = $("#rollNo").val();
  var jsonStr = {
    rollNo: rollNo,
  };

  return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
  saveRecNo2LS(jsonObj);
  var record = JSON.parse(jsonObj.data).record;
  $("#stuName").val(record.name);
  $("#classNo").val(record.classNo);
  $("#bDate").val(record.bDate);
  $("#address").val(record.address);
  $("#eDate").val(record.eDate);
}

function resetForm() {
  $("#rollNo").val("");
  $("#stuName").val("");
  $("#classNo").val("");
  $("#bDate").val("");
  $("#address").val("");
  $("#eDate").val("");

  $("#rollNo").prop("disabled", false);
  $("#save").prop("disabled", true);
  $("#change").prop("disabled", true);
  $("#reset").prop("disabled", true);
  $("#rollNo").focus();
}

function validateData() {
  var rollNo, stuName, classNo, bDate, address, eDate;
  rollNo = $("#rollNo").val();
  stuName = $("#stuName").val();
  classNo = $("#classNo").val();
  bDate = $("#bDate").val();
  address = $("#address").val();
  eDate = $("#eDate").val();

  if (rollNo === "") {
    alert("Roll-No missing");
    $("#rollNo").focus();
    return "";
  }

  if (stuName === "") {
    alert("Full-Name missing");
    $("#stuName").focus();
    return "";
  }

  if (classNo === "") {
    alert("Class missing");
    $("#classNo").focus();
  }

  if (bDate === "") {
    alert("Birth-Date missing");
    $("#bDate").focus();
    return "";
  }

  if (address === "") {
    alert("Address missing");
    $("#address").focus();
    return "";
  }

  if (eDate === "") {
    alert("Enrollment-Date missing");
    $("#eDate").focus();
  }

  var jsonStrObj = {
    rollNo: rollNo,
    name: stuName,
    classNo: classNo,
    bDate: bDate,
    address: address,
    eDate: eDate,
  };

  return JSON.stringify(jsonStrObj);
}

function getRoll() {
  var primaryIdJsonObj = getPrimaryIdAsJsonObj();
  var getRequest = createGET_BY_KEYRequest(
    connToken,
    dBName,
    relationName,
    primaryIdJsonObj
  );
  jQuery.ajaxSetup({ async: false });
  var resJsonObj = executeCommandAtGivenBaseUrl(
    getRequest,
    jpdbBaseURL,
    jpdbIRL
  );
  jQuery.ajaxSetup({ async: true });
  if (resJsonObj.status === 400) {
    $("#save").prop("disabled", false);
    $("#reset").prop("disabled", false);
  } else if (resJsonObj.status === 200) {
    $("#rollNo").prop("disabled", true);
    fillData(resJsonObj);

    $("#change").prop("disabled", false);
    $("#reset").prop("disabled", false);
    $("#stuName").focus();
  }
}

function saveData() {
  var jsonStrObj = validateData();
  if (jsonStrObj === "") {
    return "";
  }
  var putRequest = createPUTRequest(
    connToken,
    jsonStrObj,
    dBName,
    relationName
  );
  jQuery.ajaxSetup({ async: false });
  var resJsonObj = executeCommandAtGivenBaseUrl(
    putRequest,
    jpdbBaseURL,
    jpdbIML
  );
  jQuery.ajaxSetup({ async: true });
  resetForm();
  $("#rollNo").focus();
}

function changeData() {
  $("#change").prop("disabled", true);
  jsonChg = validateData();
  var updateRequest = createUPDATERecordRequest(
    connToken,
    jsonChg,
    dBName,
    relationName,
    localStorage.getItem("recno")
  );
  jQuery.ajaxSetup({ async: false });
  var resJsonObj = executeCommandAtGivenBaseUrl(
    updateRequest,
    jpdbBaseURL,
    jpdbIML
  );
  jQuery.ajaxSetup({ async: true });
  console.log(resJsonObj);
  resetForm();
  $("#rollNo").focus();
}
