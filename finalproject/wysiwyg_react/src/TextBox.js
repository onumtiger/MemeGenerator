export default class TextBox {
    constructor(canvasRef, x, y, t, fs, c, b=false, ff="Impact"){
        this.canvasRef = canvasRef; //React reference to the canvas
        this.startX = x; //top-left x
        this.startY = y; //top-left y
        this.text = t; //caption string
        this.fontSize = fs; //font size (px)
        this.color = c; //text fill color
        this.bold = b; //boolean for bold text
        this.fontFamily = ff; //font family

        this.dragOffsetX = 0; //distance between the mousedown x coord and startX for anchored drag & drop
        this.dragOffsetY = 0; //distance between the mousedown y coord and startY for anchored drag & drop
        this.calcDimensions();
        this.disabled = false; //disabled (removed) boxes will be ignored for interaction and rendering
        this.controller = null; //ref to the wrapper HTMLDetailsElement (caption box) for the controlling inputs, can be set later via setController()
    }
    contains(cx, cy){
        return (cx >= this.startX-textBoxPadding && cx <= this.startX+this.width+textBoxPadding
             && cy >= this.startY-textBoxPadding && cy <= this.startY+this.height+textBoxPadding);
    }
    calcDimensions(){
        //get the canvas drawing context
        let c = this.canvasRef.current.getContext('2d');
        //estimate text width given the font params
        c.font = `${this.bold ? "bold" : "normal"} ${this.fontSize}px ${this.fontFamily}`;
        let textMeasurement = c.measureText(this.text);
        
        //apply estimate width / height
        this.width = textMeasurement.width;
        this.height = this.fontSize*0.9; //determined via testing: this is pretty accurate to give the line height
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
    updateColor(c){
        this.color = c;
    }
    updateBold(b){
        this.bold = b;
        this.calcDimensions();
    }
    updateFontFamily(ff){
        this.fontFamily = ff;
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
}