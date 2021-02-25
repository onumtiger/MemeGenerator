export default class TextBox {
    constructor(canvasRef, x, y, t, fs, cr, cg, cb, b=false, i=false, ff="Impact"){
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
    getColorString(r, g, b){
        return `rgb(${r},${g},${b})`;
    }
    contains(cx, cy){
        return (cx >= this.startX-this.textBoxPadding && cx <= this.startX+this.width+this.textBoxPadding
             && cy >= this.startY-this.textBoxPadding && cy <= this.startY+this.height+this.textBoxPadding);
    }
    calcDimensions(){
        //get the canvas drawing context
        let c = this.canvasRef.current.getContext('2d');
        //estimate text width given the font params
        let font = `${this.italic ? "italic" : "normal"} ${this.bold ? "bold" : "normal"} ${this.fontSize}px/1 ${this.fontFace}`
        c.font = font;
        let text = this.text || '.'; //empty box should still have dimensions
        if(this.italic) text += '.'; //italic text tends to extend beyond the natural bonds, so let's add a virtual character to emulate the effect

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
    disable(){
        this.disabled = true;
    }
    setController(el){
        this.controller = el;
    }
    updateText(text){
        this.text = text;
        this.calcDimensions();
    }
    updateFontSize(fs){
        this.fontSize = fs;
        this.calcDimensions();
    }
    updateColor(cr, cg, cb){
        this.colorR = cr;
        this.colorG = cg;
        this.colorB = cb;
    }
    updateBold(b){
        this.bold = b;
        this.calcDimensions();
    }
    updateItalic(i){
        this.italic = i;
        this.calcDimensions();
    }
    updateFontFamily(ff){
        this.fontFace = ff;
        this.calcDimensions();
    }
    setDragAnchor(mx, my){
        this.dragOffsetX = mx - this.startX;
        this.dragOffsetY = my - this.startY;
    }
    moveTo(mx, my){
        this.startX = mx - this.dragOffsetX;
        this.startY = my - this.dragOffsetY;
    }
    drawText(){
        let c = this.canvasRef.current.getContext('2d');

        c.font = `${this.italic ? "italic" : "normal"} ${this.bold ? "bold" : "normal"} ${this.fontSize}px/1 ${this.fontFace}`;
        c.fillStyle = this.getColorString(this.colorR, this.colorG, this.colorB);
        c.strokeStyle = "black";
        c.shadowColor = "black";
        c.shadowBlur = 5;
        c.textBaseline = "top";
        c.lineWidth = 4;

        c.strokeText(this.text,this.startX,this.startY); //draw the font outline with shadow
        c.shadowBlur = 0;
        c.fillText(this.text,this.startX,this.startY); //draw the filled font without shadow
    }
    drawOutline(color){
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
    getText(){
        return this.text;
    }
    getX(){
        return this.startX;
    }
    getY(){
        return this.startY;
    }
    getFontSize(){
        return this.fontSize;
    }
    getBold(){
        return this.bold;
    }
    getItalic(){
        return this.italic;
    }
    getFontFace(){
        return this.fontFace;
    }
    getColorR(){
        return this.colorR;
    }
    getColorG(){
        return this.colorG;
    }
    getColorB(){
        return this.colorB;
    }
}