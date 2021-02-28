/**
 * TextBox is used for the WYSIWG Editor
 */
export default class TextBox {

    constructor(canvasRef, x, y, t, fs, cr, cg, cb, b, i, ff) {
        this.textBoxPadding = 8; //buffer (in pixels) between textbox border and actual font
        this.canvasRef = canvasRef; //React reference to the canvas
        this.startX = x; //top-left x
        this.startY = y; //top-left y
        this.text = t; //caption string
        this.fontSize = fs; //font size (px)
        this.colorR = cr; //text fill color, red component
        this.colorG = cg; //text fill color, green component
        this.colorB = cb; //text fill color, blue component
        this.bold = b; //boolean for bold text
        this.italic = i; //boolean for italic text
        this.fontFace = ff; //font face
        this.dragOffsetX = 0; //distance between the mousedown x coord and startX for anchored drag & drop
        this.dragOffsetY = 0; //distance between the mousedown y coord and startY for anchored drag & drop
        this.calcDimensions();
        this.disabled = false; //disabled (removed) boxes will be ignored for interaction and rendering
        this.controller = null; //wrapper HTMLDetailsElement (caption box) for the controlling inputs, can be set later via setController()
    }

    /**
     * @param {Number} r - red
     * @param {Number} g - green
     * @param {Number} b - blue
     * 
     * @returns {String} - color as string
     */
    getColorString(r, g, b) {
        return `rgb(${r},${g},${b})`;
    }

    /**
     * @param {Number} cx - X
     * @param {Number} cy - Y
     * 
     * @returns {Boolean} - contains: true/false
     */
    contains(cx, cy) {
        return (cx >= this.startX - this.textBoxPadding && cx <= this.startX + this.width + this.textBoxPadding
            && cy >= this.startY - this.textBoxPadding && cy <= this.startY + this.height + this.textBoxPadding);
    }

    /**
     * calculate the dimensions
     */
    calcDimensions() {
        //get the canvas drawing context
        let c = this.canvasRef.current.getContext('2d');
        //estimate text width given the font params
        let font = `${this.italic ? "italic" : "normal"} ${this.bold ? "bold" : "normal"} ${this.fontSize}px/1 ${this.fontFace}`
        c.font = font;
        let text = this.text || '.'; //empty box should still have dimensions
        if (this.italic) text += '.'; //italic text tends to extend beyond the natural bonds, so let's add a virtual character to emulate the effect

        //apply estimate width / height

        //old version: 
        // let textMeasurement = c.measureText(text);
        // this.width = textMeasurement.width;
        // this.height = this.fontSize*0.9; //determined via testing

        //new version: create a new element out of the viewport, write the text in it and measure its size
        let newElem = document.createElement('span');
        newElem.innerText = text;
        newElem.style.font = font;
        newElem.style.position = 'absolute';
        newElem.style.whiteSpace = 'nowrap';
        newElem.style.left = '150%';
        document.body.appendChild(newElem);
        this.width = newElem.clientWidth;
        this.height = newElem.clientHeight;
        document.body.removeChild(newElem);
    }

    /**
     * disable
     */
    disable() {
        this.disabled = true;
    }

    /**
     * sets the controller
     * @param {Element} el - given element
     */
    setController(el) {
        this.controller = el;
    }

    /**
     * updates the text
     * @param {String} text - text as String
     */
    updateText(text) {
        this.text = text;
        this.calcDimensions();
    }

    /**
     * updates the font size
     * @param {Number} fs - font size
     */
    updateFontSize(fs) {
        this.fontSize = fs;
        this.calcDimensions();
    }

    /**
     * updates the color
     * @param {Number} cr - red
     * @param {Number} cg - green
     * @param {Number} cb - blue
     */
    updateColor(cr, cg, cb) {
        this.colorR = cr;
        this.colorG = cg;
        this.colorB = cb;
    }

    /**
     * set to bold 
     * @param {Boolean} b - true -> bold
     */
    updateBold(b) {
        this.bold = b;
        this.calcDimensions();
    }

    /**
     * set to italic
     * @param {Boolean} i - true -> italic
     */
    updateItalic(i) {
        this.italic = i;
        this.calcDimensions();
    }

    /**
     * update the font family
     * @param {String} ff - font family
     */
    updateFontFamily(ff) {
        this.fontFace = ff;
        this.calcDimensions();
    }

    /**
     * set the drag anchor
     * @param {Number} mx - X
     * @param {Number} my - Y
     */
    setDragAnchor(mx, my) {
        this.dragOffsetX = mx - this.startX;
        this.dragOffsetY = my - this.startY;
    }

    /**
     * move to X/Y
     * @param {Number} mx - X
     * @param {Number} my - Y
     */
    moveTo(mx, my) {
        this.startX = mx - this.dragOffsetX;
        this.startY = my - this.dragOffsetY;
    }

    /**
     * draw the text
     */
    drawText() {
        let c = this.canvasRef.current.getContext('2d');

        c.font = `${this.italic ? "italic" : "normal"} ${this.bold ? "bold" : "normal"} ${this.fontSize}px/1 ${this.fontFace}`;
        c.fillStyle = this.getColorString(this.colorR, this.colorG, this.colorB);
        c.strokeStyle = "black";
        c.shadowColor = "black";
        c.shadowBlur = 5;
        c.textBaseline = "top";
        c.lineWidth = 4;

        c.strokeText(this.text, this.startX, this.startY); //draw the font outline with shadow
        c.shadowBlur = 0;
        c.fillText(this.text, this.startX, this.startY); //draw the filled font without shadow
    }

    // TODO set color TYPE
    /**
     * draw the outline
     * @param {*} color - color
     */
    drawOutline(color) {
        //get the canvas drawing context
        let c = this.canvasRef.current.getContext('2d');

        c.lineWidth = 1;
        c.strokeStyle = color;
        c.beginPath();
        c.moveTo(this.startX - this.textBoxPadding,
            this.startY - this.textBoxPadding);
        c.lineTo(this.startX + this.textBoxPadding + this.width,
            this.startY - this.textBoxPadding);
        c.lineTo(this.startX + this.textBoxPadding + this.width,
            this.startY + this.textBoxPadding + this.height)
        c.lineTo(this.startX - this.textBoxPadding,
            this.startY + this.textBoxPadding + this.height);
        c.closePath();
        c.stroke();
    }

    /**
     * get the text 
     */
    getText() {
        return this.text;
    }

    /**
     * get X
     */
    getX() {
        return this.startX;
    }

    /**
     * get Y
     */
    getY() {
        return this.startY;
    }

    /**
     * get the font size
     */
    getFontSize() {
        return this.fontSize;
    }

    /**
     * get bold
     */
    getBold() {
        return this.bold;
    }

    /**
     * get italic
     */
    getItalic() {
        return this.italic;
    }

    /**
     * get font face
     */
    getFontFace() {
        return this.fontFace;
    }

    /**
     * get color red
     */
    getColorR() {
        return this.colorR;
    }

    /**
     * get color green
     */
    getColorG() {
        return this.colorG;
    }

    /**
     * get color blue
     */
    getColorB() {
        return this.colorB;
    }
}