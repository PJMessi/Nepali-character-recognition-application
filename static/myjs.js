//pen size
pen_size = 30
// Variables for referencing the canvas and 2dcanvas context
var canvas, ctx;
// Variables to keep track of the mouse position and left-button status 
var mouseX, mouseY, mouseDown = 0;
// Variables to keep track of the touch position
var touchX, touchY;
// Keep track of the old/last position when drawing a line
// We set it to -1 at the start to indicate that we don't have a good value for it yet
var lastX, lastY = -1;
// Draws a line between the specified position on the supplied canvas name
// Parameters are: A canvas context, the x position, the y position, the size of the dot
function drawLine(ctx, x, y, size) {
    // If lastX is not set, set lastX and lastY to the current position 
    if (lastX == -1) {
        lastX = x;
        lastY = y;
    }
    // Let's use black by setting RGB values to 0, and 255 alpha (completely opaque)
    r = 255; g = 255; b = 255; a = 255;
    // Select a fill style
    ctx.strokeStyle = "rgba(" + r + "," + g + "," + b + "," + (a / 255) + ")";
    // Set the line "cap" style to round, so lines at different angles can join into each other
    ctx.lineCap = "round";
    //ctx.lineJoin = "round";
    // Draw a filled line
    ctx.beginPath();
    // First, move to the old (previous) position
    ctx.moveTo(lastX, lastY);
    // Now draw a line to the current touch/pointer position
    ctx.lineTo(x, y);
    // Set the line thickness and draw the line
    ctx.lineWidth = size;
    ctx.stroke();
    ctx.closePath();
    // Update the last position to reference the current position
    lastX = x;
    lastY = y;
}

// Keep track of the mouse button being pressed and draw a dot at current location
function sketchpad_mouseDown() {
    mouseDown = 1;
    drawLine(ctx, mouseX, mouseY, pen_size);
}
// Keep track of the mouse button being released
function sketchpad_mouseUp() {
    mouseDown = 0;
    // Reset lastX and lastY to -1 to indicate that they are now invalid, since we have lifted the "pen"
    lastX = -1;
    lastY = -1;
}
// Keep track of the mouse position and draw a dot if mouse button is currently pressed
function sketchpad_mouseMove(e) {
    // Update the mouse co-ordinates when moved
    getMousePos(e);
    // Draw a dot if the mouse button is currently being pressed
    if (mouseDown == 1) {
        drawLine(ctx, mouseX, mouseY, pen_size);
    }
}
// Get the current mouse position relative to the top-left of the canvas
function getMousePos(e) {
    if (!e)
        var e = event;
    if (e.offsetX) {
        mouseX = e.offsetX;
        mouseY = e.offsetY;
    }
    else if (e.layerX) {
        mouseX = e.layerX;
        mouseY = e.layerY;
    }
}
// Draw something when a touch start is detected
function sketchpad_touchStart() {
    // Update the touch co-ordinates
    getTouchPos();
    drawLine(ctx, touchX, touchY, pen_size);
    // Prevents an additional mousedown event being triggered
    event.preventDefault();
}
function sketchpad_touchEnd() {
    // Reset lastX and lastY to -1 to indicate that they are now invalid, since we have lifted the "pen"
    lastX = -1;
    lastY = -1;
}
// Draw something and prevent the default scrolling when touch movement is detected
function sketchpad_touchMove(e) {
    // Update the touch co-ordinates
    getTouchPos(e);
    // During a touchmove event, unlike a mousemove event, we don't need to check if the touch is engaged, since there will always be contact with the screen by definition.
    drawLine(ctx, touchX, touchY, pen_size);
    // Prevent a scrolling action as a result of this touchmove triggering.
    event.preventDefault();
}
// Get the touch position relative to the top-left of the canvas
// When we get the raw values of pageX and pageY below, they take into account the scrolling on the page
// but not the position relative to our target div. We'll adjust them using "target.offsetLeft" and
// "target.offsetTop" to get the correct values in relation to the top left of the canvas.
function getTouchPos(e) {
    if (!e)
        var e = event;
    if (e.touches) {
        if (e.touches.length == 1) { // Only deal with one finger
            var touch = e.touches[0]; // Get the information for finger #1
            touchX = touch.pageX - touch.target.offsetLeft;
            touchY = touch.pageY - touch.target.offsetTop;
        }
    }
}
// Set-up the canvas and add our event handlers after the page has loaded
async function init() {
    // Get the specific canvas element from the HTML document
    canvas = document.getElementById('sketchpad');
    // If the browser supports the canvas tag, get the 2d drawing context for this canvas
    if (canvas.getContext)
        ctx = canvas.getContext('2d');
    // Check that we have a valid context to draw on/with before adding event handlers
    if (ctx) {
        // React to mouse events on the canvas, and mouseup on the entire document
        canvas.addEventListener('mousedown', sketchpad_mouseDown, false);
        canvas.addEventListener('mousemove', sketchpad_mouseMove, false);
        window.addEventListener('mouseup', sketchpad_mouseUp, false);
        // React to touch events on the canvas
        canvas.addEventListener('touchstart', sketchpad_touchStart, false);
        canvas.addEventListener('touchend', sketchpad_touchEnd, false);
        canvas.addEventListener('touchmove', sketchpad_touchMove, false);
    }
}

