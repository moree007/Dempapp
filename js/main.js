// JavaScript Document

 //app.initialize();
$(document).ready(function(){

     $("#file-upload").change(function () {
        readURL(this);
    });
}) 

function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#previewimage').attr('src', e.target.result);
                $('#previewimage').css('display','block');
                $("#errimage").html("");
            }
            reader.readAsDataURL(input.files[0]);
        }
}
		
		
$("#submit").click(function(e) {

    e.preventDefault();
    var email = $("#email").val();
    var password = $("#password").val();
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
     if(!regex.test(email)){ 
        $("#erremail").html("Please enter email address");
        return false;
     }else{

       $("#erremail").html(""); 
     }
	 /* var fileInput = document.getElementById('file-upload');
      var file = fileInput.files[0];
      console.log(file);
      if(file != undefined ){console.log(" Success"); 

        uploadFile();

      }else{$("#errimage").html("Please choose image"); return false;}
      console.log('fileInput----',fileInput); */
	   
    $.ajax({
        type: "POST",
        url: "https://api.dpms.tech",
        data: { 
            email: email, // < note use of 'this' here
            password: password
        },
        success: function(result) {
         console.log(result);
		
		
		 console.log(result.url)
           
           /* if(result.errors ){ 
				$("#errpassword").html(result.errors[0].detail); 
			}else{*/ //alert("login"); 
				window.location.href = result.url;
				 // window.open(result.url, '_self ', 'location=yes');
								   
                    
           /* }*/
            
        },
        error: function(result) {

			console.log("error");
			console.log(result);
			console.log(result.responseJSON.errors[0].detail);
			$("#errpassword").html(result.responseJSON.errors[0].detail); 
           // alert('error');
        }
    });
});
		
