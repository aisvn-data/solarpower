google.load("visualization", "1", {packages:["corechart"]}); 
$(document).ready(function() { 
// Daten aus der data.js einfügen
document.getElementById("tempea").firstChild.nodeValue = temperatur.slice(0,14);
document.getElementById("tempeb").firstChild.nodeValue = temperatur.slice(15); 
document.getElementById("uptime").firstChild.nodeValue = uptime_now; 
document.getElementById("wlan").firstChild.nodeValue = wlan;
// Datenarray data erstellen und mit Daten füllen
var data = new google.visualization.DataTable(); 
data.addColumn('string','Uhrzeit'); 
data.addColumn('number', 'heute'); 
data.addColumn('number', 'gestern'); 
data.addRows(144);
// heute laden 
var jetzt = new Date();
var dh = String(jetzt.getFullYear()); 
if (parseInt(jetzt.getMonth()+1,10) < 10) { 
  dh = dh + "0" + String(jetzt.getMonth()+1) 
} else { 
  dh = dh + String(jetzt.getMonth()+1) 
} 
if (parseInt(jetzt.getDate(),10) < 10) { 
  dh = dh + "0" + String(jetzt.getDate()); 
} else { 
  dh = dh + String(jetzt.getDate()); 
} 
var datei = "data/" + dh + ".log"; //Dateiname ist YYYYMMDD.log 
$('#heute').load(datei); // pre mit Messdaten von heute füllen 
$.get( datei, function( hdata ) { 
  hdata=hdata.replace(/\n/g, " ");// regulärer Ausdruck /\n/g - siehe unten
  var harray = hdata.split(" ");
  var messende = (harray.length+1)/3 - 3 //- 6 
  for (var i = 0; i < messende ; ++i) 
    data.setValue(i, 1, parseFloat(harray[i*3+6])); // Temperatur heute
});

// Datum auf gestern setzen
jetzt.setDate(jetzt.getDate() - 1); 
var dh = String(jetzt.getFullYear()); 
if (parseInt(jetzt.getMonth()+1,10) < 10) { 
  dh = dh + "0" + String(jetzt.getMonth()+1) 
} else { 
  dh = dh + String(jetzt.getMonth()+1) 
} 
if (parseInt(jetzt.getDate(),10) < 10) { 
  dh = dh + "0" + String(jetzt.getDate()); 
} else { 
  dh = dh + String(jetzt.getDate()); 
} 
datei = "data/" + dh + ".log"; // jetzt entspricht Dateinamen gestern
$('#gestern').load(datei); // pre mit Messdaten von gestern füllen
$.get( datei, function( gdata ) { 
  gdata=gdata.replace(/\n/g, " "); // jeden Zeilenwechsel duch ein Leerzeichen ersetzen
  var garray = gdata.split(" "); 
  for (var i = 0; i < 144 ; ++i) { 
    data.setValue(i, 0, String(garray[i*3+5])); // Uhrzeit
    data.setValue(i, 2, parseFloat(garray[i*3+6])); // Temperatur gestern
  } 
  var options = { title: 'Temperaturverlauf in Hofkoh' }; 
  var chart = new google.visualization.AreaChart(document.getElementById('chart_div')); 
  chart.draw(data, options); 
}); 
return false;
});
