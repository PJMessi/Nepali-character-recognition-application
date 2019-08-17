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
        case 0:
            return "क"; 
        case 1:
            return "ख";
        case 2:
            return "ग";        
        case 3:
            return "घ";
        case 4:
            return "ङ";        
        case 5:
            return "च";
        case 6:
            return "छ";        
        case 7:
            return "ज";
        case 8:
            return "झ";
        case 9:
            return "ञ";        
        case 10:
            return "निश्चित छैन"
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
        
    // }
}
