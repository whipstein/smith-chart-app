function toggle_color_scheme() {
  var element = document.getElementById("mainSection");
  var x = document.getElementsByClassName("bg-white");
  if (x.length > 0) {
    element.classList.remove("bg-white");
    element.classList.add("bg-green");
    document.getElementById('hollowed_circle').style["boxShadow"] = "0px 0px 0px 2000px rgb(184, 255, 241)";
  } else {
    element.classList.add("bg-white");
    element.classList.remove("bg-green");
    document.getElementById('hollowed_circle').style["boxShadow"] = "0px 0px 0px 2000px white";
  }

  if (color_of_smith_curves == 'bland') {
    color_of_smith_curves = 'colorful';
  } else {
    color_of_smith_curves = 'bland';
  }

  update_smith_chart();
}

var show_labels_DP = true;
var show_labels_adm = true;
var show_labels_res = true;
var show_circles_adm = true;
var show_circles_res = true;

function toggle_zoom_en() {
  var element = document.getElementById("smithChartOverlay");
  element.classList.toggle("noPointerClass");
}

function toggle_labels_DP() {
  show_labels_DP = !show_labels_DP;
  update_smith_chart();
}

function toggle_labels_imag() {
  show_labels_adm = !show_labels_adm;
  update_smith_chart();
}

function toggle_labels_real() {
  show_labels_res = !show_labels_res;
  update_smith_chart();
}

function toggle_circles_adm() {
  show_circles_adm = !show_circles_adm;
  update_smith_chart();
}

function toggle_circles_res() {
  show_circles_res = !show_circles_res;
  update_smith_chart();
}

