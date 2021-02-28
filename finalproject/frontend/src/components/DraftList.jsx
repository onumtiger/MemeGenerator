import React from 'react';
import '../style/DraftList.scss';
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import api from '../api';
import createTokenProvider from '../api/createTokenProvider';

export default class DraftList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            drafts: []
        };

        //this binding for React event handlers
        [
            'handleDraftClick'
        ].forEach((handler) => {
            this[handler] = this[handler].bind(this);
        });
    }

    handleDraftClick(e) {
        let elem = e.target;
        let id = elem.dataset.draftid;
        
        let draft = this.state.drafts.find((d)=>(d._id == id));

        this.props.handleDraftSelection(draft);
    }

    componentDidMount = async ()=>{
        try{
            let userId = createTokenProvider.userIdFromToken();
            let draftArray = await api.getAllDrafts(userId);
            if (draftArray.data.success){
                this.setState({
                    drafts: draftArray.data.data,
                    isLoading: false
                });
            }else{
                console.log('Drafts could not be loaded!', draftArray.data);
            }
        }catch(err){
            console.log('Failed to load drafts: ',err);
        }
    }

    render() {
        return (
            <div id="drafts-wrapper">
                {this.state.isLoading ? (
                    <div id="loader">
                        <Loader type="ThreeDots" height={200} width={200} color="#7ab2e1" visible={true} />
                    </div>
                ) : (
                this.state.drafts.length > 0 ? (<>
                    <h3>You can also finish your saved drafts:</h3>
                    <ul>
                        {this.state.drafts.map((d) => {
                            let captionTexts=[];
                            d.captions.forEach(cap => {
                                captionTexts.push(cap.text);
                            });
                            return (<li className="draft" key={d._id} data-draftid={d._id} onClick={this.handleDraftClick}>"{d.title}" - Captions: {captionTexts.join(', ')}</li>)
                            })}
                    </ul>
                    </>) : <></>
                )
                }
            </div>
        );
    }
}