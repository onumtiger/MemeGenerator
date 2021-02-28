import React from "react";
import {VotesPieChart, ViewsPieChart, MemeBarChart} from '.';

/**
 * MemeStatistics: includes barchart for up-, downvotes and views, piechart for up- and downvotes and piechart for the portion of views
 */
export default class MemeStatisticsChart extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let sumOtherViews = this.props.getAllOtherViews();

        return (
            <div>
                <MemeBarChart
                    upvotes={this.props.upvotes}
                    downvotes={this.props.downvotes}
                    views={this.props.views}
                    date={this.props.date}
                />
                <VotesPieChart
                    upvotes={this.props.sumUpvotes}
                    downvotes={this.props.sumDownvotes}
                />
                <ViewsPieChart
                    views={this.props.sumViews}
                    otherViews={sumOtherViews}
                />
            </div>
        );
    }
}