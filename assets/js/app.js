'use strict';

window.$ = window.jQuery = require('jquery');
window.Tether = require('tether');
window.Bootstrap = require('bootstrap');

const fs = require('fs');
const find = require('find');
const path = require('path');
const {ipcRenderer, shell} = require('electron');
const { BrowserWindow } = require('electron').remote;
const {dialog} = require('electron').remote;
const {is} = require('electron-util');

const Store = require('electron-store');
const store = new Store();

const exec = require('./assets/js/exec');

$(document).ready(function() {
	$("#analysis-button").on('click', function(e) {
		e.preventDefault();
		run_analysis();
	});

	app_init();
});


function app_init() {
	$("#current-version").text(store.get("version"));
	show_welcome_screen();
}

function show_screen(id) {
	$(".screen").hide();

	if (id.includes('#'))
		$(id).show();
	else
		$('#' + id).show();
}

function show_welcome_screen() {
	show_screen('welcome-screen');
}

function show_results_screen() {
	show_screen('results-screen');
}

function generate_input() {
	let header = "ABC,DEF,HI,JK,LMNOP";
	let inputs = "1,0,2,1,3";
	
	try {
		let filepath = path.join(store.get("user.analysis_path"), new Date().valueOf().toString() + "-input.csv");
		fs.writeFileSync(filepath, header + '\n' + inputs + '\n');
		return filepath;
	} catch(err) { 
		console.log(err);
		return "";
	}
}

function generate_output(input_file) {
	let ts = input_file.replace("-input.csv", "").replace(store.get("user.analysis_path"), "");
	let filepath = path.join(store.get("user.analysis_path"), ts + "-output.txt");
	return filepath;
}

function run_analysis() {
	console.log("Running Analysis...");

	let input_file = generate_input();
	let output_file = generate_output(input_file);

	let temp_directory = store.get("user.analysis_path");
	let analysis_directory = store.get("app.r_analysis_path");
	let analysis_script = path.join(analysis_directory, "analysis.R");

	let params = [
		analysis_script,
		analysis_directory,
		temp_directory,
		input_file,
		output_file
	];

	if (input_file.length > 0) {
		// ATTEMPT AT RUNNING WITHOUT "SUDO" PERMISSIONS
		// exec.execFile(
		// 	store.get("app.rscript_path"),
		// 	params,
		// 	function(error, stdout, stderr) {
		// 		console.error(error);
		// 		show_message("danger", error);
		// 	},
		// 	function(stdout, stderr) {
		// 		fs.readFile(output_file, 'utf8', (err, data) => {
		// 			if (err) console.error(err);
		// 			display_results(data, path.join(temp_directory, "output1.png"));
		// 		});
		// 	}
		// );

		// RUN WITH "SUDO" PROMPT
		let cmd = '"' + store.get("app.rscript_path") + '"';
		$.each(params, function(i,v) {
			cmd = cmd + ' "' + v + '"';
		});
		exec.sudo(
			cmd,
			{ name: "Subprocess" },
			function (error, stdout, stderr) {
				console.error(error);
				show_message("danger", error);
			},
			function(stdout, stderr) {
				fs.readFile(output_file, 'utf8', (err, data) => {
					if (err) console.error(err);
					display_results(data, path.join(temp_directory, "output1.png"));
				});
			}
		);
	} else {
		show_message("warning", "No input file generated");
		return;
	}
}

function display_results(data, image_file) {
	console.log("Results");
	console.log(store.store);
	console.log(data);
	console.log(image_file);

	$("#results-text").html(data);

	if (fs.existsSync(image_file)) {
		let img = $("<img></img>");
		img.attr("src", "file://" + image_file + "?rand=" + (Math.random() * 99999))
			.addClass("img-responsive");
		$("#results-image").empty().append(img);
	}
	
	show_results_screen();
}

function show_message(type, message) {
	$("#generic-alert").removeClass()
		.addClass("alert")
		.addClass("alert-" + type)
		.html(message)
		.show();
}