function predict() {
    // const imageData = ctx.getImageData(0, 0, 140, 140);
    // //convert to tensor 
    // var tfImg = tf.fromPixels(imageData, 1);
    // var smalImg = tf.image.resizeBilinear(tfImg, [28, 28]);
    // smalImg = tf.cast(smalImg, 'float32');
    // var tensor = smalImg.expandDims(0);
    // tensor = tensor.div(tf.scalar(255));
    // const prediction = model.predict(tensor);
    // const predictedValues = prediction.dataSync();
    // var isThereAnyPrediction = false;
    // for (index = 0; index < predictedValues.length; index++) {
    //     if (predictedValues[index] > 0.5) {
    //         isThereAnyPrediction = true;
    //         document.getElementById('rightside').innerHTML = '<br/>Predicted Number: ' + index;
    //     }
    // }
    // if (!isThereAnyPrediction) {
    //     document.getElementById('rightside').innerHTML = '<br>Unable to Predict';
    // }
}









//Prajwal's Javascript

// Clear the canvas context using the canvas width and height
function clearCanvas(canvas, ctx) {
    $("#result").text("इन्पुट दिनुहोस"); //changing the result text to nothing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    $("#show_train_modal").fadeOut("fast"); //hiding the button to train the modal.
    $("#result2").text(" ");        
}

$("#predictbutton").click(function(){
    var canvas = document.getElementById('sketchpad');
    var img = canvas.toDataURL();
    img = encodeURIComponent(img);	

    $("#predictbutton").addClass('disable'); //making the predict button unclickable
    $("#predictbutton_text").text('predicting...'); //changing the predict button text
    $("#result").text("एकैछिन"); //changing the result text to show that its working

    $.ajax({
        headers: { "X-CSRFToken": token },
        type: "POST",
        url: '/predict_digit/',
        data: img,
        success: function(data){	
            $("#result").text(display_full_result(data.result)); //changing the result text to show the result
            if(data.result == "10") {
                $("#result2").text(display_full_result(data.result2));
            }
            audio.play(); //playing a notification sound to denote the prediciton is complete
            $("#predictbutton").removeClass('disable'); //making the predict button clickable again
            $("#predictbutton_text").text('predict'); //changing the predict button text
            $("#canvas_data").val(data.result); //updating the value in the modal to train the model with current data
            $("#show_train_modal").fadeIn("fast"); //showing the button to train the modal with current data

            $("#close_train_modal_btn").fadeOut('fast'); //hiding close button in #train_modal modal
            $("#train_modal_btn").fadeIn("fast"); //showing train button in #train_modal modal
            $("#train_modal_message").fadeOut("fast");//hiding the train model message
            $("#train_modal_message").text("Trainning...");//changing the train model message to default
        }
    });

})

