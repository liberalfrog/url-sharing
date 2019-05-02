var express = require('express');
var request = require('request');
const admin = require("firebase-admin");

const db = admin.firestore();

const CLIENT = 'AY9byggP1RG3lxNt3shDNrPITFjGbuJeOpydsEvZw8W1Oe9qMs65vo9nBjjdYSiZFiK0XDODs-H_XzJF';
const SECRET = 'ECLjrZpHON9NpHv9PKZrdDK0d8e_Mjub5_PjoYUr-G3UimPGOwFrtq-SCwmyJ_mcese0bY4xv8wIPDBU';
var PAYPAL_API = 'https://api.sandbox.paypal.com';

express()
var router = express.Router();


router.post('/create-payment/', function(req, res) {

  // @platong  Folder exist validation
  const folerId = req.body.folderId;

  /*query.get().then(doc => {
    if(!doc.exists){
      console.log("Document exists");
    }else{
      console.log("Document does not exist");
    }
  });*/

  request.post(PAYPAL_API + '/v1/payments/payment',{
    auth:{
      user: CLIENT,
      pass: SECRET
    },
    body:{
      intent: 'sale',
      payer:{
        payment_method: 'paypal'
      },
      transactions: [{
        amount:{
          total: req.body.total,
          currency: 'JPY'
        }
      }],
      redirect_urls:{
        return_url: 'https://www.mysite.com',
        cancel_url: 'https://www.mysite.com'
      }
    },
    json: true
  }, function(err, response){
    if (err){
      console.error(err);
      return res.sendStatus(500);
    }
    res.json({ id: response.body.id });
  });
})

router.post('/execute-payment/', function(req, res){
  const paymentID = req.body.paymentID;
  const payerID = req.body.payerID;
  const paymentURL = PAYPAL_API + '/v1/payments/payment/' + paymentID + '/execute';

  request.post(paymentURL,{
    auth:{
      user: CLIENT,
      pass: SECRET
    },
    body:{
      payer_id: payerID,
      transactions: [{
        amount:{
          total: '10.99',
          currency: 'USD'
        }
      }]
    },
    json: true
  },
  function(err, response){
    if (err){
      console.error(err);
      return res.sendStatus(500);
    }
    res.json({ status: 'success' });
    let folderId = req.body.folderId;
    let accountId = req.body.accountId;
    let origin = db.collection("paid").doc(folderId);
    let toRepo = db.collection("account").doc(accountId).collection("folders").doc(folderId).collection("urls");
    query.get(snap => {
      snap.forEach(doc => {
        toRepo.doc(doc.id).set(doc.data());
      });
    });
  });
})

module.exports = router;
