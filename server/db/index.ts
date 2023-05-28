import knexFile from './knexfile'
import knex from 'knex'
import type { Location, LocationData } from '../../models/Location'
import type { Event, EventData, EventWithLocation } from '../../models/Event'

type Environment = 'production' | 'test' | 'development'

const environment = (process.env.NODE_ENV || 'development') as Environment
const config = knexFile[environment]
const db = knex(config)

export async function getAllLocations() {
  return db('locations').select()
}

export async function getEventsByDay(day: string) {
  return db('events')
    .join('locations', 'locations.id', 'events.location_id')
    .select(
      'events.day as day',
      'events.name as eventName',
      'locations.name as locationName',
      'events.time as time',
      'events.description as description',
      'events.location_id as id'
    )
    .where('events.day', day)
}

export async function getLocationById(id: number) {
  return db('locations')
    .where('locations.id', id)
    .first()
    .select(
      'locations.name as name',
      'locations.id as id',
      'locations.description as description'
    )
}

export async function updateLocation(updatedLocation: Location) {
  return db('locations')
    .where('locations.id', updatedLocation.id)
    .update(updatedLocation)
}
