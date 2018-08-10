
$(window).on('scroll', function(){
    var scrolled = $(window).scrollTop();
    
    $('.globo1').css('transform', 'translateY(' + scrolled * .1 + 'px)');
    $('.globo2').css('transform', 'translateY(' + -scrolled * .2 + 'px)');
});

var CLOUDINARY_URL='https://api.cloudinary.com/v1_1/djfmkpp45/upload'; 
var CLOUDINARY_UPLOAD_PRESET='vidvmu3b';
var imgPreview = document.getElementById('img-preview');
var fileUpload = document.getElementById('file-upload');

fileUpload.onchange = function(e){
    var file = event.target.files[0];
    var formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    axios({
        url: CLOUDINARY_URL,
        method: 'POST',
        headers:{
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: formData
    })
    .then(response =>{
        console.log(response);  
        imgPreview.src = response.data.secure_url;
    })
    .catch(error =>{
        console.log(error);
    });
};







//CANVAS

// $(window).on('load', ()=>{ 

// var canvas = document.getElementById('canvas');
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// var background = new Background(canvas, '/images/montanhas.jpg');
// });


// function Background(canvas, background){
//     this.ctx = canvas.getContext("2d");    

//     this.img = new Image();
//     this.img.src = background;

// this.x = 0;
// this.y = 0;
// this.w = this.ctx.canvas.width;
// this.h = this.ctx.canvas.height;

// this.vx = 7;
// }

// Background.prototype.move = function() {
//     this.x -= this.vx;

//     if (this.x + this.w <= 0) {        
//         this.x = 0;
//     }
// };


