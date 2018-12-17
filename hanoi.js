function saveSettings() {
    localStorage.setItem("name", $('#setName').val());
	localStorage.setItem("colorpole", $('#colorpole').val());
	localStorage.setItem("colorpole", $('#colorline').val());
	for (i = 1; i<10; i++){
		localStorage.setItem("color"+i, $('#color'+i).val());
	}
	newGame();
}

function getSettings() {
	$('#setName').val(localStorage.getItem("name"));
	if(localStorage.getItem("colorpole") != null){
		$('#colorpole').val(localStorage.getItem("colorpole"));
	}
	if(localStorage.getItem("colorline") != null){
		$('#colorline').val(localStorage.getItem("colorline"));
	}
	for (i = 1; i<10; i++){
		if(localStorage.getItem("color"+i) != null){
			$('#color'+i).val(localStorage.getItem("color"+i));
		}
	}
}

function resetSettings() {
	var answer = confirm("Es werden alle Einstellungen dauerhaft geloescht");
	if (answer){
		localStorage.clear();
		location.reload();
	}
	newGame();
}

$( document ).ready(function() {
    window.addEventListener('resize', resizeElement, false);
	window.addEventListener('orientationchange', resizeElement, false);
	getSettings();
	initializeColorPicker();
	hanoiMain();
	resizeElement();
});

function initializeColorPicker() {
	$("input.color").each(function(){
		$(this).ColorPickerSliders({
              placement: 'right',
			  swatches: ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Grey","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSlateGrey","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"],
			  customswatches: false,
              sliders: false,
			  preventtouchkeyboardonshow: true
            });
		})
}

function resizeElement() {
    var x = document.getElementById('spiel');
    var widthToHeight = 5 / 3;
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    var newWidthToHeight = newWidth / newHeight;
    
    if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
        x.style.height = newHeight + 'px';
        x.style.width = newWidth + 'px';
    } else {
        newHeight = newWidth / widthToHeight;
        x.style.width = newWidth + 'px';
        x.style.height = newHeight + 'px';
    }
}

function hanoiMain() {
    w = 500;
    h = 300;
    this.farben = ["","","","","","","","",""];
    startX = 50;
    spielcanvas = document.getElementById('spiel');
    verhaeltnis = 2;
    spielcanvas.width = w * verhaeltnis;
    spielcanvas.height = h * verhaeltnis;
    spielcanvas.style.width = w + "px";
    spielcanvas.style.height = h + "px";
    canvas2d = spielcanvas.getContext("2d");
    canvas2d.setTransform(verhaeltnis, 0, 0, verhaeltnis, 0, 0);
    dragging = false;
    dragIndex = -1;
    dragHoldX = 0;
    dragHoldY = 0;
	this.speed = 20;
    this.stangen = [];
    this.moveN = 0;
    this.scheibenAnz = 3;
    newGame();
    spielcanvas.addEventListener("mousedown", mouseDownListener, false);
    spielcanvas.addEventListener('touchstart', ontouchstart, false);
    spielcanvas.addEventListener("mousemove", dopointer, false);
}


function chgNumPts(n) {
    this.scheibenAnz = n;
    newGame();
}

function chgSpeed(x) {
    this.speed = 100/x;
}

function zeichneStangen() {
    for (var i = 0; i < this.stangen.length; i++) {
        drawPole(90 + i * 160, 240);
    }
}

function drawPole(x, y) {
    var wd = 150;
    var ht = 140;
    canvas2d.lineWidth = 1;
    canvas2d.strokeStyle = $('#colorline').val();
    canvas2d.fillStyle = $('#colorpole').val();
    canvas2d.beginPath();
    canvas2d.roundRect(x - 3, y - ht, 6, ht, 6, 3);
    canvas2d.roundRect(x - wd / 2, y - 3, wd, 8, 4);
    canvas2d.closePath();
    canvas2d.stroke();
    canvas2d.fill();
}

function newGame() {
    for (i = 1; i<10; i++){
			this.farben[i-1]=$('#color'+i).val();
	}
	chgMoveN(0);
    stopAnim();
    var p0 = [];
    for (var i = scheibenAnz - 1; i >= 0; i--) {
        p0.push(i);
    }
    this.stangen = [p0, [],
        []
    ];
    shapes = [];
    stangen2Shapes();
    drawShapes();
    testSuccess();
    document.getElementById('info').innerHTML = 'Minimale Anzahl: ' + ((1 << scheibenAnz) - 1).toString();
}

function ontouchstart(evt) {
    var touch = evt.targetTouches[0];
    evt.clientX = touch.clientX;
    evt.clientY = touch.clientY;
    evt.touchQ = true;
    mouseDownListener(evt)
}

