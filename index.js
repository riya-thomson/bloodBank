//1.import express using require
var express = require('express')
var cors = require('cors')
require('./connection')
const user = require('./model/user');
const acceptdataModel = require('./model/acceptdata');
const detailuser = require('./model/userDetail')
const nodemailer = require('nodemailer');

//2 initializing variable app
var app = express();

//middleware
app.use(express.json())

app.use(cors())

// --------email notification-----------
app.post('/send-email', async (req, res) => {
    const { recipientEmail, subject, text } = req.body;
  
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'riyademo23@gmail.com', // Your Gmail address
        pass: 'giuq kyfg thax hrre' // Your Gmail password
      }
    });
  
    var mailOptions = {
      from: 'riyademo23@gmail.com',
      to: recipientEmail,
      subject: subject,
      text: text
    };
  
    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Email sent successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to send email.' });
    }
  });


//to add data to db===post=== 
app.post('/request', async(req, res) => {
    try{
        console.log(req.body)
        await user(req.body).save();
        res.send({message:"Request form submitted."})
    } catch(error){
        console.log(error)
    }
})

//to get data from db
app.get('/reqadmin', async(req, res) => {
    try {
        var data = await user.find()
        res.send(data)
    } catch (error) {
        console.log(error)
    }
})

//to delete
app.delete("/remove/:id", async(req, res) => {
    try {
        await user.findByIdAndDelete(req.params.id)
        res.send({message:"Successfull!"})
    } catch (error) {
        console.log(error)
    }
})


//--------acceptdata-----------

app.post('/accept', async (req, res) => {
    try {
      const newData = req.body;
      await acceptdataModel.create(newData);
      res.status(201).send({ message: "Submitted successfully." });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Failed to save data." });
    }
  });
  

app.get('/donor', async(req, res) => {
    try {
        var data = await acceptdataModel.find().exec();
        res.json(data);
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Error retrieving data.' });
    }
})

app.delete("/delete/:id", async(req, res) => {
    try {
        await acceptdataModel.findByIdAndDelete(req.params.id)
        res.send({message:"Data deleted successfully!"})
    } catch (error) {
        console.log(error)
    }
})

app.put("/edit/:id", async(req, res) => {
    try {
        var data = await acceptdataModel.findByIdAndUpdate(req.params.id, req.body)
        res.send({message:"Updated successfully!!", data})
    } catch (error) {
        console.log(error)
    }
})

// -----userDetail-----
app.post('/add', async (req, res) => {
    try {
      const newUser = new detailuser(req.body); // Create a new user instance with the received data
      await newUser.save(); // Save the user to the database
      res.status(201).json(newUser); // Send the newly created user back to the client
    } catch (error) {
      res.status(500).json({ message: 'An error occurred', error }); // Send an error response
    }
  });

app.get('/view',async(req,res)=>{
    try {
        const {Email} = req.query
        var data = await detailuser.findOne({Email})
        res.send(data)
    } catch (error) {
        console.log(error)
        res.send('Invalid email id or password\n' + error)
    }
})

//3 api creation 
app.get('/', (req, res) => {
    res.send("Welcome!")
})

app.get('/request', (req, res) => {
    res.send("Added successfully...")
})

app.get('/reqadmin', (req, res) => {
    res.send("You are in admin request page.")
})

app.get('/donor', (req, res) => {
    res.send("You are in donor page.")
})

app.get('/accept', (req, res) => {
    res.send("data accepting....")
})

app.get('/admin', (req, res) => {
    res.send("You are in admin page...")
})

app.get('/addform', (req, res) => {
    res.send("Data added successfully...")
})



//4 port allocation
app.listen(3000, () => {
    console.log("port is up and running.")
})

module.exports = app;