import express from 'express'

import { eventDays, capitalise, validateDay } from './helpers'
import * as db from '../db'

const router = express.Router()
export default router

// GET /events/add/friday
router.get('/add/:day', async (req, res) => {
  const day = validateDay(req.params.day)
  const days = eventDays.map((eventDay) => ({
    value: eventDay,
    name: capitalise(eventDay),
    selected: eventDay === day ? 'selected' : '',
  }))

  const locations = await db.getAllLocations()

  const viewData = { locations, days, day }
  res.render('addEvent', viewData)
})

// POST /events/add
router.post('/add', async (req, res) => {
  const day = validateDay(req.body.day)

  const event = { ...req.body }

  await db.addNewEvent(event)

  res.redirect(`/schedule/${day}`)
})

// POST /events/delete
router.post('/delete', async (req, res) => {
  const id = Number(req.body.id)
  const day = validateDay(req.body.day)

  await db.deleteEvent(id)

  res.redirect(`/schedule/${day}`)
})

// GET /events/3/edit
router.get('/:id/edit', async (req, res) => {
  const id = Number(req.params.id)

  const event = await db.getEventsById(id)

  const locations = await db.getAllLocations()

  locations.map((element) => {
    if (element.id === event.location_id) {
      return { ...element, selected: 'selected' }
    } else {
      return { ...element, selected: '' }
    }
  })

  const days = eventDays.map((eventDay) => ({
    value: eventDay,
    name: capitalise(eventDay),
    selected: eventDay === event.day ? 'selected' : '',
  }))

  const viewData = { event, locations, days }
  res.render('editEvent', viewData)
})

// POST /events/edit
router.post('/edit', async (req, res) => {
  const { name, description, time } = req.body
  const id = Number(req.body.id)
  const day = validateDay(req.body.day)
  const locationId = Number(req.body.locationId)

  const updatedEvent = {
    name,
    description,
    time,
    id,
    day,
    location_id: locationId,
  }

  await db.updateEvent(updatedEvent)

  res.redirect(`/schedule/${day}`)
})
