/*
* Tearable Cloth
* Author : Yessine Taktak
*/
/* Data section */
var canvas, width=500, height=300, context;
var margin_left=window.innerWidth/2-(width/2), margin_top = window.innerHeight/2-(height/2);
var cloth_width=50, cloth_height=30;
var spacing=7, gravity=0.1, friction=0.999, physics_accuarcy=2, mouse_influence=10, tear_distance=250;
var cloth;
var mouse = {
    x : 0,
    y : 0,
    px : 0,
    py : 0,
    down : false,
    type : 0
};
/* Code core */
var Constraint = function(p0, p1) {
    this.p0 = p0;
    this.p1 = p1;
    this.length = spacing;
};
var Cloth = function() {
    try {
        this.points = new Array();
        this.constraints = new Array();
        for(var i=0; i<cloth_height; i++) {
            for(var j=0; j<cloth_width; j++) {
                var point = {};
                point.x = j*spacing;
                point.y = i*spacing;
                point.px = j*spacing;
                point.py = i*spacing;
                if(i == 0 || j == 0 || j == cloth_width-1) {
                    point.pinned = true;
                } else {
                    point.pinned = false;
                }
                this.points.push(point);
            }
        }
    } catch(e) {}
};
Cloth.prototype.updateConstraints = function() {
    try {
        this.constraints = [];
        for(var i=0; i<this.points.length; i++) {
            var p = this.points[i];
            (i == 0) && this.constraints.push(new Constraint(p, p));
            (i != 0) && (this.points[i].x != 0) && this.constraints.push(new Constraint(this.points[i-1], p));
            (i != 0) && (this.points[i].y != 0) && this.constraints.push(new Constraint(p, this.points[i-cloth_width]));
        }
    } catch(e) {}
};
Cloth.prototype.renderPoints = function() {
    try {
        for(var i=0; i<this.points.length; i++) {
            var p = this.points[i];
            var list_mouse_influence_points = [];
            if(!mouse.down) {
                var vx = (p.x-p.px)*friction;
                var vy = (p.y-p.py)*friction;
                if(!p.pinned) {
                    p.px = p.x;
                    p.py = p.y;
                    p.x += vx;
                    p.y += vy;
                    p.y += gravity;
                }
            } else {
                if(mouse.type == 1) {
                    if((p.x <= mouse.x+mouse_influence && p.x >= mouse.x-mouse_influence) && (p.y <= mouse.y+mouse_influence && p.y >= mouse.y-mouse_influence)) {
                        p.px = p.x;
                        p.py = p.y;
                        p.x += (mouse.x-mouse.px)*friction;
                        p.y += (mouse.y-mouse.py)*friction;
                        p.y += gravity;
                    }
                } 
            
            }
        
        }
    } catch(e) {}
    
};
Cloth.prototype.delete_point = function(point) {
    try {
        for(var i=0; i<this.points.length; i++) {
            if(point == this.points[i]) {
                this.points.splice(i, 1);
            }
        }
    } catch(e) {}
    
};
Cloth.prototype.renderConstraints = function() {
    try {
        for(var i=0; i<this.constraints.length; i++) {
            var c = this.constraints[i];
            var dx = c.p1.x-c.p0.x,
                dy = c.p1.y-c.p0.y,
                ds = Math.sqrt(dx*dx+dy*dy),
                df = c.length-ds,
                pc = df/ds/2,
                ox = dx*pc,
                oy = dy*pc;
            if(ds > tear_distance) {
                this.constraints.splice(i, 1);
            } else {
                if(!c.p0.pinned) {
                    c.p0.x -= ox;
                    c.p0.y -= oy;
                }
                if(!c.p1.pinned) {
                    c.p1.x += ox;
                    c.p1.y += oy;
                }
            }
            if(mouse.down) {
                if(mouse.type == 3) {
                    if((c.p0.x <= mouse.x+mouse_influence && c.p0.x >= mouse.x-mouse_influence) && (c.p0.y <= mouse.y+mouse_influence && c.p0.y >= mouse.y-mouse_influence) || (c.p1.x <= mouse.x+mouse_influence && c.p1.x >= mouse.x-mouse_influence) && (c.p1.y <= mouse.y+mouse_influence && c.p1.y >= mouse.y-mouse_influence)) {
                        this.delete_point(this.constraints[i].p0);
                        this.delete_point(this.constraints[i].p1);
                    }
                }
            }
        }     
    } catch(e) {}
    
};
Cloth.prototype.draw = function() {
    try {
        for(var i=0; i<this.constraints.length; i++) {
            context.beginPath();
            context.strokeStyle = "#888";
            context.lineWidth = 0.7;
            context.moveTo(this.constraints[i].p0.x, this.constraints[i].p0.y);
            context.lineTo(this.constraints[i].p1.x, this.constraints[i].p1.y);
            context.stroke();
        }
    } catch(e) {}
};
Cloth.prototype.update = function() {
    try {
        for(var i=0; i<physics_accuarcy; i++) {
            this.renderPoints(); 
            this.renderConstraints();
            this.updateConstraints();   
        }
    } catch(e) {}
};
function update() {
    try {
        cloth.update();
    } catch(e) {}
};
function draw() {
    try {
        context.clearRect(0, 0, width, height);
        cloth.draw();
    } catch(e) {}
};
function render() {
    try {
        /* Real life time loop */
        update();
        draw();
        requestAnimationFrame(render);
    } catch(e) {}
};
function setup() {
    try {
        canvas = document.getElementById("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.style="margin-left : "+margin_left+"px; margin-top : "+margin_top+"px;";
        context = canvas.getContext("2d");
        cloth = new Cloth();
        render();
    } catch(e) {}
};
function main() {
    try {
        /* Program entry function */
        setup(); // Setup canvas and cloth as well
    } catch(e) {}  
};
window.onmousedown = function(e) {
    try {
        mouse.px = mouse.x;
        mouse.py = mouse.y;
        var rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.down = true;
        mouse.type = e.which;
        e.preventDefault();
    } catch(e) {}
};
window.onmousemove = function(e) {
    try {
        if(mouse.down) {
            var rect = canvas.getBoundingClientRect();
            mouse.px = mouse.x;
            mouse.py = mouse.y;
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            mouse.down = true;
        }
    e.preventDefault();
    } catch(e) {}
};
window.oncontextmenu = function (e) {
    try {
        e.preventDefault();
    } catch(e) {}
};
window.onmouseup = function(e) {
    try {
        mouse.down = false;
        e.preventDefault();
    } catch(e) {}
};
window.ontouchstart = function(e) {
    
}
window.addEventListener('touchstart', function(e){
     try {
        event = e.changedTouches[0];
        mouse.px = mouse.x;
        mouse.py = mouse.y;
        var rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
        mouse.down = true;
        e.preventDefault();
    } catch(e) {}   
}, false)
window.addEventListener('touchmove', function(e){
     try {
        if(mouse.down) {
            event = e.changedTouches[0];
            mouse.px = mouse.x;
            mouse.py = mouse.y;
            var rect = canvas.getBoundingClientRect();
            mouse.x = event.clientX - rect.left;
            mouse.y = event.clientY - rect.top;
            e.preventDefault();
        }  
    } catch(e) {}   
}, false)
window.addEventListener('touchend', function(e){
     try {
        mouse.down = false; 
    } catch(e) {}   
}, false)
window.onload = function() {
    try {
        main();
    } catch(e) {}
};
