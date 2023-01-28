const express =  require('express')
const router = express.Router()
const cors = require('cors')
router.use(cors()) //Cross-Origin Resource Sharing (CORS)


const Subscriber  = require('../models/subscribers')

router.get('/' , async (req,res) =>{
    try{
        const subscribers = await Subscriber.find()
        res.json(subscribers)
    } catch (err) {
        res.status(500).json({ message : err.message})
    }
})
router.get('/:id' , getSubscriber,  (req,res) =>{
    res.json(req.subscriber)
})

router.post('/' , async (req,res) =>{
    const subscribers = new Subscriber({
        name : req.body.name,
        subscriberToChannel : req.body.subscriberToChannel
    })
    try{
        const newSubscribers = await subscribers.save()
        res.status(201).json(newSubscribers)
    } catch (err) {
        res.status(400).json({ message : err.message})
    }
})
router.put('/:id' , getSubscriber , async (req,res) =>{
    if(req.subscriber.name != null){
        req.subscriber.name = req.body.name   
    }
    if(req.subscriber.subscriberToChannel != null){
        req.subscriber.subscriberToChannel = req.body.subscriberToChannel   
    }
    try {
        const updateSubscriber = await req.subscriber.save()
        res.json(updateSubscriber)
    } catch (err) {
        res.status(400).json({ message : err.message})
    }
})


router.delete('/:id' , getSubscriber , async (req,res) =>{
    try {
        await req.subscriber.remove()

        res.status(200).json({ message : 'Successfully deleted'})
    } catch (err) {
        res.status(500).json({ message : err.message})
    }
})



async function getSubscriber (req, res , next ){
    let subscriber
    try {  
        if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            // Yes, it's a valid ObjectId, proceed with `findById` call.
             subscriber = await Subscriber.findById(req.params.id)
          }
        if(subscriber == null ){
            return res.status(404).json({ message : "Cannot find Subscriber"})
        }
    } catch (err) {
        return res.status(400).json({ message : err.message})
    }
    req.subscriber = subscriber
    next()
}


module.exports = router