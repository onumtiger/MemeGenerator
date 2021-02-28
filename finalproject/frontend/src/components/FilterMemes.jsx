import React, { Component } from 'react';
import '../style/FilterMemes.scss';

/**
 * filter memes component
 */
export default class FilterMemes extends Component {

    constructor(props) {
        super(props);

        this.selection = {
            searchTerm: null,
            filter: null,
            sorting: "default"
        };

        //this binding for React event handlers
        [
            'startSearch',
            'setFilter',
            'sortMemeList',

        ].forEach((handler) => {
            this[handler] = this[handler].bind(this);
        });
    }

    /**
     * start the actual search
     * @param {Event} e 
     */
    startSearch(e) {
        let keyword = e.target.value;
        this.selection.searchTerm = keyword.length ? keyword : null;
        this.processSelection();
    }

    /**
     * set the filter
     * @param {Event} e 
     */
    setFilter(e) {
        let filter = e.target.value;
        this.selection.filter = filter != "all" ? filter : null;
        this.processSelection();
    }

    /**
     * sort the meme list according to input
     * @param {Event} e 
     */
    sortMemeList(e) {
        this.selection.sorting = e.target.value;
        this.processSelection();
    }

    /**
     * process the actual selection
     */
    processSelection() {
        this.props.setFilters(this.selection.searchTerm, this.selection.filter, this.selection.sorting);
    }

    render() {
        return (
            <div id="filter-wrapper">
                <input type="text" id="search" name="search" placeholder=" search ..." onChange={this.startSearch}></input>
                <label>Sort by: <select name="sort" id="sort" onChange={this.sortMemeList}>
                    <option value="default">default order</option>
                    <option value="newest">newest</option>
                    <option value="oldest">oldest</option>
                    <option value="bestRating">rating (best)</option>
                    <option value="worstRating">rating (worst)</option>
                    <option value="mostViewed">views (most)</option>
                    <option value="leastViewed">views (least)</option>
                    <option value="random">random order</option>
                </select></label>
                <label>Filter by Format: <select name="filter" id="filter" onChange={this.setFilter}>
                    <option value="all">all</option>
                    <option value="jpg">jpg</option>
                    <option value="png">png</option>
                    <option value="gif">gif</option>
                    <option value="jpg|png|gif">image</option>
                    <option value="mp4|mov">video</option>
                </select></label>
            </div>
        )
    }
}
