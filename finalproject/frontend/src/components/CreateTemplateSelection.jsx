import '../style/CreateTemplateSelection.scss';

export default function CreateTemplateSelection(props) {
    return (
        <>
            <h3>How Do You Want To Create Your Template?</h3>
            <table id="create-template-selection-table">
                <tbody>
                    <tr>
                        <td>
                            <button type="button" id="btn-upload" onClick={props.handleUploadButtonClick}>
                                <big>Upload External Image</big>
                                <hr />
                                <small>Upload a local image from your PC, a public image file from the web, or a screenshot of an external webpage</small>
                            </button>
                        </td>
                        <td>
                            <button type="button" id="btn-create" onClick={props.handleCreateButtonClick}>
                                <big>Create Your Own Image</big>
                                <hr />
                                <small>Create your own template as a drawing, with the option to include a live snapshot from your webcam</small>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}