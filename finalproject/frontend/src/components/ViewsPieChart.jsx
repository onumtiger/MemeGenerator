import React from "react";
import * as d3 from "d3";
import '../style/globalStyle.css';

class ViewsPieChart extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {


        const { views, otherViews } = this.props;
        const portionOtherViews = otherViews-views;
        var data = [views, portionOtherViews];
        const w = 300;
        const h = 200;
        var radius = Math.min(w, h) / 2     // ensure that the generated pie will fit into the bounds of the SVG

        const svg = d3
            .select(".piechart2")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .attr("class", "pie")
        var g = svg.append("g").attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");    //group pie elements together

        //color scale
        var color = d3.scaleOrdinal(['navy', 'lightgrey']);

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

    render() {
        let {views, otherViews} = this.props;
        //get the portion value of the current meme
        //only divide with sum the of other views if it's not 0
        let percentageView = (otherViews ? ((views * 100) / otherViews) : 100 );

        return (
            <div>
                <div className="piechart2">
                    <h4>Portion of views</h4>
                </div>
                <div className="legende">
                    <div className="viewsColor"></div> views: {(Math.round(percentageView * 100) / 100).toFixed(2)}%
                    <div className="otherViewsColor"></div> views of other memes
                </div>
            </div>
        );
    }
}
export default ViewsPieChart;