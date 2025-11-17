// Waiting until document has loaded
window.onload = () => {

	console.log("main script loaded");

	const svg = d3.select("svg");
	const width = +svg.attr("width");
	const height = +svg.attr("height");
	const margin = { top: 30, right: 30, bottom: 50, left: 80 };

	function EngineSizeToColor(engineSize) {
		if (engineSize < 1.4) {
			return "grey"
		} else if (engineSize < 2.0) {
			return "lightblue"
		} else if (engineSize < 3.0) {
			return "blue"
		} else if (engineSize < 4.0) {
			return "green"
		} else if (engineSize < 5.0) {
			return "orange"
		} else {
			return "red"
		}
	}

	function TypeToSymbol(type) {
		const symbolScale = d3.scaleOrdinal()
			.domain(["Sedan", "SUV", "Sports Car", "Wagon", "Minivan"])
			.range([d3.symbolCircle, d3.symbolSquare, d3.symbolTriangle, d3.symbolStar, d3.symbolCross]);
		return symbolScale(type);
	}

	const symbolGenerator = d3.symbol().size(100);

	// Load the data set from the assets folder:
	d3.csv("cars.csv").then(rawData => {
		const data = rawData.map(d => ({
		x: +d.Horsepower,
		y: +d.RetailPrice,
		engineSize: +d.EngineSize,
		type: d.Type
		}));
		return data;
	}).then(data => {	

	// Define scales
	const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.x)])			// domain means input range of the data
    .range([margin.left, width - margin.right]);	// range means output range on the screen

	const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.y)])
    .range([height - margin.bottom, margin.top]);

	// Add axes
	const xAxis = d3.axisBottom(xScale);
	const yAxis = d3.axisLeft(yScale);	

	svg.append("g")									// g is a group element
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);

	svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis);

	svg.selectAll("path")
    .data(data)
    .enter()
    .append("path")
	.attr("d", d => symbolGenerator.type(TypeToSymbol(d.type))())
	.attr("transform", d => `translate(${xScale(d.x)},${yScale(d.y)})`)
    .attr("r", 6)
    .attr("fill", d => EngineSizeToColor(d.engineSize))
	.attr("stroke", "white")
	.attr("stroke-width", 1.5)
	.attr("opacity", 0.7);

	// label for x axis
	svg.append("text")
	.attr("class", "x-label")
	.attr("x", width / 2)	
	.attr("y", height)
	.attr("text-anchor", "middle")
	.text("Horsepower (HP)");

	// label for y axis
	svg.append("text")
	.attr("class", "y-label")
	.attr("transform", "rotate(-90)")
	.attr("x", -height / 2)
	.attr("y", 15)
	.attr("text-anchor", "middle")
	.text("Retail Price ($)");
	});

	// Attributes and their encoding
	// Color ->   Engine Size (l) 		-> from 0 to 6 (1.4 is the lowest actual value)
	// Symbol ->  Type od car			-> Sedan, SUV, Sports Car, Wagon, Minivan
	// X-Axis ->  Horsepower			-> from 73 to 493
	// Y-Axis ->  Retail price			-> from 10.280 to 192.465
};
