'use strict';

var express = require('express');           // Express
var bodyParser = require('body-parser');    // Parse request body
var fs = require('fs');
const cmd = require('child_process');
var http = require('http');
const download = require('image-downloader');
const { exec } = require("child_process");
var GetJson = require('get-json');
var tokenprestashop = "K3RCRC22BBM3W2VBN6DXUZ1A175MZ93F";
let rep_json={};
const ngrok="https://5efd1ec8.ngrok.io";
var nrc = require('node-run-cmd');
let kota;
let kota_s;
var jso = [];
var dates = new Date();
var heure = dates.getHours();

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
kota=0;
// Method to handle a post request from Chatfuel
//URL for display product
app.post('/chatfuel', function (req, res) {
    // Get post data from request body
    var data = req.body;
    var name_user = data.last_name;
    var last_button = data.last_clicked_button_name.toLowerCase();
    var message_recu = data.last_user_freeform_input;
    let tab_prod;
    let nbre_prod_final;
    var jso = [];
    console.log(data);
    
    //console.log(names)

    if(last_button == "produits"){
        kota=0;
        //compteur=0;
        GetJson('http://localhost/prestashop/api/products?sort=id_asc&ws_key='+tokenprestashop+'&output_format=JSON',function (err,data) {
	    
		  var produits = data.products;
          
          display_products(0,produits,7)
                  

		})
    }


    if(last_button=="plus"){
        nbre_prod_final = 0;
        console.log("plus");
        GetJson('http://localhost/prestashop/api/products?sort=id_asc&ws_key='+tokenprestashop+'&output_format=JSON',function (err,data) {
	    
          var produits = data.products;
          
          if(kota+7>produits.length){
              let a = produits-kota;
              for(i=0; i=a;i++){
                nbre_prod_final++;
                console.log("nombre restant = "+nbre_prod_final);

              }
          }else{
              display_products(kota,produits,kota+7)
          }
        
    })
    }


function display_products(id_produit_index,produits,arret) {
    
    kota++;
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
                    "subtitle":produit.product.price,
                    "buttons":[
                        {
                        "type":"web_url",
                        "url":"https://rockets.chatfuel.com/store",
                        "title":"Description"
                        },
                        {
                            "type":"web_url",
                            "url":"https://rockets.chatfuel.com/store",
                            "title":"Commander"
                            }
                    ]
                };
        
                jso.push(the_response);
                console.log("koter ="+kota);
                console.log("arret ="+arret);
                if(kota==arret){
                    console.log("moula");
                    var fin = {
                        "title":"cliquez ici pour voir plus d'articles 👇",
                        "image_url":"https://github.com/durantchuente/imageproduit/raw/master/plus.jpg",
                        "subtitle":" ",
                        // "quick_replies": [
                        //         {
                        //         "title":"Loved it!",
                        //         "block_names": ["produits"]
                        //         }]
                            //     }
                        "buttons":[
                            {
                            "type":"show_block",
                            "block_names": ["produits"],
                            "title": "Plus"
                            }
                        ]
                    };
                    //console.log(conte);
                    console.log(id_produit_index);
                    jso.push(fin);
                    
                }
                //console.log(produit.product.images.image);
                
                //if(kota!=produits.length){

                    if(arret!=id_produit_index+1){
                        
                        //console.log("kota= "+kota);
                        console.log(id_produit_index);
                        display_products(id_produit_index+1,produits,arret)
                        
                        
                    }else{
                        

                        //cmd.execFile('command.bat');
                        
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
                                                //"sharable": true,
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
                //}
                
            })
            .catch((err) => console.error(err))		
          

      
  })


//   if(produits.length==id_produit_index){
//     envoi_json(rep_json)
// }
}



});


