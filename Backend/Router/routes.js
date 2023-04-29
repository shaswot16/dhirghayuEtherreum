const express = require('express')
const router = express.Router()

const DB = require('../config/db')
const Doctor = require('../models/Schema1')
const Appointment=require("../models/Schema2")



const path = require("path")













router.get("/", (req, res) => res.render("demo"))


// router.post("/uploads", upload, (req, res) => {
//     upload(req, res, (err) => {
//         if (err) {
//             console.log(err)
//         } else {
//             console.log(req.file)
//             res.send("ok")
//         }
//     })
// })
// Create a new appointment
router.post('/bookingschema', async (req, res) => {
  console.log(req.body.doctname)
  console.log(req.body.patientname)
  console.log(req.body.appointmentday)
  const appointment = new Appointment({ doctname:req.body.doctname, patientname:req.body.patientname, appointmentday:req.body.appointmentday });
  try {
    const savedAppointment = await appointment.save()
    res.status(201).json(savedAppointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.post('/doctors', async (req, res) => {
  console.log(req.body.name)
  console.log(req.body.major)
  console.log(req.body.date)
  const existingDoctor= await Doctor.findOne({name:req.body.name})
  try{
  if(existingDoctor){
    existingDoctor.availability = [...existingDoctor.availability, ...req.body.date];
    await existingDoctor.save();
  }
  else{  
     const newDoctor = new Doctor({
        name: req.body.name,
        major: req.body.major,
        availability: req.body.date
      });
    
  
      // save the doctor object to the database
      const result = await newDoctor.save();
      // send the saved doctor document as the response
      res.send(result);
    }
    }catch (err) {
      console.log(err)
      // handle any errors that occur during the save operation
      res.status(500).send(err);
    }
  });

  router.post('/appointment', async (req, res) => {
    const { availableDates,name } = req.body;
  
    const doctor = await Doctor.findOne({ name: req.body.name });
    if (!doctor) {
      return res.status(404).send("Doctor not found");
    }
  
    const isAvailable = doctor.availability.some(avail => avail.toDateString().slice(0, 15) === new Date(availableDates).toDateString().slice(0, 15));
  
    if (isAvailable) {
      console.log("Doctor is available on the selected date.");
      return res.status(200).send("Doctor is available on the selected date.");
    } else {
      console.log("Doctor is not available on the selected date.");
      return res.status(404).send("Doctor is not available on the selected date.");
    }
  });
  router.post("/alldates",async (req,res)=>{
    const doctordates = await Doctor.findOne({ name:req.body.name }).populate("availability");
    if (!doctordates) {
      return res.status(404).send("Doctor not found");
    }
    const shortedDates = doctordates.availability.map(date => {
      return date.toDateString().slice(4, 15);
    });
    
    console.log(shortedDates)
    res.send(shortedDates)
  })
router.post('/datecheck', async (req, res) => {
  let {date} = req.body
  console.log({date})
    const doctor = await Doctor.findOne({ name: "Paribartan" }).populate("availability");

    
    // const isAvailable = doctor.availability.find(avail => avail.date === date.toISOString().slice(0, 10) && avail.isFree);
    // console.log(doctor.availability)
    
    // if (isAvailable) {
    //   console.log("Doctor is available on the selected date.");
    // } else {
    //   console.log("Doctor is not available on the selected date.");
    // }
    // return res.json(doctor.availability)
    // Find the availability for the selected date
  const availability = doctor.availability.find(a => a.date.toDateString().slice(0,10) === date.slice(0,10));

  if (!availability || !availability.isFree) {
    res.status(400).json({ message: 'The selected date is not available.' });
    console.log("OHH the date isn't available")
    return;
  }

  // Update the availability
  availability.isFree = false;
  await doctor.save();

  res.json({ message: 'The appointment is booked.' });
    
})


// Get all doctors' names
router.get('/allnames', async (req, res) => {
  try {
    const doctors = await Doctor.find({}, 'name');
    const names = doctors.map(doctor => doctor.name);
    res.send(names);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});


  
 
module.exports = router