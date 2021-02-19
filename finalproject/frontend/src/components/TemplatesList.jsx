import React, { createRef } from 'react';
import '../style/TemplateList.scss';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import api from '../api';

export default class TemplatesList extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            templates: []
        }
    }

    handleTemplateClick(e){
        let src = e.target.src;
        this.props.handleTemplateSelection(src);
    }

    componentDidMount = async () => {
        let templatesArray = await api.getAllTemplates();
        if (templatesArray.data.success) this.setState({
            templates: templatesArray.data.data,
            isLoading: false
        });
    }

    render(){
        return (
            <div>
                <div id="template-container">
                    {this.state.isLoading ? (
                        <div id="loader">
                            <Loader type="ThreeDots" height={200} width={200} color="#7ab2e1" visible={true} />
                        </div>
                    ) : (
                        this.state.templates.map((t)=>(
                            <img src={t.url} alt={t.name} title={t.name} id={'template_'+t._id} onClick={this.handleTemplateClick} />
                        ))
                    )}
                    <img id="template-plus" src="/ui/plus.png" alt="Add your own template" title="Add your own template" onClick={this.props.handlePlusButtonClick} />
                </div>
            </div>
        );
    }
}