//URL for search product
app.post('/recherche',function(req, res){
    var data = req.body;
    var name_user = data.first_name;
    var last_button = data.last_clicked_button_name.toLowerCase();
    var message_recu = data.last_user_freeform_input.toString().toLowerCase();
    var jso = [];
    let joso=[];
    let reponse_politesse;
    let mots_polis = ['bonjour', 'bonsoir'];
    let tableau_vetement=["T-shirt","chapeau","bonnet","pantalon","demembré","demembrer","chaussette","chemise"];
    let tableau_chaussure=["chaussure","talon","botte"];
    let tableau_appareil=["telephone","iphone","samsung","huawei","wiko","htc","tecno","infinix"];
    let categorie_vetement;
    let categorie_chaussure;
    let ic;
    let oc;

    let menu=[
            {
            "type":"show_block",
            "block_names": ["produits","guide"],
            "title": "Plus"
            }
        ]
        
    if(message_recu=="menu"){
        // for(ic=0;ic=tableau_vetement.length-1;ic++){
        //     GetJson('http://localhost/prestashop/api/search?ws_key='+tokenprestashop+'&query='+tableau_vetement[ic]+'&language=1&output_format=JSON',function (err,data) {
        //         produits=data.products;
        //     categorie_vetement= categorie_vetement + produits;
        // });
        // }
        // for(oc=0;oc=tableau_vetement.length-1;oc++){
        //     GetJson('http://localhost/prestashop/api/search?ws_key='+tokenprestashop+'&query='+tableau_chaussure[oc]+'&language=1&output_format=JSON',function (err,data) {
        //         produits=data.products;
        //     categorie_chaussure= categorie_chaussure + produits;
        // });
        // }
        joso.push(menu);

        var final_response = {
            "messages": [
                {
                "attachment": {
                "type": "template",
                "payload": {
                "template_type": "button",
                "text": "Hello!",
                "buttons": joso
                        }
                    }
                }
            ]
        }
    
        res.json({
            
                "messages": [
                {
                "attachment": {
                "type": "template",
                "payload": {
                "template_type": "media",
                "elements": [
                {
                "media_type": "image",
                "url": "https://cdn.dribbble.com/users/10743/screenshots/1046498/shoppingsidebar.png",
                "buttons":[
                    {
                    "type":"show_block",
                    "block_names": ["produits"],
                    "title": "Tous les produits"
                    },
                    {
                        "type":"show_block",
                        "block_names": ["guide"],
                        "title": "guide"
                        },
                        {
                            "type":"show_block",
                            "block_names": ["menu"],
                            "title": "Menu"
                            }
                ]
                }
                ]
                }
                }}]
        });

    }else{
        if(last_button=="plus"){
            nbre_prod_final_s = 0;
            console.log("plus");
            GetJson('http://localhost/prestashop/api/search?ws_key='+tokenprestashop+'&query='+message_recu+'&language=1&output_format=JSON',function (err,data) {
            
              var produits = data.products;
              
              if(kota_s+7>produits.length){
                  let a = produits-kota_s;
                  for(i=0; i=a;i++){
                    nbre_prod_final_s++;
                    console.log("nombre restant = "+nbre_prod_final_s);
    
                  }
              }else{
                  search_products(kota_s,produits,kota_s+7);
              }
            
        })
        }else{
    
            if(message_recu==undefined){
    
            }else{
                GetJson('http://localhost/prestashop/api/search?ws_key='+tokenprestashop+'&query='+message_recu+'&language=1&output_format=JSON',function (err,data) {
                    var searchproduit = data.products;
                    kota_s=0;
                    //console.log(searchproduit);
                    //console.log("il manque "+ searchproduit.length+" produits");
                    
        
          //res.json(reponse_politesse);
    
    
                    if(searchproduit==undefined){
                        //console.log(message_recu);
                        //|| message_recu.indexOf('salut')==-1 || message_recu.indexOf('cc')==-1 || message_recu.indexOf('coucou')==-1
                        if(message_recu.indexOf('bonjour')==-1){
                            console.log("cool");
                            reponse_politesse={
                                "messages": [
                                {"text": "Desolé ce produit n'est actuellement pas disponible"}
                                ]
                                // "messages": [
                                //     {
                                //     "text": "Did you enjoy the last game of the CF Rockets?",
                                //     "quick_replies": [
                                //     {
                                //     "title":"Loved it!",
                                //     "block_names": ["produits"]
                                //     },
                                //     {"title":"Not really...",
                                //     "url": "https://rockets.chatfuel.com/api/sad-match",
                                //     "type":"json_plugin_url"
                                //     }
                                //     ]
                                //     }
                                //     ]
                                   
                            }
                            }else{
                                console.log("pas cool");
                                if(heure>23 && heure<13){
                                    if(message_recu.indexOf('bonjour')!=-1 || message_recu.indexOf('bonsoir')!=-1 || message_recu.indexOf('salut')!=-1 || message_recu.indexOf('cc')!=-1 || message_recu.indexOf('coucou')!=-1){
                                        reponse_politesse={
                                            "messages": [
                                            {"text": "Bonjour et bienvenue sur LynnShop "+name_user+"\nQue puis je faire pour vous?"}
                                            ]
                                           }
                                    }
                                }
                                  else{
                                      if (heure>12 && heure<15){
                                        if(message_recu.indexOf('bonjour')!=-1 || message_recu.indexOf('bonsoir')!=-1 || message_recu.indexOf('salut')!=-1 || message_recu.indexOf('cc')!=-1 || message_recu.indexOf('coucou')!=-1){
                                            reponse_politesse={
                                                "messages": [
                                                {"text": "Bonne apres midi et bienvenue sur LynnShop "+name_user+"\nQue puis je faire pour vous?"}
                                                ]
                                               }
                                            
                                        }
                                    }
                                      else{
                                        if(message_recu.indexOf('bonjour')!=-1 || message_recu.indexOf('bonsoir')!=-1 || message_recu.indexOf('salut')!=-1 || message_recu.indexOf('cc')!=-1 || message_recu.indexOf('coucou')!=-1){
                                            reponse_politesse={
                                                "messages": [
                                                {"text": "Bonsoir et bienvenue sur LynnShop "+name_user+"\nQue puis je faire pour vous?"}
                                                ]
                                               }
                                        }
                                      }
                                  }
                                  
                            }
                        res.json(reponse_politesse);
                    }else{
                        if(searchproduit.length>7){
                            search_products(0,searchproduit,7);
                        }else{
                            search_products(0,searchproduit,searchproduit.length);
                        }
                        
                    }
                    
        });
            }}
    }
    
        
        function search_products(id_produit_index_s,searchproduit,arret_s) {

            let reponse_zero = {
                "messages": [
                {"text": "Desolé ce produit n'est actuellement pas disponible"}
                ]
               }
               //console.log("il ya "+searchproduit+" produits dans le tableau");
            var id_produit_s = searchproduit[id_produit_index_s].id;  	
            if (searchproduit[0].id=='') {
                res.json(reponse_zero);
            }
            GetJson('http://localhost/prestashop/api/products/'+id_produit_s+'?ws_key='+tokenprestashop+'&output_format=JSON',function (err,produit) {
        
                const options = {
                    url: 'http://localhost/prestashop/img/p/'+id_produit_s.toString().split('').join('/')+'/'+id_produit_s+'.jpg',
                    dest: __dirname+'/image/'                // Save to /path/to/dest/image.jpg
              }
                   
              download.image(options)
                    .then(({ filename, image }) => {
                        var the_response = {
                            "title":produit.product.name,
                            "image_url":"https://github.com/durantchuente/imageproduit/raw/master/image/"+id_produit_s+".jpg",
                            "subtitle":produit.product.price+" FCFA",
                            "buttons":[
                                {
                                "type":"web_url",
                                "url":"https://rockets.chatfuel.com/store",
                                "title":"Description"
                                },
                                {
                                    "type":"web_url",
                                    "url":"https://rockets.chatfuel.com/store",
                                    "title":"Commander"
                                }
                            ]
                        };
                
                        jso.push(the_response);
                        console.log("koter ="+kota_s);
                        console.log("arret ="+arret_s);
                        if(kota_s==arret_s){
                            console.log("moula");
                            var fin = {
                                "title":"cliquez ici pour voir plus d'articles",
                                "image_url":"https://github.com/durantchuente/imageproduit/raw/master/plus.jpg",
                                "subtitle":"Size: M",
                                "buttons":[
                                    {
                                    "type":"show_block",
                                    "block_names": ["Plus"],
                                    "title": "Plus"
                                    }
                                ]
                            };
                            //console.log(conte);
                            console.log(id_produit_index_s);
                            jso.push(fin);
                            
                        }   
                        if(arret_s!=id_produit_index_s+1){
                                
                            //console.log("kota= "+kota);
                            console.log(id_produit_index_s);
                            search_products(id_produit_index_s+1,searchproduit,arret_s)
                            //display_products(id_produit_index+1,produits,arret)
                            
                            
                        }else{
                            
        
                            //cmd.execFile('command.bat');
                            
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

                        }
          
                    })
                    .catch((err) => console.error(err))
        
                                     
          })
        }
    
});