function draw_schematic(i) {
  //Add the element to the schematic view
  var div = document.createElement("div");
  unit = [];
  div.setAttribute('class', 'col-6 col-lg-2 g-0');
  //Add a close button, but can't remove black boxes...
  var innerText = ""
  // if (schematic[i].type!='bb') div.innerHTML += "<div class=\"rem\" onclick=\"schematic.splice("+i+",1); update_smith_chart()\"><div class=\"dp_txt\">DP"+i+"</div><div class=\"close-button\"></div></div>";
  // else div.innerHTML += "<div class=\"rem\">DP"+i+"</div>"; 
  if (schematic[i].type != 'bb') innerText += '<div class="row me-2 ms-2" style="height: 26px;"><div class="col"><small>DP' + i + '</small></div><div class="col text-end"><button type="button" class="btn-close" onclick="schematic.splice(' + i + ',1); update_smith_chart()"></button></div></div>'
  else innerText += '<div class="row me-2 ms-2" style="height: 26px;"><small>DP' + i + '</small></div>';
  var rows_to_create = []
  switch (schematic[i].type) {
    case ("bb"):
      sch_label = "Black Box";
      sch_imag = true;
      sch_real = true;
      sch_abs = true;
      sch_icon = "black_box";
      sch_svg = 0;
      rows_to_create = [['Impedance'], ['abs', 'abs'], ['tol']];
      break;
    case ("customZ"):
      sch_label = "Custom";
      sch_imag = true;
      sch_real = true;
      sch_abs = true;
      sch_icon = "CustomZ";
      sch_svg = 6500;
      rows_to_create = [['blank-impedance'], ['custom']];
      break;
    case ("pr"):
      rows_to_create = [['Impedance'], ['abs', 'unit_0'], ['tol']];
      sch_label = "Parallel Resistor";
      sch_imag = false;
      sch_real = true;
      sch_abs = true;
      unit = [['mΩ', 'Ω', 'KΩ', 'MΩ']];
      sch_icon = "resistor_parallel";
      sch_svg = 2500;
      break;
    case ("sr"):
      rows_to_create = [['Impedance'], ['abs', 'unit_0'], ['tol']];
      sch_label = "Series Resistor";
      sch_imag = false;
      sch_real = true;
      sch_abs = true;
      unit = [['mΩ', 'Ω', 'KΩ', 'MΩ']];
      sch_icon = "resistor_series";
      sch_svg = 3000;
      break;
    case ("pc"):
      rows_to_create = [['Impedance'], ['abs', 'unit_0'], ['abs', 'unit_1'], ['tol']];
      sch_label = "Parallel Capacitor";
      sch_imag = true;
      sch_real = true;
      sch_abs = true;
      unit = [['Q'], ['mF', 'uF', 'nF', 'pF', 'fF']];
      sch_icon = "capacitor_parallel";
      sch_svg = 500;
      break;
    case ("sc"):
      rows_to_create = [['Impedance'], ['abs', 'unit_0'], ['abs', 'unit_1'], ['tol']];
      sch_label = "Series Capacitor";
      sch_imag = true;
      sch_real = true;
      sch_abs = true;
      unit = [['Q'], ['mF', 'uF', 'nF', 'pF', 'fF']];
      sch_icon = "capacitor_series";
      sch_svg = 1000;
      break;
    case ("pi"):
      rows_to_create = [['Impedance'], ['abs', 'unit_0'], ['abs', 'unit_1'], ['tol']];
      sch_label = "Parallel Inductor";
      sch_imag = true;
      sch_real = true;
      sch_abs = true;
      unit = [['Q'], ['H', 'mH', 'uH', 'nH', 'pH']];
      sch_icon = "inductor_parallel";
      sch_svg = 1500;
      break;
    case ("si"):
      rows_to_create = [['Impedance'], ['abs', 'unit_0'], ['abs', 'unit_1'], ['tol']];
      sch_label = "Series Inductor";
      sch_imag = true;
      sch_real = true;
      sch_abs = true;
      unit = [['Q'], ['H', 'mH', 'uH', 'nH', 'pH']];
      sch_icon = "inductor_series";
      sch_svg = 2000;
      break;
    case ("tl"):
      rows_to_create = [['blank-impedance'], ['abs', 'unit_0'], ['line_zo']];
      sch_label = "Transmission Line";
      sch_imag = false;
      sch_real = false;
      sch_abs = true; //is actually length
      unit = [[' m', 'mm', 'um', 'λ']];
      sch_icon = "transmission_line";
      sch_svg = 3500;
      break;
    case ("ss"):
      rows_to_create = [['blank-impedance'], ['abs', 'unit_0'], ['line_zo']];
      sch_label = "Short Stub";
      sch_imag = false;
      sch_real = false;
      sch_abs = true; //is actually length
      unit = [[' m', 'mm', 'um', 'λ']];
      sch_icon = "stub_short";
      sch_svg = 4500;
      break;
    case ("so"):
      rows_to_create = [['blank-impedance'], ['abs', 'unit_0'], ['line_zo']];
      sch_label = "Open Stub";
      sch_imag = false;
      sch_real = false;
      sch_abs = true; //is actually length
      unit = [[' m', 'mm', 'um', 'λ']];
      sch_icon = "stub_open";
      sch_svg = 4000;
      break
    case ("xfmr"):
      rows_to_create = [['Impedance'], ['abs', 'unit_0'], ['abs', 'unit_1'], ['abs', 'unit_1'], ['abs', 'unit_2'], ['tol']];
      sch_label = "Transformer";
      sch_imag = true;
      sch_real = true;
      sch_abs = true;
      unit = [['Q'], ['H', 'mH', 'uH', 'nH', 'pH'], ['H', 'mH', 'uH', 'nH', 'pH'], ['k']];
      sch_icon = "inductor_parallel";
      sch_svg = [2000, 1500, 2000];
      break;
    case ("rlc"):
      rows_to_create = [['Impedance'], ['abs', 'unit_0'], ['abs', 'unit_1'], ['abs', 'unit_2'], ['tol']];
      sch_label = "Inductor w/ ESR";
      sch_imag = true;
      sch_real = true;
      sch_abs = true;
      unit = [['mΩ', 'Ω', 'KΩ', 'MΩ'], ['H', 'mH', 'uH', 'nH', 'pH'], ['mF', 'uF', 'nF', 'pF', 'fF']];
      sch_icon = "black_box";
      sch_svg = 6000;
      break;
  }
  if (schematic[i].type == "xfmr") {
    innerText += '<div class="row"><div class="col"><svg viewBox="' + sch_svg[0] + ' 0 500 500"><use xlink:href="svg/elements_w_custom.svg#rainbow3" alt="' + sch_label + '" /></svg></div>';
    innerText += '<div class="col"><svg viewBox="' + sch_svg[1] + ' 0 500 500"><use xlink:href="svg/elements_w_custom.svg#rainbow3" alt="' + sch_label + '" /></svg></div>';
    innerText += '<div class="col"><svg viewBox="' + sch_svg[2] + ' 0 500 500"><use xlink:href="svg/elements_w_custom.svg#rainbow3" alt="' + sch_label + '" /></svg></div></div>';
  } else {
    innerText += '<div class="row"><div class="col"><svg viewBox="' + sch_svg + ' 0 500 500"><use xlink:href="svg/elements_w_custom.svg#rainbow3" alt="' + sch_label + '" /></svg></div></div>';
  }

  var cntR, cntC, ittUnit, boxType, varSelect, unitIndex;
  var absCounter = 0;
  for (cntR = 0; cntR < rows_to_create.length; cntR++) {
    innerText += '<div class="row ms-3 me-3"><div class="input-group mb-1 p-0">'
    for (cntC = 0; cntC < rows_to_create[cntR].length; cntC++) {
      boxType = rows_to_create[cntR][cntC];
      if (boxType == 'tol') {
        innerText += '<span class="input-group-text">tol &plusmn; </span>'
        innerText += '<input type="text" class="form-control" value="' + schematic[i].tol + '" name="tol" onchange="update_schem_tol(' + i + ',this)">'
        innerText += '<span class="input-group-text">%</span>'
      } else
        if (boxType == 'blank-impedance') {
          innerText += '<div class="fst-italic m-auto">&nbsp</div>';
        } else if (boxType == 'Impedance') {
          innerText += '<div class="fst-italic m-auto">Z = '
          if (sch_real) innerText += Number(((schematic[i].real * zo)).toFixed(precision))
          if (sch_real && sch_imag) {
            if (schematic[i].imaginary * zo >= 0) innerText += ' + '
            else innerText += ' - '
          }
          if (sch_imag) innerText += Number((Math.abs(schematic[i].imaginary * zo)).toFixed(precision)) + 'j'
          innerText += '</div>'
        } else if (boxType == 'custom') {
          innerText += '<button type="button" class="btn btn-secondary m-auto" data-bs-toggle="modal" data-bs-target="#customZModal" onclick="createCustomZModal(' + i + ')">Impedance Table</button>';
        } else if (boxType == 'line_zo') {
          innerText += '<span class="input-group-text">Zo = </span>'
          innerText += '<input type="text" class="form-control" value=' + schematic[i][boxType] + ' name="' + boxType + '" onchange="update_schem_abs(' + i + ',this,0)">'
        } else if ((boxType == 'unit_0') || (boxType == 'unit_1') || (boxType == 'unit_2')) {
          unitIndex = boxType.split('_')[1];
          innerText += '<select class="form-select" onchange="updatespan(' + i + ', this, ' + unitIndex + ')">'
          for (ittUnit = 0; ittUnit < unit[unitIndex].length; ittUnit++) {
            if (unit[unitIndex][ittUnit] == schematic[i].unit[unitIndex]) varSelect = "selected"
            else varSelect = ""
            innerText += '<option value=' + unit[unitIndex][ittUnit] + ' ' + varSelect + '>' + unit[unitIndex][ittUnit] + '</option>'
          }
          innerText += '</select>'
          // console.log('Unit', schematic[i].unit[unitIndex], innerText);
        } else {
          if (cntC > 0) innerText += '<span class="input-group-text">+</span>'
          innerText += '<input type="text" class="form-control inputMW" value=' + schematic[i][boxType][absCounter] + ' name="' + boxType + '" onchange="update_schem_abs(' + i + ',this,' + absCounter + ')">'
          // innerText += '<input type="text" class="form-control inputMW" value=' + schematic[i][boxType][absCounter] + ' name="' + boxType + '" onkeyup="update_schem_abs(' + i + ',this,' + absCounter + ')">'
          if (cntC > 0) innerText += '<span class="input-group-text ps-2 pe-2">j</span>'
          if (boxType == 'abs') absCounter = absCounter + 1;
        }
    }
    innerText += '</div></div>'
  }

  div.innerHTML = innerText;
  return div;
}

