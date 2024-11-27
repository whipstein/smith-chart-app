//code to save the state to jsonBin - cool! (and free)
var toastElList = [].slice.call(document.querySelectorAll('.toast'))
var toastList = toastElList.map(function (toastEl) {
  return new bootstrap.Toast(toastEl)
})
var saveLocDom = document.getElementById('jsonBinSaveLoc')
function saveToJsonBin() {
  var req = new XMLHttpRequest();
  req.onreadystatechange = () => {
    if (req.readyState == XMLHttpRequest.DONE) {
      const objBin = JSON.parse(req.responseText);
      console.log(req.responseText, objBin);
      saveLocDom.innerHTML = (`https://www.will-kelsey.com/smith_chart?jsonBin=${objBin.metadata.id}`)
      saveLocDom.setAttribute('href', `https://www.will-kelsey.com/smith_chart?jsonBin=${objBin.metadata.id}`);
      toastList[0].show()
    }
  };
  req.open("POST", "https://api.jsonbin.io/v3/b", true);
  req.setRequestHeader("Content-Type", "application/json");
  req.setRequestHeader("X-Access-Key", "$2b$10$g4l2/VPaJA6ycDnnpbJYHuv6IHi.zrVwO/xLOiiYByrJ9Vcecqhqq");
  req.send(JSON.stringify(schematic));
}
function readFromJsonBin(id) {
  var req = new XMLHttpRequest();
  req.onreadystatechange = () => {
    if (req.readyState == XMLHttpRequest.DONE) {
      const objBin = JSON.parse(req.responseText);
      console.log(req.responseText, objBin);
      schematic = objBin.record;
      updateFromOldState();
    }
  };
  req.open("GET", `https://api.jsonbin.io/v3/b/${id}/latest`, true);
  req.setRequestHeader("X-Access-Key", "$2b$10$g4l2/VPaJA6ycDnnpbJYHuv6IHi.zrVwO/xLOiiYByrJ9Vcecqhqq");
  req.send();
}

function expo(x, f) {
  return Number.parseFloat(x).toExponential(f);
}

function freqUnitToText(multiplier) {
  if (multiplier == 1) return 'Hz';
  else if (multiplier == 1e3) return 'KHz';
  else if (multiplier == 1e6) return 'MHz';
  else if (multiplier == 1e9) return 'GHz';
  else if (multiplier == 1e12) return 'THz';
  else return 'Hz'
}

fileDom = document.getElementById('file');
domImpSel = document.getElementById('imp_sel');
domFreq = document.getElementById('freq');
domFreqSel = document.getElementById('freq_sel');
domSpanSel = document.getElementById('span_sel');
domSpan = document.getElementById('span');
domZo = document.getElementById('zo');
domEr = document.getElementById('er');

function readFile() {
  var files = fileDom.files;
  var file = files[0];
  var reader = new FileReader();
  var i;
  reader.onload = function (event) {

    schematic = JSON.parse(event.target.result);
    console.log("READING", schematic);
    updateFromOldState()
  }
  reader.readAsText(file);
}

function updateFromOldState() {
  //check for old version of file
  for (i = 1; i < schematic.length; i++) {
    if (!(Array.isArray(schematic[i].abs))) {
      schematic[i].abs = [schematic[i].abs];
    }
    if ('abs_bb_i' in schematic[i]) schematic[i].abs.push(schematic[i].abs_bb_i);
    if (!(Array.isArray(schematic[i].unit))) {
      schematic[i].unit = [schematic[i].unit];
    }
  }

  //update freq units
  var opts = domFreqSel.options;
  for (var opt, j = 0; opt = opts[j]; j++) {
    if (opt.value == freqUnitToText(schematic[0].freq_unit.multiplier)) {
      domFreqSel.selectedIndex = j;
      break;
    }
  }
  opts = domSpanSel.options;
  for (opt, j = 0; opt = opts[j]; j++) {
    if (opt.value == freqUnitToText(schematic[0].span_unit.multiplier)) {
      domSpanSel.selectedIndex = j;
      break;
    }
  }

  domImp.value = Number(schematic[0].imp);
  domFreq.value = Number(schematic[0].freq);
  domSpan.value = Number(schematic[0].span);
  domEr.value = Number(schematic[0].er);
  zo = Number(schematic[0].zo);
  domZo.value = zo;
  updateFromDom();
}