app.post('/categories', function(req,res){
    var data = req.body;
    var name_user = data.last_name;
    var last_button = data.last_clicked_button_name.toLowerCase();
    var message_recu = data.last_user_freeform_input;
    let tab_prod;
    let nbre_prod_final;
    let tableau_vetement=["T-shirt","chapeau","bonnet","pantalon","demembré","demembrer","chaussette","chemise"];
    let tableau_chaussure=["chaussure","talon","botte"];
    let tableau_appareil=["telephone","iphone","samsung","huawei","wiko","htc","tecno","infinix"];
    var jso = [];
    let categorie_vetement;
    let categorie_chaussure;

    for(i=0;i=categorie_vetement.length-1;i++){
        GetJson('http://localhost/prestashop/api/search?ws_key='+tokenprestashop+'&query='+tableau_vetement[i]+'&language=1&output_format=JSON',function (err,data) {
            produits=data.products;
        categorie_vetement= categorie_vetement + produits;
    });
    }
    for(i=0;i=categorie_vetement.length-1;i++){
        GetJson('http://localhost/prestashop/api/search?ws_key='+tokenprestashop+'&query='+tableau_chaussure[i]+'&language=1&output_format=JSON',function (err,data) {
            produits=data.products;
        categorie_chaussure= categorie_chaussure + produits;
    });
    }
    

});

