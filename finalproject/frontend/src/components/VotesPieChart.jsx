import React from "react";
import * as d3 from "d3";
import '../style/Charts.scss';

export default class VotesPieChart extends React.Component {
    constructor(props) {
        super(props);
    }

    drawChart() {
        const { upvotes, downvotes } = this.props;
        var data = [upvotes, downvotes];
        const w = 300;
        const h = 200;
        var radius = Math.min(w, h) / 2     // ensure that the generated pie will fit into the bounds of the SVG

        let previousChart = document.querySelector(".votespiechart .piechart svg")
        if(previousChart) previousChart.remove();

        const svg = d3
            .select(".votespiechart .piechart")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .attr("class", "pie")
        var g = svg.append("g").attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");    //group pie elements together

        //color scale
        var color = d3.scaleOrdinal(['#54cf55', '#ec5252']);

        // Generate the pie
        var pie = d3.pie();

        // Generate the arcs (paths that will create the pie's wedges)
        var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        //Generate groups
        var arcs = g.selectAll("arc")
            .data(pie(data))
            .enter()
            .append("g")
            .attr("class", "arc")

        //Draw arc paths
        arcs.append("path")
            .attr("fill", function (d, i) {
                return color(i);
            })
            .attr("d", arc);
    }

    componentDidMount(){
        this.drawChart();
    }

    componentDidUpdate(){
        this.drawChart();
    }

    render() {
        return (
            <div className="piechart-wrapper votespiechart">
                <div className="piechart">
                    <h4>Up- and downvotes overall</h4>
                </div>
                <div className="legende">
                    <div className="upvoteColor"></div> upvotes: {this.props.upvotes}
                    <div className="downvoteColor"></div> downvotes: {this.props.downvotes}
                </div>
            </div>
        );
    }
}
