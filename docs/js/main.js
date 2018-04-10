const canvasTurnDepth = document.querySelector("#turn-depth"),
	context = canvasTurnDepth.getContext("2d");

const margin = {top: 20, right: 20, bottom: 30, left: 50},
	width = canvasTurnDepth.width - margin.left - margin.right,
	height = canvasTurnDepth.height - margin.top - margin.bottom
	maxTurns = 250000;
context.translate(margin.left, margin.top);

let xTurnScale = d3.scaleLinear()
	.range([0, width])
	.domain([0, maxTurns]);

let xDepthScale = d3.scaleLinear()
	.range([0, width])
	.domain([0, 5000]);

let yDepthScale = d3.scaleLinear()
	.range([height, 0])
	.domain([0, 5000]);

let yLevelScale = d3.scaleLinear()
	.range([height, 0])
	.domain([0, 50]);

const depthLine = d3.line()
	.x(function(d) { return xTurnScale(d.turn); })
	.y(function(d) { return yDepthScale(d.depth); })
	.curve(d3.curveStep)
	.context(context);

const levelLine = d3.line()
	.x(function(d) { return xTurnScale(d.turn); })
	.y(function(d) { return yLevelScale(d.level); })
	.curve(d3.curveStep)
	.context(context);

const depthLevelLine = d3.line()
	.x(function(d) { return xDepthScale(d.depth); })
	.y(function(d) { return yLevelScale(d.level); })
	.curve(d3.curveStep)
	.context(context);

xTurnAxis();
yDepthAxis();

d3.tsv("data/angband_4.1/warriors.tsv", function(d) {
	d3.tsv("data/angband_4.1/"+d.file, parseFile).then(drawData);
});

const parseFile = function(d) {
	d.turn = +d.turn;
	d.depth = +d.depth;
	d.level = +d.level;
	return d;
};

const drawData = function(data) {
	context.beginPath();
	depthLine(data);
	context.lineWidth = 1.5;
	context.strokeStyle = "steelblue";
	context.stroke();
};

function xTurnAxis() {
	var tickCount = 5,
		tickSize = 6,
		ticks = xTurnScale.ticks(tickCount),
		tickFormat = xTurnScale.tickFormat();

	context.beginPath();
	ticks.forEach(function(d) {
		context.moveTo(xTurnScale(d), height);
		context.lineTo(xTurnScale(d), height + tickSize);
	});
	context.strokeStyle = "black";
	context.stroke();

	context.beginPath();
	context.lineTo(0, height);
	context.lineTo(width, height);
	context.strokeStyle = "black";
	context.stroke();

	context.textAlign = "center";
	context.textBaseline = "top";
	ticks.forEach(function(d) {
		context.fillText(tickFormat(d), xTurnScale(d), height + tickSize);
	});

	context.save();
	context.font = "bold 10px sans-serif";
	context.fillText("Turn", width-20, height-10);
	context.restore();
}

function yDepthAxis() {
	var tickCount = 10,
		tickSize = 6,
		tickPadding = 3,
		ticks = yDepthScale.ticks(tickCount),
		tickFormat = yDepthScale.tickFormat(tickCount);

	context.beginPath();
	ticks.forEach(function(d) {
		context.moveTo(0, yDepthScale(d));
		context.lineTo(-6, yDepthScale(d));
	});
	context.strokeStyle = "black";
	context.stroke();

	context.beginPath();
	context.moveTo(-tickSize, 0);
	context.lineTo(0.5, 0);
	context.lineTo(0.5, height);
	context.lineTo(-tickSize, height);
	context.strokeStyle = "black";
	context.stroke();

	context.textAlign = "right";
	context.textBaseline = "middle";
	ticks.forEach(function(d) {
		context.fillText(tickFormat(d), -tickSize - tickPadding, yDepthScale(d));
	});

	context.save();
	context.rotate(-Math.PI / 2);
	context.textAlign = "right";
	context.textBaseline = "top";
	context.font = "bold 10px sans-serif";
	context.fillText("Depth (Feet)", -10, 10);
	context.restore();
}
