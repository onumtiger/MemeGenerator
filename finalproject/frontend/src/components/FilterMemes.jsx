import React, { Component } from 'react';
import '../style/FilterMemes.scss';

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

        ].forEach((handler)=>{
            this[handler] = this[handler].bind(this);
        });
    }

    startSearch(e) {
        let keyword = e.target.value;
        this.selection.searchTerm = keyword.length ? keyword : null;
        this.processSelection();
    }

    setFilter(e){
        let filter = e.target.value;
        this.selection.filter = filter!="all" ? filter : null;
        this.processSelection();
    }

    sortMemeList(e){
        this.selection.sorting = e.target.value;
        this.processSelection();
    }

    processSelection(){
        let initialList = this.props.memes;
        let newArray = [...initialList];

        //search by keyword
        if(this.selection.searchTerm){
            newArray = newArray.filter(meme => (
                meme.name.toLowerCase().includes(this.selection.searchTerm.toLowerCase())
            ));
        }

        //filter by format: checks for strings ending on'.', followed by the string (or strings separated by '|') in this.selection.filter
        if(this.selection.filter){
            newArray = newArray.filter(meme=> (
                meme.url.match(new RegExp(`.+\\.(${this.selection.filter})$`,'i'))
            ));
        }

        switch(this.selection.sorting){
            default:
                break;
            case 'newest':
                newArray.sort((a, b) => (
                    new Date(b.creationDate) - new Date(a.creationDate)
                    ));
                break;
            case 'oldest':
                newArray.sort((a, b) => (
                    new Date(a.creationDate) - new Date(b.creationDate)
                    ));
                break;
            case 'bestRating':
                newArray.sort((a, b) => (
                    b.stats.upvotes.length - a.stats.upvotes.length
                    ));
                break;
            case 'worstRating':
                newArray.sort((a, b) => (
                    b.stats.downvotes.length - a.stats.downvotes.length
                    ));
                break;
            case 'mostViewed':
                newArray.sort((a, b) => (
                    b.stats.views - a.stats.views
                    ));
                break;
            case 'leastViewed':
                newArray.sort((a, b) => (
                    a.stats.views - b.stats.views
                    ));
                break;
            case 'random':
                newArray.sort((a, b) => (
                    //the sorting function works by recognizing return values <0, ==0 or >0. So let's give it a random number between -1 and +1 for random sorting:
                    (Math.random()*2) - 1
                    ));
                break;
        }

        this.props.handleMemeListUpdate(newArray);
    }

    render() {
        return (
            <div id="filter-wrapper">
                <input type="text" id="search" name="search" placeholder="Search for a meme title..." onChange={this.startSearch}></input>

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
