import React, { createRef } from 'react';
import {DrawTemplate, WYSIWYGEditor, TemplatesList, CreateTemplateSelection, UploadTemplate, TemplateStatisticsChart, DraftList} from '../components';
import api from '../api';
import '../style/CreateCustom.scss';

export default class CreateCustom extends React.Component {
    constructor(props){
        super(props);

        this.editorRef = createRef();
        this.initialTemplateSrc = "";
        this.initialTemplateId = -1;

        this.state = {
            showTemplateSelection: false,
            showUploadTemplate: false,
            showDrawTemplate: false,
            showEditor: false,
            templateListData: {
                isLoading: true,
                templates: []
            },
            showStats: false,
            templateStats: {
                upvotes: [],
                downvotes: [],
                uses: [],
                date: []
            },
            selectedDraft: null
        };
        
        //this binding for React event handlers
        [
            'letAddTemplate',
            'selectTemplate',
            'selectTemplateUpload',
            'selectTemplateCreation',
            'handleDraftSelection',
        ].forEach((handler)=>{
            this[handler] = this[handler].bind(this);
        });
    }

    letAddTemplate(e){
        this.setState({
            showTemplateSelection: true,
            showUploadTemplate: false,
            showDrawTemplate: false
        });
    }

    selectTemplateUpload(){
        this.setState({
            showTemplateSelection: false,
            showUploadTemplate: true,
        });
    }

    selectTemplateCreation(){
        this.setState({
            showTemplateSelection: false,
            showDrawTemplate: true
        });
    }

    selectTemplate(src, id){
        if (this.state.showEditor){ //don't rerender the editor, or we will lose the input!
            this.editorRef.current.setTemplateImage(src, id);
        }else{
            this.initialTemplateSrc = src;
            this.initialTemplateId = id;
            this.setState({
                showEditor: true
            });
        }
        this.setState({
            showTemplateSelection: false,
            showUploadTemplate: false,
            showDrawTemplate: false,
            showStats: false
        });
        this.updateTemplateStats(id);
    }

    handleDraftSelection(draft){
        this.initialTemplateId = draft.template_id;
        let draftTemplate = this.state.templateListData.templates.find((t)=>(t._id == draft.template_id));
        if(draftTemplate){
            this.initialTemplateSrc = draftTemplate.url;
            this.setState({
                selectedDraft: draft,
                showEditor: true
            });
        }
    }
    
    updateTemplateStats = async (templateID) => {
        try{
            let response = await api.getStatsForTemplate(templateID);
            let templateStats = response.data.data;
            let days = templateStats.days;
    
            var upvotes = [];
            var downvotes = [];
            var uses = [];
            var date = [];
    
            for (var i = 0; i < days.length; i++) {
                upvotes.push(days[i].upvotes)
                downvotes.push(days[i].downvotes)
                uses.push(days[i].uses)
                date.push(days[i].date)
            }
            this.setState({
                templateStats: {upvotes, downvotes, uses, date},
                showStats: true
            });
        }catch(err){         
            console.log('Failed to get Stats: ',err);
        }
    }

    loadTemplatesIntoList = async ()=>{
        this.setState({
            templateListData: {
                templates: [],
                isLoading: true
            }
        });
        try{
            //TODO actual userid...
            let templatesArray = await api.getAllTemplates(0);
            if (templatesArray.data.success){
                this.setState({
                    templateListData: {
                        templates: templatesArray.data.data,
                        isLoading: false
                    }
                });
            }else{
                console.log('Templates could not be loaded!', templatesArray.data);
            }
        }catch(err){
            console.log('Failed to load templates: ',err);
        }
    }

    changeSelection(selectedElem){
        let prevSelection = document.querySelector('#template-container .selected');
        if (prevSelection) prevSelection.classList.remove('selected');
        if(selectedElem) selectedElem.classList.add('selected');
    }

    handlePublishedTemplate = async (templateID)=>{
        await this.loadTemplatesIntoList();
        let selectedElem = document.querySelector('#create-custom-page-wrapper #template_'+templateID);
        this.changeSelection(selectedElem);
        this.selectTemplate(selectedElem.src, templateID);
    }

    componentDidMount(){
        this.loadTemplatesIntoList();
    }

    render(){
        return (
            <div id="create-custom-page-wrapper">
                <h2>Custom Meme Creation</h2>
                <TemplatesList data={this.state.templateListData} handleTemplateSelection={this.selectTemplate} handlePlusButtonClick={this.letAddTemplate} handleSelectionChange={this.changeSelection} />
                {this.state.showStats && 
                    <TemplateStatisticsChart
                        upvotes={this.state.templateStats.upvotes}
                        downvotes={this.state.templateStats.downvotes}
                        uses={this.state.templateStats.uses}
                        date={this.state.templateStats.date}
                    >
                    </TemplateStatisticsChart>
                }
                <DraftList handleDraftSelection={this.handleDraftSelection} />
                {this.state.showTemplateSelection &&
                    <CreateTemplateSelection handleUploadButtonClick={this.selectTemplateUpload} handleCreateButtonClick={this.selectTemplateCreation} />
                }
                {this.state.showUploadTemplate &&
                    <UploadTemplate handlePublishing={this.handlePublishedTemplate} />
                }
                {this.state.showDrawTemplate &&
                    <DrawTemplate handlePublishing={this.handlePublishedTemplate} />
                }
                {this.state.showEditor &&
                    <WYSIWYGEditor ref={this.editorRef} templateImagePath={this.initialTemplateSrc} templateImageId={this.initialTemplateId} draft={this.state.selectedDraft} history={this.props.history} />
                }
            </div>
        );
    }
}