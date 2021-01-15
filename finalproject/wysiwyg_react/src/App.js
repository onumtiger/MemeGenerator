import React from 'react';
import WYSIWYGEditor from './WYSIWYGEditor';
import DrawTemplate from './DrawTemplate';
import './app.scss';

export default class App extends React.Component {
    constructor(props){
        super(props);
        this.PAGE_MEME_EDITOR = 1;
        this.PAGE_TEMPLATE_EDITOR = 2;
        this.state = {
            page: this.PAGE_TEMPLATE_EDITOR
        };
    }
    render(){
        let page;
        switch(this.state.page) {
            case this.PAGE_MEME_EDITOR:
            default:
                page = <WYSIWYGEditor templateImagePath="testmeme.png" />;
                break;
            case this.PAGE_TEMPLATE_EDITOR:
                page = <DrawTemplate />
                break;
        }
        return (
            <>
            <nav id="pagenav">
                <ul>
                    <li onClick={()=>{this.setState({page: this.PAGE_TEMPLATE_EDITOR})}}>Draw a Template</li>
                    <li onClick={()=>{this.setState({page: this.PAGE_MEME_EDITOR})}}>Create a Meme</li>
                </ul>
            </nav>
            {page}
            </>
        );
    }
}