function updateFromDom() {
  schematic[0].freq = Number(domFreq.value);
  schematic[0].span = Number(domSpan.value)
  zo = Number(domZo.value);
  schematic[0].zo = Number(domZo.value);
  schematic[0].er = Number(domEr.value);

  //dropdowns
  if (domImpSel.value == 'diff') {
    schematic[0].imp = "diff";
    schematic[1].abs = [schematic[1].abs[0] * 2, schematic[1].abs[1] * 2];
  } else if (domImpSel.value == 'se') {
    schematic[0].imp = "se";
    schematic[1].abs = [schematic[1].abs[0] / 2, schematic[1].abs[1] / 2];
  }

  update_schem_component(0, true, 1);
  if (domFreqSel.value == 'Hz') schematic[0]['freq_unit'].multiplier = 1;
  else if (domFreqSel.value == 'KHz') schematic[0]['freq_unit'].multiplier = 1e3;
  else if (domFreqSel.value == 'MHz') schematic[0]['freq_unit'].multiplier = 1e6;
  else if (domFreqSel.value == 'GHz') schematic[0]['freq_unit'].multiplier = 1e9;
  else if (domFreqSel.value == 'THz') schematic[0]['freq_unit'].multiplier = 1e12;

  if (domSpanSel.value == 'Hz') schematic[0]['span_unit'].multiplier = 1;
  else if (domSpanSel.value == 'KHz') schematic[0]['span_unit'].multiplier = 1e3;
  else if (domSpanSel.value == 'MHz') schematic[0]['span_unit'].multiplier = 1e6;
  else if (domSpanSel.value == 'GHz') schematic[0]['span_unit'].multiplier = 1e9;
  else if (domSpanSel.value == 'THz') schematic[0]['span_unit'].multiplier = 1e12;

  update_smith_chart()
}

function updatespan(sch_num, obj, unitIndex = 0) {
  // if ((this_val[this_val.length-2]+this_val[this_val.length-1])=='Hz') {
  // 	if      (this_val == 'Hz') freq_multiplier = 1;
  // 	else if (this_val == 'KHz') freq_multiplier = 1e3;
  // 	else if (this_val == 'MHz') freq_multiplier = 1e6;
  // 	else if (this_val == 'GHz') freq_multiplier = 1e9;
  // 	else if (this_val == 'THz') freq_multiplier = 1e12;		
  //   schematic[0][element].unit=this_val;
  //   schematic[0][element].multiplier=freq_multiplier;
  // } else {
  // var sch_num = this_id.split('_')[1];
  schematic[sch_num].unit[unitIndex] = obj.value;
  // is_active[sch_num]="active";
  // }
  // document.getElementById(this_id).children[0].innerText=this_val;	
  update_smith_chart()
  // is_active=[];
}

function one_over_complex(real, imaginary) {
  var realn = real / (real * real + imaginary * imaginary);
  var imaginaryn = -imaginary / (real * real + imaginary * imaginary);
  return [realn, imaginaryn];
}

function pad(n) {
  return n < 10 ? '0' + n : n
}

function unitTextToNum(unit, freq_here) {
  if (unit[0] == 'f') return 1e-15;
  else if (unit[0] == 'p') return 1e-12;
  else if (unit[0] == 'n') return 1e-9;
  else if (unit[0] == 'u') return 1e-6;
  else if (unit == 'm') return 1;       //tl can have unit of meters
  else if (unit[0] == 'm') return 1e-3;	  //milli...
  else if (unit[0] == 'K') return 1e3;
  else if (unit[0] == 'M') return 1e6;
  else if (unit[0] == 'λ') return (3e8 / (freq_here * Math.sqrt(schematic[0].er)));
  else return 1;
}

function download2() {
  var myDate = new Date();
  var date = myDate.getDate();
  var month = myDate.getMonth();
  var year = myDate.getFullYear();
  var hour = myDate.getHours();
  var minutes = myDate.getMinutes();
  var seconds = myDate.getSeconds();

  var ddmmyyyy = year + pad(month + 1) + pad(date) + pad(hour) + pad(minutes) + pad(seconds);

  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(schematic, null, "\t")));
  element.setAttribute('download', "online_smith_tool_" + ddmmyyyy + ".json");

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

var doit;
window.onresize = function () {
  clearTimeout(doit);
  doit = setTimeout(resizedw, 200);
};

//Get a previous state if user requested it
urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('jsonBin')) {
  const jsonBin = urlParams.get('jsonBin')
  readFromJsonBin(jsonBin);
}
