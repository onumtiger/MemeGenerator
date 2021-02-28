import React from "react";
import * as d3 from "d3";
import '../style/Charts.scss';

export default class TemplateBarChart extends React.Component {
    constructor(props) {
        super(props);
    }

    drawChart() {
        const { upvotes, downvotes, uses, date } = this.props;
        const w = 630;
        const h = 400;
        const scaleFactor = 3;
        const barWidth = 10;

        console.log("upvotes in template chart: ", upvotes)
        console.log("downvotes in template chart: ", downvotes)
        console.log("views in template chart: ", uses)

        let previousChart = document.querySelector(".template-barchart-wrapper .barchart svg")
        if(previousChart) previousChart.remove();

        const svg = d3
            .select(".template-barchart-wrapper .barchart")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .attr("class", "bar");
        //upvotes
        svg
            .selectAll("rect").select(".upVotes")
            .data(upvotes)
            .enter()
            .append("rect")
            .attr("fill", "#54cf55")
            .attr("class", "upVotes")
            .attr("x", (d, i) => i * 43 + 34)
            .attr('y', (d, i) => {
                return h - 82 - d * scaleFactor;
            })
            .attr("width", barWidth)
            .attr('height', (d, i) => {
                return d * scaleFactor;
            })
            .append("title")
            .text(d => d);
        //downvotes
        svg
            .selectAll("rect").select(".downVotes")
            .data(downvotes)
            .enter()
            .append("rect")
            .attr("fill", "#ec5252")
            .attr("class", "downVotes")
            .attr("x", (d, i) => i * 43 + 44)
            .attr('y', (d, i) => {
                return h - 82 - d * scaleFactor;
            })
            .attr("width", barWidth)
            .attr('height', (d, i) => {
                return d * scaleFactor;
            })
            .append("title")
            .text(d => d);
        //uses
        svg
            .selectAll("rect").select(".viewsBar")
            .data(uses)
            .enter()
            .append("rect")
            .attr("fill", "purple")
            .attr("class", "viewsBar")
            .attr("x", (d, i) => i * 43 + 54)
            .attr('y', (d, i) => {
                return h - 82 - d * scaleFactor;
            })
            .attr("width", barWidth)
            .attr('height', (d, i) => {
                return d * scaleFactor;
            })
            .append("title")
            .text(d => d);
        //dates in x-axis as labels
        svg
            .selectAll("text").select(".dateText")
            .data(date)
            .enter()
            .append("text")
            .attr("class", "dateText")
            .style("font-size", 12)
            .attr("text-anchor", "end")
            .attr("y", (d, i) => i * 43 + 54)
            .attr('x', (d, i) => {
                return - 326;
            })
            .text(d => d)
            .attr("transform", "rotate(-90)");

        // Create scale
        var xScale = d3.scaleLinear()
            .domain([])
            .range([0, w / 1.41 + 150]);

        // Add scales to axis
        var x_axis = d3.axisBottom()
            .scale(xScale);

        //Append group and insert axis
        svg.append("g")
            .attr("transform", "translate(30," + (h - 82) + ")")
            .call(x_axis);

        var yScale = d3.scaleLinear()
            .domain([0, 100])
            .range([h-100, 0]);

        var y_axis = d3.axisLeft()
            .scale(yScale);

        svg.append("g")
            .attr("transform", "translate(30, 18)")
            .call(y_axis);
    }

    componentDidMount(){
        this.drawChart();
    }

    componentDidUpdate(){
        this.drawChart();
    }

    render() {
        return (
            <div className="template-barchart-wrapper">
                <div className="barchart">
                    <h4>The last 14 days of activity</h4>
                </div>
                <div className="legende">
                    <div className="upvoteColor"></div> upvotes
                    <div className="downvoteColor"></div> downvotes
                    <div className="usesColor"></div> uses
                </div>
            </div>
        );
    }
}
