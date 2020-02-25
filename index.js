'use strict';

var express = require('express');           // Express
var bodyParser = require('body-parser');    // Parse request body
var fs = require('fs');
var http = require('http');
const download = require('image-downloader');
const { exec } = require("child_process");
var GetJson = require('get-json');
var tokenprestashop = "K3RCRC22BBM3W2VBN6DXUZ1A175MZ93F";
let rep_json={};
let compteur;
const ngrok="https://5efd1ec8.ngrok.io";
var nrc = require('node-run-cmd');


// Application Port (Default = 8080)
const PORT = process.env.PORT || 8080;

// Initialize express with body parser middleware
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Method to handle a request on /
app.get('/', function (req, res) {
    res.send('Nothing to see here.');
});

// Method to handle a post request from Chatfuel
app.post('/chatfuel', function (req, res) {

    // Get post data from request body
    var data = req.body;
    var names = data;
    var last_button = data.last_clicked_button_name.toLowerCase();
    var message_recu = data.last_user_freeform_input;
    let tab_prod;
    let nbre_index_prod = 0;
    var jso = [];
    console.log(data)
    
    //console.log(names)

    if(last_button = "produits"){
        compteur=0;
        GetJson('http://localhost/prestashop/api/products?sort=id_asc&ws_key='+tokenprestashop+'&output_format=JSON',function (err,data) {
	
		  var produits = data.products;
        
          //var rep_json ={};

        // for (let index = 0; index < produits.length; index++) {

        //     rep_json[index]={"messages": [
        //         {
        //             "text": produits.product.name
        //         }
        //     ]}
        
        //     if(index==produits.length){
        //         envoi_json(rep_json)
        //     }
            
        // }
          
          display_products(0,produits)
          
          

		})
    }


function display_products(id_produit_index,produits) {
    
    
    var id_produit = produits[id_produit_index].id;
    // a=id_produit;
    GetJson('http://localhost/prestashop/api/products/'+id_produit+'?ws_key='+tokenprestashop+'&output_format=JSON',function (err,produit) {

        
        // console.log(produit);
        const options = {
            url: 'http://localhost/prestashop/img/p/'+id_produit.toString().split('').join('/')+'/'+id_produit+'.jpg',
            dest: __dirname+'/image/'                // Save to /path/to/dest/image.jpg
      }
           
      download.image(options)
            .then(({ filename, image }) => {
                console.log(produit.product.name);
                   //bot.sendPhoto(chatId,__dirname+'/image/'+id_produit+'.jpg',{caption : produit.product.name + "\n PRIX : "+produit.product.price.toString().replace('.000000','')+" Fcfa" + "\n Pour plus d'infos sur le produit tapez /"+id_produit} );
                   //console.log("hiy");
                   var the_response = {
                    "title":produit.product.name,
                    "image_url":"https://github.com/durantchuente/imageproduit/raw/master/image/"+id_produit+".jpg",
                    "subtitle":"Size: M",
                    "buttons":[
                        {
                        "type":"web_url",
                        "url":"https://rockets.chatfuel.com/store",
                        "title":"View Item"
                        }
                    ]
                };
        
                jso.push(the_response)
                //console.log(produit.product.images.image);
                

                if(7!=id_produit_index+1){
                    console.log("hey");
                    display_products(id_produit_index+1,produits)
                }else{
                    nrc.run('dir');
                        // exec('git add -A', (error, stdout, stderr) => {
                        //     if (error) {
                        //         console.log(`error: ${error.message}`);
                        //         return;
                        //     }
                        //     if (stderr) {
                        //         console.log(`stderr: ${stderr}`);
                        //         return;
                        //     }
                        //     console.log(`stdout: ${stdout}`);
                            
                        // });

                        // exec('git commit -m "cest bon" ', (error, stdout, stderr) => {
                        //     if (error) {
                        //         console.log(`error: ${error.message}`);
                        //         return;
                        //     }
                        //     if (stderr) {
                        //         console.log(`stderr: ${stderr}`);
                        //         return;
                        //     }
                        //     console.log(`stdout: ${stdout}`);
                            
                        // });

                        // exec('git push', (error, stdout, stderr) => {
                        //     if (error) {
                        //         console.log(`error: ${error.message}`);
                        //         return;
                        //     }
                        //     if (stderr) {
                        //         console.log(`stderr: ${stderr}`);
                        //         return;
                        //     }
                        //     console.log(`stdout: ${stdout}`);
                            
                        // });
                      //  compteur=1
                    //}
                    //if(compteur!=0){
                        console.log("lance");
                        //console.log(jso);
                        var final_response = {
                             "messages": [
                                 {
                                     "attachment":{
                                         "type":"template",
                                         "payload":{
                                             "template_type":"generic",
                                             "image_aspect_ratio": "square",
                                             "elements": jso
                                         }
                                     }
                                 }
                             ]
                         }
                    
                         res.json(final_response);
                    //}
                    
                    //if(id_produit_index=8){
                        
                     //}
                }

                
            })
            .catch((err) => console.error(err))		
          
      
  })


//   if(produits.length==id_produit_index){
//     envoi_json(rep_json)
// }
}



});