//plots an arc with 'resolution' points between previous impedance x1,y1 and next impedance x2,y2
function arc_smith_points(x1, y1, x2, y2, type, rotate, beta, start_at_qtr_wl) {

  var x_coord = [];
  var y_coord = [];
  var end_x_coord = 0;
  var end_y_coord = 0;
  var temp_array = [];
  temp_array = find_smith_coord(x1, y1, rotate);
  var start_x_coord = temp_array[0];
  var start_y_coord = temp_array[1];
  var real_old = 0;
  var imag_old = 0;
  var tan_beta = 0;
  var stub_admittance_im = 0;

  //used for transmission lines and stubs
  var line_zo = y2;
  var line_length = x2;
  var top_real_temp = x1 * line_zo;

  for (i = 0; i < resolution + 1; i++) {
    if (type == "transmission_line") {
      tan_beta = Math.tan(beta * i * line_length / resolution);
      var top_imag_temp = (y1 * zo + line_zo * tan_beta) * line_zo / zo;
      var bot_real_temp = line_zo - y1 * tan_beta * zo;
      var bot_imag_temp = x1 * tan_beta * zo;
      var temp_array = one_over_complex(bot_real_temp, bot_imag_temp);
      var bot_real = temp_array[0];
      var bot_imag = temp_array[1];
      var real_answer = (top_real_temp * bot_real) - (top_imag_temp * bot_imag);
      var imag_answer = (top_real_temp * bot_imag) + (top_imag_temp * bot_real);
      temp_array = find_smith_coord(real_answer, imag_answer, rotate);
      x_coord[i] = temp_array[0];
      y_coord[i] = temp_array[1];

    } else if (type == "ss") {
      if (start_at_qtr_wl == 0) tan_beta = Math.tan(beta * i * line_length / resolution);
      else tan_beta = Math.tan(beta * (start_at_qtr_wl + i * (line_length - start_at_qtr_wl) / resolution));
      stub_admittance_im = -1 / (tan_beta * line_zo / zo);
      temp_array = find_smith_coord(x1, y1 + stub_admittance_im, rotate);
      x_coord[i] = temp_array[0];
      y_coord[i] = temp_array[1];
    } else if (type == "so") {
      tan_beta = Math.tan(beta * i * line_length / resolution);
      stub_admittance_im = tan_beta / (line_zo / zo);
      temp_array = find_smith_coord(x1, y1 + stub_admittance_im, rotate);
      x_coord[i] = temp_array[0];
      y_coord[i] = temp_array[1];
    } else {
      temp_array = find_smith_coord(x1 + (x2 - x1) * i / resolution, y1 + (y2 - y1) * i / resolution, rotate);
      x_coord[i] = temp_array[0];
      y_coord[i] = temp_array[1];
    }
  }

  if (type == "transmission_line") {
    temp_array = find_smith_coord(real_answer, imag_answer, rotate);
    real_old = real_answer;
    imag_old = imag_answer;
  }
  else if ((type == "so") || (type == "ss")) {
    real_old = x1;
    imag_old = y1 + stub_admittance_im;
  }/*
    temp_array=find_smith_coord(x1,imag_answer,rotate);
  } else {
    temp_array=find_smith_coord(x2, y2,rotate);
  }*/

  end_x_coord = temp_array[0];
  end_y_coord = temp_array[1];

  return [x_coord, y_coord, end_x_coord, end_y_coord, real_old, imag_old, start_x_coord, start_y_coord, x1, y1, x2, y2];
}

