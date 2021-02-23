import React from "react";
import * as d3 from "d3";
import '../style/globalStyle.css';

class MemeStatisticsChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        // const { upvotes, downvotes, views} = this.props;
        const upvotes = [20, 45, 33, 67, 54, 24, 25, 35, 64, 35, 23, 14, 53, 45];
        const downvotes = [2, 4, 3, 7, 4, 4, 5, 3, 4, 3, 3, 1, 3, 5];
        const views = [30, 51, 45, 83, 64, 76, 34, 42, 70, 39, 28, 19, 56, 54];
        const w = 630;
        const h = 300;
        const scaleFactor = 3;
        const barWidth = 10;

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
        // svg
        //     .selectAll("text").select(".upVotesText")
        //     .data(upvotes)
        //     .enter()
        //     .append("text")
        //     .attr("class", "upVotesText")
        //     .style("font-size", 12)
        //     .attr("fill", "#54cf55")
        //     .attr("x", (d, i) => i * 43 + 21)
        //     .attr('y', (d, i) => {
        //         return h - 18 - d * scaleFactor - 10;
        //     })
        //     .text(d => d);
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
        // svg
        //     .selectAll("text").select(".downVotesText")
        //     .data(downvotes)
        //     .enter()
        //     .append("text")
        //     .attr("class", "downVotesText")
        //     .style("font-size", 12)
        //     .attr("fill", "#ec5252")
        //     .attr("x", (d, i) => i * 43 + 35)
        //     .attr('y', (d, i) => {
        //         return h - 18 - d * scaleFactor - 10;
        //     })
        //     .text(d => d);
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
        // svg
        //     .selectAll("text").select(".viewsText")
        //     .data(views)
        //     .enter()
        //     .append("text")
        //     .attr("class", "viewsText")
        //     .style("font-size", 12)
        //     .attr("fill", "navy")
        //     .attr("x", (d, i) => i * 43 + 41)
        //     .attr('y', (d, i) => {
        //         return h - 18 - d * scaleFactor - 10;
        //     })
        //     .text(d => d);

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