app.post('/chatfu', function (req, res) {
    var jso = [];
    //res.send('err');
for (let index = 0; index <= 8; index++) {

    var the_response = {
            "title":"Chatfuel Rockets Jersey",
            "image_url":"https://rockets.chatfuel.com/assets/shirt.jpg",
            "subtitle":"Size: M",
            "buttons":[
                {
                "type":"web_url",
                "url":"https://rockets.chatfuel.com/store",
                "title":"View Item"
                }
            ]
        };

        jso.push(the_response)


    
    
    

    if(index==8){
       
       var final_response = {
            "messages": [
                {
                    "attachment":{
                        "type":"template",
                        "payload":{
                            "template_type":"generic",
                            "image_aspect_ratio": "square",
                            "elements": jso
                        }
                    }
                }
            ]
        }

        res.json(final_response);
    }

    
    
}

});


// Begin Application
app.listen(PORT, function() {
    console.log('Application listening on port ' + PORT);
});


//FUNCTION USED IN THIS PROGRAMME

function envoi_json(json){
    res.json(json)
}

  function search_products(chatId,id_produit_index_s,searchproduit) {

    var id_produit_s = searchproduit[id_produit_index_s].id;  	
    if (searchproduit[0].id=='') {
        bot.sendMessage(chatId, 'Desolé ce produit n\'est actuellement pas disponible')
    }
    GetJson('http://localhost/prestashop/api/products/'+id_produit_s+'?ws_key='+tokenprestashop+'&output_format=JSON',function (err,produit) {

        const options = {
            url: 'http://localhost/prestashop/img/p/'+id_produit_s.toString().split('').join('/')+'/'+id_produit_s+'.jpg',
            dest: __dirname+'/image/'                // Save to /path/to/dest/image.jpg
      }
           
      download.image(options)
            .then(({ filename, image }) => {
                   bot.sendPhoto(chatId,__dirname+'/image/'+id_produit_s+'.jpg' ,{caption : produit.product.name + "\n PRIX : "+produit.product.price.toString().replace('.000000','')+" Fcfa" + "\n Pour plus d'infos sur le produit tapez /"+id_produit_s} );
            
                if(searchproduit.length!=id_produit_index_s+1){

                  search_products(chatId,id_produit_index_s+1,searchproduit)
              }
  
            })
            .catch((err) => console.error(err))

                             
  })
}

function descrip_products(chatId, id_produit_d) {

  GetJson('http://localhost/prestashop/api/stock_availables/'+id_produit_d+'?ws_key='+tokenprestashop+'&output_format=JSON',function (stock_err,stock_produit) {
      res_stock=stock_produit.stock_available.quantity;
  });
    GetJson('http://localhost/prestashop/api/products/'+id_produit_d+'?ws_key='+tokenprestashop+'&output_format=JSON',function (err,produit) {

        const options = {
            url: 'http://localhost/prestashop/img/p/'+id_produit_d.toString().split('').join('/')+'/'+id_produit_d+'.jpg',
            dest: __dirname+'/image/'                // Save to /path/to/dest/image.jpg
      }
           
      download.image(options)
            .then(({ filename, image }) => {
                   bot.sendPhoto(chatId,__dirname+'/image/'+id_produit_d+'.jpg',{caption : produit.product.name + "\n PRIX : "+produit.product.price.toString().replace('.000000','')+" Fcfa" + "\n Pièces restante : "+ res_stock +"\n Description : "+produit.product.description.replace(/<(.|\n)*?>/g, '')
                  , "reply_markup": {
                      "keyboard": [["Commander"]]
                      } } );
                      command_id=id_produit_d;
                      message_precedent = message_recu;
            })
            .catch((err) => console.error(err))		
          
            
  })

}