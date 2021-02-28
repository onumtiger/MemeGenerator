import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { MemesList, SlideShow, FilterMemes } from '../components';
import api from '../api';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import '../style/View.scss';

/**
 * hierarchically first view
 */
export default class View extends Component {

    constructor(props) {
        super(props);

        this.state = {
            memes: [],
            isLoading: true
        };
        this.filters = {
            searchTerm: null,
            filter: null,
            sorting: "default"
        };
        this.initialMemes = [];
        this.wasJustUpdated = false;

        let { path, url } = this.props.match;
        this.routePath = path;
        this.routeURL = url;

        //this binding for React event handlers
        [
            'triggerMemeListUpdate',
            'wasMemeListJustUpdated',
            'getAllViews',
            'setFilters',
        ].forEach((handler) => {
            this[handler] = this[handler].bind(this);
        });
    }

    /**
     * triggers when filters have to be applied
     */
    triggerMemeListUpdate() {
        this.applyFilters();
    }

    /**
     * updates the current meme list
     * @param {*} newArray 
     */
    updateMemeList(newArray = this.state.memes) {
        this.setState({ memes: newArray });
        this.wasJustUpdated = true;
    }

    /**
     * set filter 
     * @param {*} searchTerm 
     * @param {*} filter 
     * @param {*} sorting 
     */
    setFilters(searchTerm, filter, sorting) {
        this.filters = { searchTerm, filter, sorting };
        this.applyFilters();
    }

    /**
     * apply the chosen filter
     */
    applyFilters() {
        let newArray = [...this.initialMemes];

        //search by keyword
        if (this.filters.searchTerm) {
            newArray = newArray.filter(meme => (
                meme.name.toLowerCase().includes(this.filters.searchTerm.toLowerCase())
            ));
        }

        //filter by format: checks for strings ending on'.', followed by the string (or strings separated by '|') in filter
        if (this.filters.filter) {
            newArray = newArray.filter(meme => (
                meme.url.match(new RegExp(`.+\\.(${this.filters.filter})$`, 'i'))
            ));
        }

        switch (this.filters.sorting) {
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
                    ((b.stats.upvotes.length || 1) / (b.stats.downvotes.length || 1)) - ((a.stats.upvotes.length || 1) / (a.stats.downvotes.length || 1))
                ));
                break;
            case 'worstRating':
                newArray.sort((a, b) => (
                    ((a.stats.upvotes.length || 1) / (a.stats.downvotes.length || 1)) - ((b.stats.upvotes.length || 1) / (b.stats.downvotes.length || 1))
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
                    (Math.random() * 2) - 1
                ));
                break;
        }

        this.updateMemeList(newArray);
    }

    /**
     * check if there was any update
     */
    wasMemeListJustUpdated() {
        if (this.wasJustUpdated) {
            this.wasJustUpdated = false;
            return true;
        } else {
            return false;
        }
    }

    /**
     * get the sum of views of all memes for later in the statistics
     */
    getAllViews() {
        //create an empty array to fill in later
        let viewsOfAllMemes = [];

        //push view values of all initial memes in the empty `viewsOfAllMemes`array
        for (var i = 0; i < this.state.memes.length; i++) {
            viewsOfAllMemes.push(this.state.memes[i].stats.views);
        }

        //add all view values in `viewsOfAllMemes`array together and return the result
        return viewsOfAllMemes.reduce((pv, cv) => pv + cv, 0);
    }

    /**
     * get memes from database
     */
    componentDidMount = async () => {
        try {
            //TODO: actual userid...
            let response = await api.getAllMemes(0);
            this.initialMemes = response.data.data;
            this.setState({
                memes: response.data.data,
                isLoading: false
            });
        } catch (err) {
            console.log('Failed to get memes: ', err);
        }
    }

    render() {
        return (
            <div id="view-page-wrapper">
                {this.state.isLoading ? (
                    <div id="view-page-loader">
                        <Loader type="Grid" height={500} width={500} color="#7ab2e1" visible={true} />
                    </div>
                ) : (
                        <>
                            <FilterMemes setFilters={this.setFilters} />
                            <Switch>
                                <Route path={this.routePath} exact>
                                    <MemesList memes={this.state.memes} triggerMemeListUpdate={this.triggerMemeListUpdate} />
                                </Route>
                                <Route path={this.routePath + '/:memeId'} exact children={
                                    //nasty workaround: it would be nicer to just have the MemesList JSX element as JSX children without resorting to the explicit children prop, but then we'd loose access to the routeprops passed to the children :/
                                    (routeProps) => (
                                        <SlideShow {...routeProps}
                                            urlPath={this.routePath}
                                            memes={this.state.memes}
                                            wasMemeListJustUpdated={this.wasMemeListJustUpdated}
                                            triggerMemeListUpdate={this.triggerMemeListUpdate}
                                            getAllOtherViews={this.getAllViews}
                                        />
                                    )
                                } />
                            </Switch>
                        </>
                    )}
            </div >
        )
    }
}