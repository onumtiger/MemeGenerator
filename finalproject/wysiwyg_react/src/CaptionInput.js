import React from 'react';

export default class CaptionInput extends React.Component {
    render(){
        return (
        <li key={'captionInputLi'+this.props.textBoxIndex}>
            <details>
                <summary>
                    <input class="in-caption" type="text" placeholder="Please enter a caption..." />
                    <button type="button" class="in-caption-delete" title="Remove this caption">&#10006;</button>
                </summary>
                <div class="in-caption-formatting-wrapper">
                    <table class="in-caption-formatting-table">
                        <tbody>
                            <tr>
                                <th>Font Size:</th>
                                <td>
                                    <label>
                                        <input type="range" name="fontSize" min="10" max="200" value="60" step="1" />
                                        <span class="label-fontSize">60px</span>
                                    </label>
                                    <label>
                                        <input type="checkbox" name="bold" />
                                        bold
                                    </label>
                                </td>
                            </tr>
                            <tr>
                                <th>Font Color:</th>
                                <td>
                                    <label>
                                        <abbr title="Red color value (0-255)">R</abbr>:
                                        <input type="range" name="colorR" min="0" max="255" value="255" step="1" />
                                        <span class="label-colorR">255</span>
                                    </label>
                                    <label>
                                        <abbr title="Green color value (0-255)">G</abbr>:
                                        <input type="range" name="colorG" min="0" max="255" value="255" step="1" />
                                        <span class="label-colorG">255</span>
                                    </label>
                                    <label>
                                        <abbr title="Blue color value (0-255)">B</abbr>:
                                        <input type="range" name="colorB" min="0" max="255" value="255" step="1" />
                                        <span class="label-colorB">255</span>
                                    </label>
                                </td>
                            </tr>
                            <tr>
                                <th>Font Face:</th>
                                <td>
                                    <select name="fontFace">
                                        <option value="Impact" selected>Impact</option>
                                        <option value="Arial">Arial</option>
                                        <option value="Verdana">Verdana</option>
                                        <option value="Helvetica">Helvetica</option>
                                        <option value="Tahoma">Tahoma</option>
                                        <option value="Trebuchet MS">Trebuchet MS</option>
                                        <option value="Times New Roman">Times New Roman</option>
                                        <option value="Georgia">Georgia</option>
                                        <option value="Garamond">Garamond</option>
                                        <option value="Courier New">Courier New</option>
                                        <option value="Brush Script MT">Brush Script MT</option>
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </details>
        </li>
        );
    }
}