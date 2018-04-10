const canvasTurnDepth = document.querySelector("#turn-depth"),
	contextTurnDepth = canvasTurnDepth.getContext("2d");

const canvasTurnLevel = document.querySelector("#turn-level"),
	contextTurnLevel = canvasTurnLevel.getContext("2d");

const canvasDepthLevel = document.querySelector("#depth-level"),
	contextDepthLevel = canvasDepthLevel.getContext("2d");

const margin = {top: 20, right: 20, bottom: 30, left: 50},
	width = canvasTurnDepth.width - margin.left - margin.right,
	height = canvasTurnDepth.height - margin.top - margin.bottom
	maxTurns = 250000;

contextTurnDepth.translate(margin.left, margin.top);
contextTurnLevel.translate(margin.left, margin.top);
contextDepthLevel.translate(margin.left, margin.top);

let xTurnScale = d3.scaleLinear()
	.range([0, width])
	.domain([0, maxTurns]);

let xLevelScale = d3.scaleLinear()
	.range([0, width])
	.domain([0, 50]);

let yDepthScale = d3.scaleLinear()
	.range([height, 0])
	.domain([0, 5000]);

let yLevelScale = d3.scaleLinear()
	.range([height, 0])
	.domain([0, 50]);

const lineTurnDepth = d3.line()
	.x(function(d) { return xTurnScale(d.turn); })
	.y(function(d) { return yDepthScale(d.depth); })
	.curve(d3.curveStep)
	.context(contextTurnDepth);

const lineTurnLevel = d3.line()
	.x(function(d) { return xTurnScale(d.turn); })
	.y(function(d) { return yLevelScale(d.level); })
	.curve(d3.curveStep)
	.context(contextTurnLevel);

const lineDepthLevel = d3.line()
	.x(function(d) { return xLevelScale(d.level); })
	.y(function(d) { return yDepthScale(d.depth); })
	.curve(d3.curveStep)
	.context(contextDepthLevel);

xTurnAxis(contextTurnDepth);
yDepthAxis(contextTurnDepth);

xTurnAxis(contextTurnLevel);
yLevelAxis(contextTurnLevel);

xLevelAxis(contextDepthLevel);
yDepthAxis(contextDepthLevel);

d3.tsv("data/angband_4.1/characters.tsv", function(d) {
	d3.tsv("data/angband_4.1/"+d.file, parseFile).then(drawData(d.profession));
});

const parseFile = function(d) {
	d.turn = +d.turn;
	d.depth = +d.depth;
	d.level = +d.level;
	return d;
};

const inEachContext = function(yield) {
	const contexts = [contextTurnDepth, contextTurnLevel, contextDepthLevel];
	for (idx in contexts) {
		yield(contexts[idx]);
	}
};

const drawData = function(profession) {
	const color = {
		'warrior': 'crimson',
		'mage': 'MediumPurple',
		'rogue': 'DarkOrchid',
	}[profession];

	return function(data) {
		inEachContext(function(context) { context.beginPath(); });
		lineTurnDepth(data);
		lineTurnLevel(data);
		lineDepthLevel(data);
		inEachContext(function(context) {
			context.lineWidth = 1.5;
			context.globalAlpha = 0.70;
			context.strokeStyle = color;
			context.stroke();
		});
	};
};

function xTurnAxis(context) {
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

function xLevelAxis(context) {
	var tickCount = 5,
		tickSize = 6,
		ticks = xLevelScale.ticks(tickCount),
		tickFormat = xLevelScale.tickFormat();

	context.beginPath();
	ticks.forEach(function(d) {
		context.moveTo(xLevelScale(d), height);
		context.lineTo(xLevelScale(d), height + tickSize);
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
		context.fillText(tickFormat(d), xLevelScale(d), height + tickSize);
	});

	context.save();
	context.font = "bold 10px sans-serif";
	context.textAlign = "right";
	context.fillText("Character Level", width-20, height-10);
	context.restore();
}

function yDepthAxis(context) {
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

function yLevelAxis(context) {
	var tickCount = 10,
		tickSize = 6,
		tickPadding = 3,
		ticks = yLevelScale.ticks(tickCount),
		tickFormat = yLevelScale.tickFormat(tickCount);

	context.beginPath();
	ticks.forEach(function(d) {
		context.moveTo(0, yLevelScale(d));
		context.lineTo(-6, yLevelScale(d));
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
		context.fillText(tickFormat(d), -tickSize - tickPadding, yLevelScale(d));
	});

	context.save();
	context.rotate(-Math.PI / 2);
	context.textAlign = "right";
	context.textBaseline = "top";
	context.font = "bold 10px sans-serif";
	context.fillText("Character Level", -10, 10);
	context.restore();
}