// Begin Application
app.listen(PORT, function() {
    console.log('Application listening on port ' + PORT);
});


//FUNCTION USED IN THIS PROGRAMME



//   function search_products(id_produit_index_s,searchproduit,arret_s) {

//     let reponse_zero = {
//         "messages": [
//         {"text": "Desolé ce produit n'est actuellement pas disponible"}
//         ]
//        }
//        //console.log("il ya "+searchproduit+" produits dans le tableau");
//     var id_produit_s = searchproduit[id_produit_index_s].id;  	
//     if (searchproduit[0].id=='') {
//         res.josn(reponse_zero);
//     }
//     GetJson('http://localhost/prestashop/api/products/'+id_produit_s+'?ws_key='+tokenprestashop+'&output_format=JSON',function (err,produit) {

//         const options = {
//             url: 'http://localhost/prestashop/img/p/'+id_produit_s.toString().split('').join('/')+'/'+id_produit_s+'.jpg',
//             dest: __dirname+'/image/'                // Save to /path/to/dest/image.jpg
//       }
           
//       download.image(options)
//             .then(({ filename, image }) => {
//                 var the_response = {
//                     "title":produit.product.name,
//                     "image_url":"https://github.com/durantchuente/imageproduit/raw/master/image/"+id_produit_s+".jpg",
//                     "subtitle":produit.product.price+" FCFA",
//                     "buttons":[
//                         {
//                         "type":"web_url",
//                         "url":"https://rockets.chatfuel.com/store",
//                         "title":"Plus"
//                         }
//                     ]
//                 };
        
//                 jso.push(the_response);
//                 console.log("koter ="+kota_s);
//                 console.log("arret ="+arret_s);
//                 if(kota_s==arret_s){
//                     console.log("moula");
//                     var fin = {
//                         "title":"cliquez ici pour voir plus d'articles",
//                         "image_url":"https://github.com/durantchuente/imageproduit/raw/master/plus.jpg",
//                         "subtitle":"Size: M",
//                         "buttons":[
//                             {
//                             "type":"web_url",
//                             "url":"https://m.me/ricktchuente?ref=produits",
//                             "title":"Plus"
//                             }
//                         ]
//                     };
//                     //console.log(conte);
//                     console.log(id_produit_index_s);
//                     jso.push(fin);
                    
//                 }   
//                 if(arret_s!=id_produit_index_s+1){
                        
//                     //console.log("kota= "+kota);
//                     console.log(id_produit_index_s);
//                     search_products(id_produit_index_s+1,searchproduit,arret_s)
//                     //display_products(id_produit_index+1,produits,arret)
                    
                    
//                 }else{
                    

//                     //cmd.execFile('command.bat');
                    
//                         console.log("lance");
//                         //console.log(jso);
//                         var final_response = {
//                             "messages": [
//                                 {
//                                     "attachment":{
//                                         "type":"template",
//                                         "payload":{
//                                             "template_type":"generic",
//                                             "image_aspect_ratio": "square",
//                                             "elements": jso
//                                         }
//                                     }
//                                 }
//                             ]
//                         }
                    
//                         res.json(final_response);
//                     //}
                    
//                     //if(id_produit_index=8){
                        
//                     //}
//                 }
//             //     if(searchproduit.length!=id_produit_index_s+1){

//             //       search_products(chatId,id_produit_index_s+1,searchproduit)
//             //   }
  
//             })
//             .catch((err) => console.error(err))

                             
//   })
// }

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