function ontouchmove(evt) {
    var touch = evt.targetTouches[0];
    evt.clientX = touch.clientX;
    evt.clientY = touch.clientY;
    evt.touchQ = true;
    mouseMoveListener(evt);
    evt.preventDefault();
}

function ontouchend(evt) {
    spielcanvas.addEventListener('touchstart', ontouchstart, false);
    window.removeEventListener("touchend", ontouchend, false);
    if (dragging) {
        dragging = false;
        shapes[dragIndex].shadowQ = false;
        doDrop(dragIndex);
        dragIndex = -1;
        drawShapes();
        window.removeEventListener("touchmove", ontouchmove, false);
    }
}

function dopointer(e) {
    var bRect = spielcanvas.getBoundingClientRect();
    var mouseX = (e.clientX - bRect.left) * (spielcanvas.width / verhaeltnis / bRect.width);
    var mouseY = (e.clientY - bRect.top) * (spielcanvas.height / verhaeltnis / bRect.height);
    var inQ = false;
    for (var i = 0; i < shapes.length; i++) {
        if (hitTest(shapes[i], mouseX, mouseY)) {
            if (topDiskQ(i)) {
                inQ = true;
            }
        }
    }
    if (inQ) {
        document.body.style.cursor = "pointer";
    } else {
        document.body.style.cursor = "default";
    }
}

function mouseDownListener(evt) {
    var i;
    var highestIndex = -1;
    var bRect = spielcanvas.getBoundingClientRect();
    var mouseX = (evt.clientX - bRect.left) * (spielcanvas.width / verhaeltnis / bRect.width);
    var mouseY = (evt.clientY - bRect.top) * (spielcanvas.height / verhaeltnis / bRect.height);
    for (i = 0; i < shapes.length; i++) {
        if (hitTest(shapes[i], mouseX, mouseY)) {
            if (topDiskQ(i)) {
                dragging = true;
                if (i > highestIndex) {
                    dragHoldX = mouseX - shapes[i].x;
                    dragHoldY = mouseY - shapes[i].y;
                    highestIndex = i;
                    dragIndex = i;
                }
            }
        }
    }
    if (dragging) {
        if (evt.touchQ) {
            window.addEventListener('touchmove', ontouchmove, false);
        } else {
            window.addEventListener("mousemove", mouseMoveListener, false);
        }
    }
    if (evt.touchQ) {
        spielcanvas.removeEventListener("touchstart", ontouchstart, false);
        window.addEventListener("touchend", ontouchend, false);
    } else {
        spielcanvas.removeEventListener("mousedown", mouseDownListener, false);
        window.addEventListener("mouseup", mouseUpListener, false);
    }
    if (evt.preventDefault) {
        evt.preventDefault();
    } else if (evt.returnValue) {
        evt.returnValue = false;
    }
    return false;
}

function mouseUpListener(evt) {
    spielcanvas.addEventListener("mousedown", mouseDownListener, false);
    window.removeEventListener("mouseup", mouseUpListener, false);
    if (dragging) {
        dragging = false;
        shapes[dragIndex].shadowQ = false;
        doDrop(dragIndex);
        dragIndex = -1;
        drawShapes();
        window.removeEventListener("mousemove", mouseMoveListener, false);
    }
}

function mouseMoveListener(evt) {
    if (dragIndex < 0) return;
    var bRect = spielcanvas.getBoundingClientRect();
    var mouseX = (evt.clientX - bRect.left) * (spielcanvas.width / verhaeltnis / bRect.width);
    var mouseY = (evt.clientY - bRect.top) * (spielcanvas.height / verhaeltnis / bRect.height);
    var posX = mouseX - dragHoldX;
    var posY = mouseY - dragHoldY;
    shapes[dragIndex].x = posX;
    shapes[dragIndex].y = posY;
    drawShapes(dragIndex);
}

function topDiskQ(n) {
    for (i = 0; i < this.stangen.length; i++) {
        var stange = this.stangen[i];
        if (stange.length > 0) {
            if (n == stange[stange.length - 1]) return true;
        }
    }
    return false;
}

function hitTest(shape, mx, my) {
    if (mx < shape.x) return false;
    if (my < shape.y) return false;
    if (mx > (shape.x + shape.wd)) return false;
    if (my > (shape.y + shape.ht)) return false;
    return true;
}

