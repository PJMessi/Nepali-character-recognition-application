// Clear the canvas context using the canvas width and height
function clearCanvas(canvas, ctx) {
    $("#result").text("इन्पुट दिनुहोस"); //changing the result text to nothing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    $("#result2").text(" ");       
    $("#result3").text(" ");   
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
            console.log(data.result);
            console.log(data.probability);
            console.log(data.similarity);

            data.result = parseInt(data.result);
            data.probability = parseFloat(data.probability);
            data.similarity = parseFloat(data.similarity);

            if( data.similarity > 13) {
                $("#result").text(display_full_result(data.result));
            }
            else {
                $("#result").text(display_full_result(46));
                $("#result2").text(display_full_result(data.result));
            }

            if(data.similarity == 0) {
                $("#result3").text("< 3.00");
            }
            else if(data.similarity > 100) {
                $("#result3").text("> 90");
            }
            else {
                $("#result3").text(data.similarity.toFixed(2));
            }

            audio.play(); //playing a notification sound to denote the prediciton is complete
            $("#predictbutton").removeClass('disable'); //making the predict button clickable again
            $("#predictbutton_text").text('predict'); //changing the predict button text
            $("#canvas_data").val(data.result); //updating the value in the modal to train the model with current data

            $("#close_train_modal_btn").fadeOut('fast'); //hiding close button in #train_modal modal
            $("#train_modal_btn").fadeIn("fast"); //showing train button in #train_modal modal
            $("#train_modal_message").fadeOut("fast");//hiding the train model message
            $("#train_modal_message").text("Trainning...");//changing the train model message to default
        }
    });

})

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


function display_full_result(result){
    switch(result){
        case 46:
            return "निश्चित छैन";
        case 0:
            return "0, शुन्य";
        case 1:
            return "1, एक";
        case 2:
            return "2, दुई";
        case 3:
            return "3, तिन";
        case 4:
            return "4, चार";
        case 5:
            return "5, पाँच";
        case 6:
            return "6, छ";
        case 7:
            return "7, सात";
        case 8:
            return "8, आठ";
        case 9:
            return "9, नौ";

        case 10:
            return "क"; 
        case 11:
            return "ख";
        case 12:
            return "ग";        
        case 13:
            return "घ";
        case 14:
            return "ङ";        
        case 15:
            return "च";
        case 16:
            return "छ";        
        case 17:
            return "ज";
        case 18:
            return "झ";
        case 19:
            return "ञ";        
        case 20:
            return "ट";
        case 21:
            return "ठ";        
        case 22:
            return "ड";
        case 23:
            return "ढ";        
        case 24:
            return "ण";
        case 25:
            return "त";        
        case 26:
            return "थ";
        case 27:
            return "द";        
        case 28:
            return "ध";
        case 29:
            return "न";
        case 30:
            return "प";        
        case 31:
            return "फ";
        case 32:
            return "ब";        
        case 33:
            return "भ";
        case 34:
            return "म";        
        case 35:
            return "य";
        case 36:
            return "र";        
        case 37:
            return "ल";
        case 38:
            return "व";        
        case 39:
            return "श";
        case 40:
            return "ष";
        case 41:
            return "स";        
        case 42:
            return "ह";
        case 43:
            return "क्ष";        
        case 44:
            return "त्र";
        case 45:
            return "ज्ञ";
        
    }
}
