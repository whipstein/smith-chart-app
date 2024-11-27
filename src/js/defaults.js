//get dom elements
var vmin_distanceEl = document.getElementById('vmin_distance');
var vmax_distanceEl = document.getElementById('vmax_distance');

var schematic = [];
var dataPoints = [];
var vswr = 0.0;
var constQ = 0.0;
var zo = 50;
var fontsize = 12;
var color_of_smith_curves = "bland";
//parameters
var resolution = 100;// 100; //number of points per arc
var span_resolution = 20;
var precision = 3;

schematic.push({ type: 'raw', imp: "se", zo: 50, freq: 275, er: 1, freq_unit: { multiplier: 1e9 }, span: 0.0, span_unit: { multiplier: 1e9 } });
if (schematic[0].imp == "diff") {
  schematic.push({ type: 'bb', real: 1, imaginary: 0, abs: [100, 0], unit: 'null', tol: 0 });
} else {
  schematic.push({ type: 'bb', real: 1, imaginary: 0, abs: [50, 0], unit: 'null', tol: 0 });
}