function makeShapes() {
    shapes = [];
    var left = startX;
    for (var i = 0; i < this.stangen.length; i++) {
        var pole = this.stangen[i];
        for (var j = 0; j < pole.length; j++) {
            var d = pole[j];
            var shp = {
                x: i * 100 + left - d * 10,
                y: 240 - j * 20,
                wd: 20 + d * 20,
                ht: 20,
                pole: i,
                shadowQ: false
            };
            shapes.push(shp);
        }
    }
}

function doDrop(dropNo) {
    var shp = shapes[dropNo];
    var p = Math.round((shp.x - 90) / 160);
    p = Math.max(0, Math.min(p, 2));
    if (p != shp.pole) {
        var okQ = false;
        var pole = this.stangen[p];
        if (pole.length == 0) {
            okQ = true;
        } else {
            var top = pole[pole.length - 1];
            if (dropNo < top) okQ = true;
        }
        if (okQ) {
            chgMoveN(1);
            shp.pole = p;
            this.stangen = [
                [],
                [],
                []
            ];
            for (var i = 0; i < shapes.length; i++) {
                shp = shapes[i];
                this.stangen[shp.pole].unshift(i);
            }
        }
    }
    stangen2Shapes();
    testSuccess();
}

function testSuccess() {
    if (isSuccess()) {
		if ($('#setName').val() != ""){
			$('#name').text("Herzlichen Glückwunsch " +$('#setName').val()+"!");
		}
		$('#modal-success').modal('show');
	}   
}

function isSuccess() {
    
	var p2 = this.stangen[2];
	var p1 = this.stangen[1];
    if (p2.length != scheibenAnz && p1.length != scheibenAnz ) return false;
    for (var i = 0; i < scheibenAnz; i++) {
        var n = scheibenAnz - i - 1;
        if (p2[i] != n && p1[i] != n) return false;
    }
    return true;
}

function chgMoveN(n) {
    if (n == 1) {
        this.moveN++;
    } else {
        this.moveN = 0;
    }
	$('#moves').html('Z&uuml;ge: ' + this.moveN);
}

function stangen2Shapes() {
    for (var i = 0; i < this.stangen.length; i++) {
        var pole = this.stangen[i];
        for (var j = 0; j < pole.length; j++) {
            var d = pole[j];
            var w = 30 + d * 20;
            if (d != dragIndex)
                shapes[d] = {
                    x: 90 + i * 160 - w / 2,
                    y: 240 - j * 16 - 16 - 3,
                    wd: w,
                    ht: 16,
                    pole: i,
                    shadowQ: false
                };
        }
    }
}

function drawShapes(moveNo) {
    moveNo = typeof moveNo !== 'undefined' ? moveNo : -1;
    stangen2Shapes();
    canvas2d = spielcanvas.getContext("2d");
    canvas2d.clearRect(0, 0, spielcanvas.width, spielcanvas.height);
    zeichneStangen();
    canvas2d.lineWidth = 1;
    canvas2d.strokeStyle = "#aaaaaa";
    for (var i = 0; i < shapes.length; i++) {
        if (moveNo == i) {
            canvas2d.lineWidth = 2;
            canvas2d.strokeStyle = "rgba(111, 111, 0, 1)";
        } else {
            canvas2d.lineWidth = 1;
            canvas2d.strokeStyle = "rgba(111, 111, 0, 1)";
        }
        canvas2d.fillStyle = this.farben[i];
        canvas2d.beginPath();
        canvas2d.roundRect(shapes[i].x, shapes[i].y, shapes[i].wd, shapes[i].ht, 10);
        canvas2d.closePath();
        canvas2d.stroke();
        canvas2d.fill();
    }
}

function solveIt() {
    newGame();
    moves = [];
    hanoi(0, 2, 1, this.scheibenAnz);
    var p0 = [];
    for (var i = scheibenAnz - 1; i >= 0; i--) {
        p0.push(i);
    }
    this.stangen = [p0, [],
        []
    ];
	frame = 0;
    moveNo = 0;
    solveAnim();
}

function stopAnim() {
    moveNo = moves.length + 1;
}

function solveAnim() {
    if (moveNo > moves.length) return;
    frame++;
    if (frame > speed) {
        frame = 0;
        var move = moves[moveNo];
        pFr = this.stangen[move[0]];
        pTo = this.stangen[move[1]];
        pTo.push(pFr.pop());
        stangen2Shapes();
        drawShapes();
        moveNo++;
    }
    if (moveNo < moves.length) requestAnimationFrame(solveAnim);
}

function hanoi(from, to, buf, n) {
    if (n > 1) {
        hanoi(from, buf, to, n - 1);
        moves.push([from, to]);
        hanoi(buf, to, from, n - 1);
    } else {
        moves.push([from, to]);
    }
}
CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    return this;
};
