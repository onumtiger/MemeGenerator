import React, { Component } from 'react';
import styled from 'styled-components';

const Select = styled.select`
width:20%;
margin-left: 10px;
height:10%;
  box-sizing:border-box;

`
const Search = styled.input`
width:20%;
height:10%;
  box-sizing:border-box;
`

const CenterSearch = styled.div`
margin: auto;
  width: 45%;
  padding: 10px;
  text-align: center;
`

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

        //filter by format - TODO go through different options for options like "image", maybe with array.some()...
        if(this.selection.filter){
            newArray = newArray.filter(meme=> (
                meme.url.toLowerCase().includes(this.selection.filter.toLowerCase())
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
        }

        this.props.handleMemeListUpdate(newArray);
    }

    render() {
        return (
            <CenterSearch>
                <Search type="text" id="search" name="search" placeholder="Search for a meme title..." onChange={this.startSearch}></Search>

                Sort by: <Select name="sort" id="sort" onChange={this.sortMemeList}>
                    <option value="default">default order</option>
                    <option value="newest">newest</option>
                    <option value="oldest">oldest</option>
                    <option value="bestRating">rating (best)</option>
                    <option value="worstRating">rating (worst)</option>
                    <option value="mostViewed">views (most)</option>
                    <option value="leastViewed">views (least)</option>
                </Select>
                Filter by Format: <Select name="filter" id="filter" onChange={this.setFilter}>
                    <option value="all">all</option>
                    <option value="jpg">jpg</option>
                    <option value="png">png</option>
                    <option value="gif">gif</option>
                    <option value="image">image</option>
                    <option value="template">template</option>
                    <option value="video">video</option>
                </Select>
            </CenterSearch>
        )
    }
}
