/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function() {
        document.getElementById('scanner').addEventListener('click', this.scan, false);

        //document.getElementById('encode').addEventListener('click', this.encode, false);
    },

    // deviceready Event Handler
    //
    // The scope of `this` is the event. In order to call the `receivedEvent`
    // function, we must explicity call `app.receivedEvent(...);`
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
		
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
		
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
       	var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    scan: function() {
		//alert("scanner");
        //getProductsByBarcode("041420012136");
        //return;
	cordova.plugins.barcodeScanner.scan(
      function (result) {
		 var rs=result.text;
		 $('#barcode').val(rs);
      },
      function (error) {
          //alert("Scanning failed: " + error);
		navigator.notification.alert(
                'Scanning failed'+error,  // message
                alertDismissed,         // callback
                'Demo App',            // title
                'OK'                  // buttonName
            );
		  
      },
      {
          preferFrontCamera : false, // iOS and Android 
          showFlipCameraButton : true, // iOS and Android 
          showTorchButton : true, // iOS and Android 
          torchOn: false, // Android, launch with the torch switched on (if available) 
          prompt : "Place a Bar code inside the scan area", // Android 
          resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
          orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device 
          disableAnimations : true, // iOS 
          disableSuccessBeep: false // iOS 
      }
   );
    
   /*
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");
        scanner.scan( function (result) {
           /* alert("We got a barcode\n" + 
            "Result: " + result.text + "\n" + 
            "Format: " + result.format + "\n" + 
            "Cancelled: " + result.cancelled);  
			
			fetch_data_online(result.text);*/
	/*


			if(result.cancelled == false){
				$('#loading').show();
				//$('#loading_land').show();
				//playSound();
				//vibrate();
                getProductsByBarcode(result.text);
				
			}else{
                direct_page("his");
			}
			
           console.log("Scanner result: \n" +
                "text: " + result.text + "\n" +
                "format: " + result.format + "\n" +
                "cancelled: " + result.cancelled + "\n");
            document.getElementById("info").innerHTML = result.text;
            console.log(result);
            /*
            if (args.format == "QR_CODE") {
                window.plugins.childBrowser.showWebPage(args.text, { showLocationBar: false });
            }
            */
	/*
        }, function (error) { 
            console.log("Scanning failed: ", error); 
        } );
		*/
    },

    encode: function() {
         cordova.plugins.barcodeScanner.encode(cordova.plugins.barcodeScanner.Encode.TEXT_TYPE, "http://www.nytimes.com", function(success) {
            alert("encode success: " + success);
          }, function(fail) {
            alert("encoding failed: " + fail);
          }
        );
		/*
		var scanner = cordova.require("cordova/plugin/BarcodeScanner");

        scanner.encode(scanner.Encode.TEXT_TYPE, "http://www.nhl.com", function(success) {
			
            //alert("encode success: " + success);
          }, function(fail) {
            //alert("encoding failed: " + fail);
          }
        );
		*/

    }

};
app.initialize();