function uploadFile() {
		
		var name=$('#name').val();
		var email=$('#email').val();
		var phone=$('#phone').val();
		var bar_code=$('#barcode').val();
		
		var data_json=[name,email,phone,bar_code];
        
	  //$("#errimage").html("File uploaded!");
      var fileInput = document.getElementById('file-upload');
       var file = fileInput.files[0];
       console.log(file);
     
	   var radioValue = $("input[name='Choice']:checked"). val();
	   
	   if(radioValue=="Dropbox"){

				  const UPLOAD_FILE_SIZE_LIMIT = 150 * 1024 * 1024;
				  //var ACCESS_TOKEN = document.getElementById('access-token').value;
				 // var ACCESS_TOKEN  = 'aZ-wGm9gWKAAAAAAAAAACHV1vY5gVMvpoAE1mu6p-B393lVugf7bg5mXNeX4PeQw';
					var ACCESS_TOKEN  = '6N18_AZAL2AAAAAAAACjoetiU-gbr9T1Zzbm9svjuZM9jNcu0BMex8CbG8svEyP1';
				  console.log(ACCESS_TOKEN);
				  var dbx = new Dropbox.Dropbox({ accessToken: ACCESS_TOKEN });
				  var fileInput = document.getElementById('file-upload');
				  var file = fileInput.files[0];
				  
			
					if(file == undefined ){
					   $("#errimage").html("Please choose image"); return false;}else{
						$("#errimage").html("");
					   }
			
			
				  console.log(ACCESS_TOKEN);
				  if (file.size < UPLOAD_FILE_SIZE_LIMIT) { // File is smaller than 150 Mb - use filesUpload API
					dbx.filesUpload({path: '/' + file.name, contents: file})
					  .then(function(response) {
						var results = document.getElementById('errimage');
						results.appendChild(document.createTextNode('File uploaded!'));
						$("#errimage").html("File uploaded!");
						console.log(response);
					  })
					  .catch(function(error) {
						console.error(error);
					  });
					  
					  //uploading json file
					  var file2="foo.txt";
					  dbx.filesUpload({path: '/' + "jason", contents: file2})
					  .then(function(response) {
						$("#errimage").html("JSON File uploaded!");
						console.log(response);
					  })
					  .catch(function(error) {
						console.error(error);
					  });
					  ///
				  } else { // File is bigger than 150 Mb - use filesUploadSession* API
					const maxBlob = 8 * 1000 * 1000; // 8Mb - Dropbox JavaScript API suggested max file / chunk size
			
					var workItems = [];     
				  
					var offset = 0;
			
					while (offset < file.size) {
					  var chunkSize = Math.min(maxBlob, file.size - offset);
					  workItems.push(file.slice(offset, offset + chunkSize));
					  offset += chunkSize;
					} 
					  
					const task = workItems.reduce((acc, blob, idx, items) => {
					  if (idx == 0) {
						// Starting multipart upload of file
						return acc.then(function() {
						  return dbx.filesUploadSessionStart({ close: false, contents: blob})
									.then(response => response.session_id)
						});          
					  } else if (idx < items.length-1) {  
						// Append part to the upload session
						return acc.then(function(sessionId) {
						 var cursor = { session_id: sessionId, offset: idx * maxBlob };
						 return dbx.filesUploadSessionAppendV2({ cursor: cursor, close: false, contents: blob }).then(() => sessionId); 
						});
					  } else {
						// Last chunk of data, close session
						return acc.then(function(sessionId) {
						  var cursor = { session_id: sessionId, offset: file.size - blob.size };
						  var commit = { path: '/' + file.name, mode: 'add', autorename: true, mute: false };              
						  return dbx.filesUploadSessionFinish({ cursor: cursor, commit: commit, contents: blob });           
						});
					  }          
					}, Promise.resolve());
					
					task.then(function(result) {
					  var results = document.getElementById('results');
					  results.appendChild(document.createTextNode('File uploaded!'));
					  $("#errimage").html("File uploaded!");
					}).catch(function(error) {
					  console.error(error);
					});
					
				  }
				  return false;
	   }else{
		//for server upload   
				var fileURL=localStorage.fileURL;
				var fileInput = document.getElementById('file-upload');
				var file = fileInput.files[0];
				var full_file=$('#file-upload').val();
				var fileURL=localStorage.fileURL;
				
				var uri = encodeURI("https://api.dpms.tech/relay");
				var options = new FileUploadOptions();
				options.fileKey="file";
				options.fileName=fileURL.substr(fileURL.lastIndexOf('/')+1);
				options.mimeType="image/png";
				var headers={'headerParam':'headerValue'};
				
				var params={'key':'dXguFqnCpdyTDM8D','op':'upload_photo','photo':fileURL};
				 
				options.params = params;
				 
				options.headers = headers;
				$("#errimage").html("File upload in progress...");
				var ft = new FileTransfer();
				ft.onprogress = function(progressEvent) {
					if (progressEvent.lengthComputable) {
						loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
					} else {
						loadingStatus.increment();
					}
				};
				ft.upload(fileURL, uri, win, fail, options);
				//return false;
	   
	   
	   }
}

function win(r) {
    alert("Code = " + r.responseCode);
    alert("Response = " + r.response);
    alert("Sent = " + r.bytesSent);
	$("#errimage").html("File uploaded!");
	return false;
}
 
function fail(error) {
    alert("An error has occurred: Code = " + error.code);
    alert("upload error source " + error.source);
    alert("upload error target " + error.target);
	return false;
}

function show(id){
	$('#normal_file').hide();	
	$('#gallery_file').hide();	
	$('#'+id).show();	
}

function open_lib(){
	navigator.camera.getPicture(function(imageUri){
			//alert(imageUri);
			localStorage.fileURL=imageUri;
			
			
			    $('#previewimage').attr('src', localStorage.fileURL);
                $('#previewimage').css('display','block');
                $("#errimage").html("");
				
				
		}, function(message) {
			alert("error");
		},{
			quality: 30, 
			correctOrientation:true,
			destinationType: navigator.camera.DestinationType.NATIVE_URI,
			sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
		}
       );		
}