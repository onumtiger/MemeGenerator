import React from "react";
import '../style/globalStyle.css';
import {VotesPieChart, ViewsPieChart, MemeBarChart} from '.';

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