import express from 'express'

import * as db from '../db'

const router = express.Router()

// GET /locations
router.get('/', async (req, res) => {
  // TODO: Replace this with all of the locations in the database
  const locations = await db.getAllLocations()

  const viewData = { locations }
  res.render('showLocations', viewData)
})

// GET /locations/4/edit
router.get('/:id/edit', async (req, res) => {
  const id = Number(req.params.id)

  const getId = await db.getLocationById(id)

  const viewData = {
    id,
    getId,
  }

  res.render('editLocation', viewData)
})

// POST /locations/edit
router.post('/edit', async (req, res) => {
  // ASSISTANCE: So you know what's being posted ;)
  const { id, name, description } = req.body

  await db.updateLocation({ id, name, description })

  // TODO: Update the location in the database based on its id

  res.redirect('/locations')
})

export default router
