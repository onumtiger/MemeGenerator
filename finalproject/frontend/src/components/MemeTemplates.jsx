import React from 'react';
import ReactDOM from 'react-dom';
import '../style/MemeTemplates.css';

var listOfImages =[];

class MemeTemplates extends React.Component {
    constructor(props) {
        super(props)
    }

    importAll(r) {
        return r.keys().map(r);
    }
    componentWillMount() {
        listOfImages = this.importAll(require.context('../images/', false, /\.(png|jpe?g|svg)$/));
    }

    render() {
        return (
            <div class="wrapper">
                <div class="memeContainer">
                    {
                        listOfImages.map(
                            (image, index) => <img key={index} src={image} alt={`meme`+ index}></img>
                        )
                    }
                </div>
            </div>
        )
    }
}

export default MemeTemplates