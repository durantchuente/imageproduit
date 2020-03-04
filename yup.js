var GetJson = require('get-json');
// const cmd = require('child_process');
// console.log('hey');
// cmd.execFile('command.bat');

// MD popo
// cd popo
// ECHO blabla bla blop > fichier.txt
var tokenprestashop = "K3RCRC22BBM3W2VBN6DXUZ1A175MZ93F";
message_recu="bnrttr";
GetJson('http://localhost/prestashop/api/search?ws_key='+tokenprestashop+'&query='+message_recu+'&language=1&output_format=JSON',function (err,data) {
            var searchproduit = data.products;
            if(searchproduit==undefined){
                console.log("ya R");
            }else{
                console.log(searchproduit.length);
            }
            
        });