function display_full_result(result){
    switch(result){
        case 0:
            return "क";
            break; 
        case 1:
            return "ख";
            break;
        case 2:
            return "ग";
            break;        
        case 3:
            return "घ";
            break;
        case 4:
            return "ङ";
            break;        
        case 5:
            return "च";
            break;
        case 6:
            return "छ";
            break;        
        case 7:
            return "ज";
            break;
        case 8:
            return "झ";
            break;
        case 9:
            return "ञ";
            break;        
        case 10:
            // return "मिलेन"   
            return "निश्चित छैन"    
            break;

        
    }
    // switch(result){
    //     case 99:
    //         return ".......";
    //         break;

    //     case 0:
    //         return "0, शुन्य";
    //         break;
    //     case 1:
    //         return "1, एक";
    //         break;
    //     case 2:
    //         return "2, दुई";
    //         break;
    //     case 3:
    //         return "3, तिन";
    //         break;
    //     case 4:
    //         return "4, चार";
    //         break;
    //     case 5:
    //         return "5, पाँच";
    //         break;
    //     case 6:
    //         return "6, छ";
    //         break;
    //     case 7:
    //         return "7, सात";
    //         break;
    //     case 8:
    //         return "8, आठ";
    //         break;
    //     case 9:
    //         return "9, नौ";
    //         break;

    //     // case 10:
    //     //     return "क";
    //     //     break; 
    //     case 10:
    //         // return "मिलेन"   
    //         return "निश्चित छैन"    
    //         break;

    //     case 11:
    //         return "ख";
    //         break;
    //     case 12:
    //         return "ग";
    //         break;        
    //     case 13:
    //         return "घ";
    //         break;
    //     case 14:
    //         return "ङ";
    //         break;        
    //     case 15:
    //         return "च";
    //         break;
    //     case 16:
    //         return "छ";
    //         break;        
    //     case 17:
    //         return "ज";
    //         break;
    //     case 18:
    //         return "झ";
    //         break;
    //     case 19:
    //         return "ञ";
    //         break;        
    //     case 20:
    //         return "ट";
    //         break;
    //     case 21:
    //         return "ठ";
    //         break;        
    //     case 22:
    //         return "ड";
    //         break;
    //     case 23:
    //         return "ढ";
    //         break;        
    //     case 24:
    //         return "ण";
    //         break;
    //     case 25:
    //         return "त";
    //         break;        
    //     case 26:
    //         return "थ";
    //         break;
    //     case 27:
    //         return "द";
    //         break;        
    //     case 28:
    //         return "ध";
    //         break;
    //     case 29:
    //         return "न";
    //         break;
    //     case 30:
    //         return "प";
    //         break;        
    //     case 31:
    //         return "फ";
    //         break;
    //     case 32:
    //         return "ब";
    //         break;        
    //     case 33:
    //         return "भ";
    //         break;
    //     case 34:
    //         return "म";
    //         break;        
    //     case 35:
    //         return "य";
    //         break;
    //     case 36:
    //         return "र";
    //         break;        
    //     case 37:
    //         return "ल";
    //         break;
    //     case 38:
    //         return "व";
    //         break;        
    //     case 39:
    //         return "श";
    //         break;
    //     case 40:
    //         return "ष";
    //         break;
    //     case 41:
    //         return "स";
    //         break;        
    //     case 42:
    //         return "ह";
    //         break;
    //     case 43:
    //         return "क्ष";
    //         break;        
    //     case 44:
    //         return "त्र";
    //         break;
    //     case 45:
    //         return "ज्ञ";
    //         break;

    //     case 46:
    //         return "अ";
    //         break;
    //     case 47:
    //         return "आ";
    //         break;        
    //     case 48:
    //         return "इ";
    //         break;
    //     case 49:
    //         return "ई";
    //         break;        
    //     case 50:
    //         return "उ";
    //         break;
    //     case 51:
    //         return "ऊ";
    //         break;        
    //     // case 52:
    //     //     return "ऋ";
    //     //     break;
    //     case 52:
    //         return "ए";
    //         break;
    //     case 53:
    //         return "ऐ";
    //         break;        
    //     case 54:
    //         return "ओ";
    //         break;
    //     case 55:
    //         return "औ";
    //         break;        
    //     case 56:
    //         return "अं";
    //         break;
    //     case 57:
    //         return "अः";
    //         break;
        
    // }
}

$("#refresh_modal_btn").click(function(){   
    $("#refresh_modal_message").fadeIn("fast");
    $("#refresh_modal_btn").fadeOut("fast");       
    $.ajax({
        headers: { "X-CSRFToken": token },
        type: "POST",
        url: '/refresh_model/',            
        success: function(data){
            $("#refresh_modal_message").text(data.result);	
            $("#close_refresh_modal_btn").fadeIn("fast");    
            audio.play();            
        }
    });

})

$("#train_modal_btn").click(function(){
    $("#train_modal_btn").fadeOut("fast"); //hiding train modal button
    $("#train_modal_message").fadeIn("fast"); //showing the train modal message
    $.ajax({
        headers: { "X-CSRFToken": token },
        type: "POST",
        url: '/train_model/',
        data: {
            'canvas_data': $('#canvas_data').val()
        },
        success: function(data){	
            $("#train_modal_message").text(data.result); //changing the train modal message
            $("#close_train_modal_btn").fadeIn('fast'); //showing close train modal button
            audio.play();
        }
    });
})