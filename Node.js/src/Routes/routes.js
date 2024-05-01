const express = require('express');
const router = express.Router();
const Message = require('../shema');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());





// Create route
router.post('/messages', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ status: false, error: "Name, email, and message are required fields" });
    }

     const existingMessage = await Message.findOne({ email });
     if (existingMessage) {
         return res.status(400).json({ status: false, error: "Email is already registered" });
     }

    const data = new Message({
        name: name,
        email: email,
        message: message
    });

    try {
        const saved = await data.save();

        const dataaa = { name, email, message };

        req.app.get('socketio').emit('chatmessage', dataaa);

        res.status(201).json({
            data: saved,
            status: true,
            message: "Message sent successfully"
        });
    } catch (error) {
        res.status(400).json({ status: false, error: error.message });
    }
});



// Get route
router.get('/getmessage', async (req, res) => {
    try {
        const data = await Message.find();

        if (!data.length) {
            return res.status(404).json({ status: false, error: "Data not found" });
        }
        res.json({
            data: data,
            status: true,
            Message: "Get all data successfully"
        });

    } catch (error) {
        res.status(500)
            .json({ status: false, error: error.message });
    }
});


//Single Data Get route
router.get('/getmessage/:_id', async (req, res) => {
    try {
        const _id = req.params._id;
        const message = await Message.findById(_id);

        if (!message) {
            return res.status(404).json({ status: false, error: "Data not found" });
        }
        res.json({ status: true, data: message });
    } catch (error) {
        res.status(500).json({ status: false, error: "Internal server error" });
    }
});




// Update route
router.put('/messages/:_id', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ status: false, error: "Name, email, and message are required fields" });
    }

    try {
        const data = await Message.findByIdAndUpdate(
            req.params._id,
            req.body,
            { new: true }
        );

        if (!data) {
            return res.status(404).json({ status: false, error: 'Data not found' });
        }

        res.json({
            data: data,
            status: true,
            message: "Updated successfully"
        });
    } catch (error) {
        res.status(500).json({ status: false, error: error.message });
    }
});



// Delete a route
router.delete('/messages/:_id', async (req, res) => {
    try {
        const data =
            await Message.findByIdAndDelete(req.params._id);
        if (!data) {
            return res.status(404)
                .json({ error: 'Data not found' });
        }
        res.json({ status: true, message: 'Data deleted successfully' });
    } catch (error) {
        res.status(500)
            .json({ status: false, error: error.message });
    }
});


// Export the router
module.exports = router;