const {WebhookClient}=require('dialogflow-fulfillment')
//const {Card, Suggestion}=require('dialogflow-fulfillment')
const express = require("express");
const app = express();
const mysql = require('mysql');
const dif = require("dialogflow-fulfillment");
const { json } = require('express');


app.get('/',(req, res)=>{
  
    res.send("we are live")
});

app.post("/", express.json(), (req, res) => {
    const agent = new dif.WebhookClient({ request: req, response: res 
});
app.post("/", express.json(), function(request,response){
  
})

    function connectToDatabase(){
      const connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'tera'
      });
      return new Promise((resolve,reject) => {
        connection.connect();
        resolve(connection);
      });
    }

    function cityDatabase(connection){
      return new Promise((resolve, reject) => {
        connection.query('select name,id from cities', (error, results, fields) => {
          resolve(results);
          //console.log(results)
          
          });
          
       
      });
    }
    function stateDatabase(connection){
      return new Promise((resolve, reject) => {
        connection.query('select name from states', (error, results1, fields) => {
          resolve(results1);
          
          
          });
          
       
      });
    }
    
    function localityDatabase(connection,userdata){
      userdata=req.body.queryResult.parameters.city
      console.log('detailsdata',userdata)
      
      return new Promise((resolve, reject) => {
        connection.query(`SELECT cities.name,localities.name from cities,localities where cities.name=? ORDER BY localities.name ASC`,userdata, (error, results2, fields) => {
          resolve(results2);
          //console.log(results2)
          
          });
          
       
      });
    }
    
    function handlemapdatabase(connection){
      var params=agent.context.get('localities')
      // var userloc=agent.request_.body.queryResult.outputContexts[0].parameters['localities.original'];
      // console.log(userloc)
      var userlocality=req.body.queryResult.parameters.localities
            console.log('localdata',params)
            console.log(userlocality)
      
      
      return new Promise((resolve, reject) => {
        connection.query(`SELECT localities.id,localities.name from localities where localities.name=?`,userlocality, (error, results2, fields) => {
          resolve(results2);
          //console.log(results2)
          
          });
          
       
      });

    }
    function possessionfaq(connection){
      var params=agent.context.get('localities')
      
      var userlocal=req.body.queryResult.parameters.localities
            console.log('localdata',params)
            console.log(userlocal)
      return new Promise((resolve, reject) => {
        connection.query(`SELECT localities.name,localities.id,re_properties.id,re_properties.name,re_properties.possession_status from localities,re_properties where localities.name=? AND re_properties.name='signature fortius'`,userlocal, (error, results2, fields) => {
          resolve(results2);
          //console.log(results2)
          
          });
          
       
      });


    }
    function handlepossessionfaq(agent){
      return connectToDatabase()
           .then(connection=>{
           
            return possessionfaq(connection)
            .then(statusdata=>{
              
              statusdata.forEach(element=>{
                //d1=element.possession_status
                //console.log(statusdata)
                console.log(element.possession_status) 
                agent.add(element.possession_status)
              })
              //agent.add(new dif.Payload(agent.UNSPECIFIED,statusdata.possession_status,{sendAsMessage:true,rawPayload:true}))
              //agent.add(statusdata.possession_status)
            })
          })

    }
     
    
    function handlestatedata(agent){
      
           return connectToDatabase()
           .then(connection=>{
           
            return stateDatabase(connection)
            .then(sdata=>{
              var sdata1=[]
              sdata.forEach(element=>{
                sdata1.push(element.name) 
              })
            //var btn=req.body.queryResult.parameters.city
            
            for(var i=0;i<sdata1.length;i++)
            //console.log(sdata1[i])
            
            sdata={
              
              "richContent": [
                [
                  
                  {
                    "type": "info",
                    "title": "Which state are you interested to explore",
                   
                  },
                  {
                    "type": "chips",
                    
                    "options": [
                      {
                        "text": sdata1[0],
                        
                      },
                      {
                        "text": sdata1[1],
                        
                      },
                      {
                        "text": sdata1[2],
                        
                      },
                      {
                        "text": sdata1[3],
                        
                      },
                      {
                        "text": sdata1[4],
                        
                      },
                   ]
                  }
                ]
              ],
              
                
                  "google": {
                    "expectUserResponse": true,
                    "richResponse": {
                      "items": [
                        {
                          "simpleResponse": {
                            "textToSpeech": "Which state are you interested to explore"
                          }
                        }
                      ],
                      "suggestions": [
                        {
                          "title": sdata1[0]
                        },
                        {
                          "title": sdata1[1]
                        },
                        {
                          "title": sdata1[2]
                        },
                        {
                          "title": sdata1[3]
                        },
                        {
                          "title": sdata1[4]
                        }
                      ]
                    }
                  }
                
              
            }
            
              agent.add(new dif.Payload(agent.UNSPECIFIED,sdata,{sendAsMessage:true,rawPayload:true}))
              
            })
          })
    }
    function handlecitydata(agent){
     // var btn=agent.parameters.city;
     
      return connectToDatabase()
      .then(connection=>{
        return cityDatabase(connection)
           .then(cdata=>{
            var cdata1=[]
            cdata.forEach(element => {
              cdata1.push(element.name)
              cdata1.values()
              //console.log(element.name)
            });
            for(var i=0;i<cdata1.length;i++)
            //console.log(cdata1[i])
            cdata={
              
              "richContent": [
                [
                  
                  {
                    "type": "info",
                    "title": "Which city are you interested to explore",
                   
                  },
                  {
                    "type": "chips",
                    
                    "options": [
                      {
                        "text": cdata1[0],
                        
                      },
                      {
                        "text": cdata1[1],
                        
                      },
                      {
                        "text": cdata1[2],
                        
                      },
                      {
                        "text": cdata1[3],
                        
                      },
                      {
                        "text": cdata1[4],
                        
                      },
                   ]
                  }
                ]
              ],
              
                
                  "google": {
                    "expectUserResponse": true,
                    "richResponse": {
                      "items": [
                        {
                          "simpleResponse": {
                            "textToSpeech": "Which city are you interested to explore"
                          }
                        }
                      ],
                      "suggestions": [
                        {
                          "title": cdata1[0]
                        },
                        {
                          "title": cdata1[1]
                        },
                        {
                          "title": cdata1[2]
                        },
                        {
                          "title": cdata1[3]
                        },
                        {
                          "title": cdata1[4]
                        }
                      ]
                    }
                  }
                
              
            }
              
              agent.add(new dif.Payload(agent.UNSPECIFIED,cdata,{sendAsMessage:true,rawPayload:true}))
              
            
            })
            
      })

    }
    function handlelocaldata(agent){
      return connectToDatabase()
      .then(connection=>{
        return localityDatabase(connection)
        .then(ldata=>{
          ldata1=[]
          ldata.forEach(element=>{
            ldata1.push(element.name)
            //console.log(ldata1)
          });
          for(var i=0;i<ldata1.length;i++)
            //console.log(ldata1[i])
            ldata={
              
              "richContent": [
                [
                  
                  {
                    "type": "info",
                    "title": "Which location u are preferring",
                   
                  },
                  {
                    "type": "chips",
                    
                    "options": [
                      {
                        "text": ldata1[0],
                        
                      },
                      {
                        "text": ldata1[1],
                        
                      },
                      {
                        "text": ldata1[2],
                        
                      },
                      {
                        "text": ldata1[3],
                        
                      },
                      {
                        "text": ldata1[4],
                        
                      },
                      {
                        "text": ldata1[5],
                        
                      },
                      {
                        "text": ldata1[6],
                        
                      },
                   ]
                  }
                ]
              ],
              
                
                  "google": {
                    "expectUserResponse": true,
                    "richResponse": {
                      "items": [
                        {
                          "simpleResponse": {
                            "textToSpeech": "Which location u are preferring"
                          }
                        }
                      ],
                      "suggestions": [
                        {
                          "title": ldata1[0]
                        },
                        {
                          "title": ldata1[1]
                        },
                        {
                          "title": ldata1[2]
                        },
                        {
                          "title": ldata1[3]
                        },
                        {
                          "title": ldata1[4]
                        }
                      ]
                    }
                  }
                
              
            }
              
            agent.add(new dif.Payload(agent.UNSPECIFIED,ldata,{sendAsMessage:true,rawPayload:true}))
              
            
        })
        
      })

    }
    
    function localmsg(agent){
      
      var localdata={
              
        "richContent":[
          [
            {
              "title": "Are you looking forward to buying a property or renting a property?",
              "type": "info"
            },
            {
              "options": [
                {
                  "text": "I want to buy a property"
                },
                {
                  "text": "I want to rent a property"
                }
              ],
              "type": "chips"
            }
          ]
        ],
        
          
            "google": {
              "expectUserResponse": true,
              "richResponse": {
                "items": [
                  {
                    "simpleResponse": {
                      "textToSpeech": "Are you looking forward to buying a property or renting a property?"
                    }
                  }
                ],
                "suggestions": [
                  {
                    "title": "I want to buy a property"
                  },
                  {
                    "title": "I want to rent a property"
                  }
                ]
              }
            }
          
        
      }
         agent.add(new dif.Payload(agent.UNSPECIFIED,localdata,{sendAsMessage:true,rawPayload:true}))
         
        
      
       
    }
    function handlemap(agent){
      
      
      return connectToDatabase()
      .then(connection=>{
        return handlemapdatabase(connection)
        .then(mapdata=>{
          mapdata1=[]
         
          mapdata.forEach(element=>{
            mapdata1.push(element.id)
            //console.log(mapdata1)
          });
          for(var i=0;i<mapdata1.length;i++)
            //console.log(ldata1[i])
      
            mapdata={
                "google": {
                  "expectUserResponse": true,
                  "richResponse": {
                    "items": [
                      {
                        "simpleResponse": {
                          "textToSpeech": "Ok, thank you very much."
                        }
                      },
                      {
                        "basicCard": {
                          "title": "Please find the properties of your preferences ",

                          
                          "buttons": [
                            {
                              "title": "click here",
                              "openUrlAction": {
                                "url": "https://terraterri.com/properties?per_page=100&type=sale&city_id=575&locality_id%5B%5D="+mapdata1[0]
                              }
                            }
                          ],
                          "imageDisplayOptions": "CROPPED"
                        }
                      },
                      
                    ]
                  }
                }
              }
      
            agent.add(new dif.Payload(agent.UNSPECIFIED,mapdata,{sendAsMessage:true,rawPayload:true}))
        })
      })
         

       
      
 
    }  

var intentMap=new Map();
    //intentMap.set('Default Welcome Intent',welcome);
    intentMap.set('Default Welcome Intent - yes',handlestatedata);
    intentMap.set('city',handlecitydata);
    intentMap.set('citymsg',handlelocaldata)
    intentMap.set('localitymsg',localmsg)
    intentMap.set('map',handlemap)
    intentMap.set('possitonstatusfaq',handlepossessionfaq)
    agent.handleRequest(intentMap);

});
app.listen(8000,()=>console.log("server is live at port 8000"));
// set http_proxy=
// set https_proxy=

