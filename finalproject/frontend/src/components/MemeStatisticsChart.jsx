import React from "react";
import * as d3 from "d3";
import '../style/globalStyle.css';

class MemeStatisticsChart extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const { upvotes, downvotes, views } = this.props;
        const w = 630;
        const h = 300;
        const scaleFactor = 3;
        const barWidth = 10;

        console.log("upvotes in chart: ", upvotes)
        console.log("downvotes in chart: ", downvotes)
        console.log("views in chart: ", views)

        const svg = d3
            .select(".barchart")
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
            .attr("x", (d, i) => i * 43 + 24)
            .attr('y', (d, i) => {
                return h - 18 - d * scaleFactor;
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
            .attr("x", (d, i) => i * 43 + 34)
            .attr('y', (d, i) => {
                return h - 18 - d * scaleFactor;
            })
            .attr("width", barWidth)
            .attr('height', (d, i) => {
                return d * scaleFactor;
            })
            .append("title")
            .text(d => d);
        //views
        svg
            .selectAll("rect").select(".viewsBar")
            .data(views)
            .enter()
            .append("rect")
            .attr("fill", "navy")
            .attr("class", "viewsBar")
            .attr("x", (d, i) => i * 43 + 44)
            .attr('y', (d, i) => {
                return h - 18 - d * scaleFactor;
            })
            .attr("width", barWidth)
            .attr('height', (d, i) => {
                return d * scaleFactor;
            })
            .append("title")
            .text(d => d);

        // Create scale
        var xScale = d3.scaleLinear()
            .domain([14, 0])
            .range([0, w / 1.41 + 150]);

        // Add scales to axis
        var x_axis = d3.axisBottom()
            .scale(xScale);

        //Append group and insert axis
        svg.append("g")
            .attr("transform", "translate(20," + (h - 18) + ")")
            .call(x_axis);

        var yScale = d3.scaleLinear()
            .domain([0, 100])
            .range([h, 0]);

        var y_axis = d3.axisLeft()
            .scale(yScale);

        svg.append("g")
            .attr("transform", "translate(20, -18)")
            .call(y_axis);
    }
    render() {
        return (
            <div>
                <div className="barchart">
                    <h4>Upvotes, downvotes and views over the last 14 days</h4>
                </div>
                <div className="legende">
                    <div className="upvoteColor"></div> upvotes
                    <div className="downvoteColor"></div> downvotes
                    <div className="viewsColor"></div> views
                </div>
            </div>
        );
    }
}
export default MemeStatisticsChart;