var layout = {
  title: 'Circles',
  hovermode: false,
  xaxis: {
    range: [-1, 1],
    zeroline: false,
    showgrid: false
  },
  yaxis: {
    range: [-1, 1],
    showgrid: false
  },
  width: 650,
  height: 650,
  showgrid: false,
  margin: {
    l: 0,
    r: 0,
    b: 0,
    t: 0
  }
}

function configure_layout_shapes() {
  if (color_of_smith_curves == 'bland') {
    color_resistance_real = 'rgba(255, 0, 0, 0.2)';
    color_resistance_imaginary = 'rgba(255, 0, 0, 0.3)';
    color_admittance_real = 'rgba(0, 0, 255, 0.2)';
    color_admittance_imaginary = 'rgba(0, 0, 255, 0.3)';
  } else {
    color_resistance_real = 'rgba(150, 0, 0, 0.2)';
    color_resistance_imaginary = 'rgba(252, 114, 2, 0.3)';
    color_admittance_real = 'rgba(255, 0, 250, 0.2)';
    color_admittance_imaginary = 'rgba(0, 10, 163, 0.3)';
  }

  var shapes_omni = [
    {
      type: 'circle',
      x0: -1,
      y0: -1,
      x1: 1,
      y1: 1,
      line: {
        color: color_resistance_real
      }
    },
  ];

  var shapes_res = [

    ///RESISTANCE CIRCLES
    {
      type: 'circle',
      x0: -0.666,
      y0: -0.833,
      x1: 1,
      y1: 0.833,
      line: {
        color: color_resistance_real
      }
    },
    {
      type: 'circle',
      x0: -0.333,
      y0: -0.666,
      x1: 1,
      y1: 0.666,
      line: {
        color: color_resistance_real
      }
    },
    {
      type: 'circle',
      x0: 0,
      y0: -0.5,
      x1: 1,
      y1: 0.5,
      line: {
        color: color_resistance_real
      }
    },
    {
      type: 'circle',
      x0: 0.333,
      y0: -0.333,
      x1: 1,
      y1: 0.333,
      line: {
        color: color_resistance_real
      }
    },
    {
      type: 'circle',
      x0: 0.6,
      y0: -0.2,
      x1: 1,
      y1: 0.2,
      line: {
        color: color_resistance_real
      }
    },
    {
      type: 'circle',
      x0: 0.818,
      y0: -0.0909,
      x1: 1,
      y1: 0.0909,
      line: {
        color: color_resistance_real
      }
    }
  ];


  ///ADMITTANCE CIRCLES
  var shapes_adm = [
    {
      type: 'circle',
      x0: 0.6,
      y0: -0.8,
      x1: -1,
      y1: 0.8,
      line: {
        color: color_admittance_real
      }
    },
    {
      type: 'circle',
      x0: 0.333,
      y0: -0.666,
      x1: -1,
      y1: 0.666,
      line: {
        color: color_admittance_real
      }
    },
    {
      type: 'circle',
      x0: -1,
      y0: -0.5,
      x1: 0,
      y1: 0.5,
      line: {
        color: color_admittance_real
      }
    },
    {
      type: 'circle',
      x0: -1,
      y0: -0.333,
      x1: -0.333,
      y1: 0.333,
      line: {
        color: color_admittance_real
      }
    },
    {
      type: 'circle',
      x0: -1,
      y0: -0.166,
      x1: -0.666,
      y1: 0.166,
      line: {
        color: color_admittance_real
      }
    },
    {
      type: 'circle',
      x0: -1,
      y0: -0.0909,
      x1: -0.818,
      y1: 0.0909,
      line: {
        color: color_admittance_real
      }
    },
  ];

  ///REACTANCE CIRCLES
  var shapes_rea = [
    {
      type: 'circle',
      x0: 0.9,
      y0: 0,
      x1: 1.1,
      y1: 0.2,
      line: {
        color: color_resistance_imaginary
      }
    },
    {
      type: 'circle',
      x0: 0.8,
      y0: 0,
      x1: 1.2,
      y1: 0.4,
      line: {
        color: color_resistance_imaginary
      }
    },
    {
      type: 'circle',
      x0: 0.5,
      y0: 0,
      x1: 1.5,
      y1: 1,
      line: {
        color: color_resistance_imaginary
      }
    },
    {
      type: 'circle',
      x0: 0,
      y0: 0,
      x1: 2,
      y1: 2,
      line: {
        color: color_resistance_imaginary
      }
    },
    {
      type: 'circle',
      x0: -1,
      y0: 0,
      x1: 3,
      y1: 4,
      line: {
        color: color_resistance_imaginary
      }
    },
    {
      type: 'circle',
      x0: -4,
      y0: 0,
      x1: 6,
      y1: 10,
      line: {
        color: color_resistance_imaginary
      }
    },

    //imaginary
    {
      type: 'circle',
      x0: 0.9,
      y0: 0,
      x1: 1.1,
      y1: -0.2,
      line: {
        color: color_resistance_imaginary
      }
    },
    {
      type: 'circle',
      x0: 0.8,
      y0: 0,
      x1: 1.2,
      y1: -0.4,
      line: {
        color: color_resistance_imaginary
      }
    },
    {
      type: 'circle',
      x0: 0.5,
      y0: 0,
      x1: 1.5,
      y1: -1,
      line: {
        color: color_resistance_imaginary
      }
    },
    {
      type: 'circle',
      x0: 0,
      y0: 0,
      x1: 2,
      y1: -2,
      line: {
        color: color_resistance_imaginary
      }
    },
    {
      type: 'circle',
      x0: -1,
      y0: 0,
      x1: 3,
      y1: -4,
      line: {
        color: color_resistance_imaginary
      }
    },
    {
      type: 'circle',
      x0: -4,
      y0: 0,
      x1: 6,
      y1: -10,
      line: {
        color: color_resistance_imaginary
      }
    }
  ];



  ///SUSCEPTANCE CIRCLES
  var shapes_sus = [
    {
      type: 'circle',
      x0: -1.1,
      y0: 0,
      x1: -0.9,
      y1: 0.2,
      line: {
        color: color_admittance_imaginary
      }
    },
    {
      type: 'circle',
      x0: -1.2,
      y0: 0,
      x1: -0.8,
      y1: 0.4,
      line: {
        color: color_admittance_imaginary
      }
    },
    {
      type: 'circle',
      x0: -1.5,
      y0: 0,
      x1: -0.5,
      y1: 1,
      line: {
        color: color_admittance_imaginary
      }
    },
    {
      type: 'circle',
      x0: -2,
      y0: 0,
      x1: -0,
      y1: 2,
      line: {
        color: color_admittance_imaginary
      }
    },
    {
      type: 'circle',
      x0: -3,
      y0: 0,
      x1: 1,
      y1: 4,
      line: {
        color: color_admittance_imaginary
      }
    },
    {
      type: 'circle',
      x0: -6,
      y0: 0,
      x1: 4,
      y1: 10,
      line: {
        color: color_admittance_imaginary
      }
    },
    //negative
    {
      type: 'circle',
      x0: -1.1,
      y0: 0,
      x1: -0.9,
      y1: -0.2,
      line: {
        color: color_admittance_imaginary
      }
    },
    {
      type: 'circle',
      x0: -1.2,
      y0: 0,
      x1: -0.8,
      y1: -0.4,
      line: {
        color: color_admittance_imaginary
      }
    },
    {
      type: 'circle',
      x0: -1.5,
      y0: 0,
      x1: -0.5,
      y1: -1,
      line: {
        color: color_admittance_imaginary
      }
    },
    {
      type: 'circle',
      x0: -2,
      y0: 0,
      x1: -0,
      y1: -2,
      line: {
        color: color_admittance_imaginary
      }
    },
    {
      type: 'circle',
      x0: -3,
      y0: 0,
      x1: 1,
      y1: -4,
      line: {
        color: color_admittance_imaginary
      }
    },
    {
      type: 'circle',
      x0: -6,
      y0: 0,
      x1: 4,
      y1: -10,
      line: {
        color: color_admittance_imaginary
      }
    },

  ];
  if (!show_circles_adm) shapes_adm = []
  if (!show_circles_adm) shapes_sus = []
  if (!show_circles_res) shapes_res = []
  if (!show_circles_res) shapes_rea = []

  var shapes = [].concat(shapes_res, shapes_sus, shapes_rea, shapes_adm, shapes_omni);
  return shapes;
}

function resizedw() {
  update_smith_chart();
}
