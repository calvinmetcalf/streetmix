const routes = require('express').Router()
const bodyParser = require('body-parser')
const cors = require('cors')
const resources = require('./app/resources')

// Enable CORS for all OPTIONs "pre-flight" requests
routes.options('/api/*', cors())

// API: all users
routes.post('/api/v1/users', cors(), resources.v1.users.post)
routes.get('/api/v1/users', cors(), resources.v1.users.get)

// API: single user
routes.get('/api/v1/users/:user_id', cors(), resources.v1.user.get)
routes.put('/api/v1/users/:user_id', cors(), resources.v1.user.put)
routes.delete('/api/v1/users/:user_id', cors(), resources.v1.user.delete)

// API: single user sign-in state
routes.delete('/api/v1/users/:user_id/login-token', cors(), resources.v1.user_session.delete)

// API: single user streets
routes.delete('/api/v1/users/:user_id/streets', cors(), resources.v1.users_streets.delete)
routes.get('/api/v1/users/:user_id/streets', cors(), resources.v1.users_streets.get)

// API: all streets
/**
 * @swagger
 *
 * definitions:
 *   Segment:
 *     type: object
 *     required:
 *       - type
 *       - width
 *       - variantString
 *     properties:
 *       type:
 *         type: string
 *       variantString:
 *         type: string
 *       width:
 *         type: integer
 *       randSeed:
 *         type: integer
 *   StreetData:
 *     type: object
 *     properties:
 *       street:
 *         type: object
 *         properties:
 *           schemaVersion:
 *             type: integer
 *           width:
 *             type: integer
 *           id:
 *             type: string
 *             format: uuid
 *           units:
 *             type: number
 *           location:
 *             type: object
 *           userUpdated:
 *             type: boolean
 *           environment:
 *             type: string
 *           leftBuildingHeight:
 *             type: string
 *           rightBuildingHeight:
 *             type: string
 *           segments:
 *             type: array
 *             items:
 *               $ref: '#/definitions/Segment'
 *           editCount:
 *             type: integer
 *   NewStreetImage:
 *     $ref: '#/definitions/StreetImageData'
 *   NewStreet:
 *     type: object
 *     required:
 *       - data
 *       - password
 *     properties:
 *       name:
 *         type: string
 *       data:
 *         $ref: '#/definitions/StreetData'
 *   Street:
 *     type: object
 *     required:
 *       - id
 *     properties:
 *       id:
 *         type: string
 *         format: uuid
 *       namespacedId:
 *         type: integer
 *         format: int64
 *       status:
 *         type: string
 *         example: "ACTIVE"
 *       name:
 *         type: string
 *       creator_id:
 *         type: string
 *       creator_ip:
 *         type: string
 *       data:
 *         $ref: '#/definitions/StreetData'
 *       createdAt:
 *         type: string
 *         format: date-time
 *       updatedAt:
 *         type: string
 *         format: date-time
 */

/**
 * @swagger
 *
 * /v1/streets:
 *   post:
 *     description: Creates a street
 *     tags:
 *       - streets
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: street
 *         description: Street object
 *         in:  body
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/NewStreet'
 *     responses:
 *       200:
 *         description: Streets
 *         schema:
 *           $ref: '#/definitions/Street'
 */
routes.post('/api/v1/streets', resources.v1.streets.post)

/**
 * @swagger
 * /v1/streets/:
 *   get:
 *     description: Returns streets
 *     parameters:
 *       - in: query
 *         name: creatorId
 *         schema:
 *           type: string
 *       - in: query
 *         name: namespaceId
 *         schema:
 *           type: string
 *       - in: query
 *         name: start
 *         schema:
 *           type: number
 *           example: 0
 *       - in: query
 *         name: count
 *         schema:
 *           type: number
 *           example: 20
 *     tags:
 *       - streets
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: streets
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Street'
 *   head:
 *     description: Returns streets
 *     parameters:
 *       - in: query
 *         name: creatorId
 *         schema:
 *           type: string
 *       - in: query
 *         name: namespaceId
 *         schema:
 *           type: string
 *       - in: query
 *         name: start
 *         schema:
 *           type: number
 *           example: 0
 *       - in: query
 *         name: count
 *         schema:
 *           type: number
 *           example: 20
 *     tags:
 *       - streets
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: streets
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Street'
 */
routes.get('/api/v1/streets', resources.v1.streets.find)
routes.head('/api/v1/streets', resources.v1.streets.find)

/**
 * @swagger
 * /v1/streets/{street_id}:
 *   delete:
 *     description: Deletes street
 *     tags:
 *       - streets
 *     parameters:
 *      - in: path
 *        name: street_id
 *        schema:
 *          type: string
 *          format: uuid
 *        required: true
 *        description: ID of the street to delete
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: streets
 *         schema:
 *           $ref: '#/definitions/Street'
 *   head:
 *     description: Returns street
 *     tags:
 *       - streets
 *     parameters:
 *      - in: path
 *        name: street_id
 *        schema:
 *          type: string
 *          format: uuid
 *        required: true
 *        description: ID of the street to get
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: streets
 *         schema:
 *           $ref: '#/definitions/Street'
 *   get:
 *     description: Returns street
 *     tags:
 *       - streets
 *     parameters:
 *      - in: path
 *        name: street_id
 *        schema:
 *          type: string
 *          format: uuid
 *        required: true
 *        description: ID of the street to get
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: streets
 *         schema:
 *           $ref: '#/definitions/Street'
 *   put:
 *     description: Updates street
 *     tags:
 *       - streets
 *     parameters:
 *      - in: path
 *        name: street_id
 *        schema:
 *          type: string
 *          format: uuid
 *        required: true
 *        description: ID of the street to update
 *      - in: body
 *        name: name
 *        schema:
 *          type: string
 *      - in: body
 *        name: originalStreetId
 *        schema:
 *          type: string
 *          format: uuid
 *      - in: body
 *        name: data
 *        description: Street data
 *        required: true
 *        type: string
 *        schema:
 *          $ref: '#/definitions/StreetData'
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: streets
 *         schema:
 *           $ref: '#/definitions/Street'
 *
*/
routes.delete('/api/v1/streets/:street_id', resources.v1.streets.delete)
routes.head('/api/v1/streets/:street_id', resources.v1.streets.get)
routes.get('/api/v1/streets/:street_id', resources.v1.streets.get)
routes.put('/api/v1/streets/:street_id', resources.v1.streets.put)

/**
 * @swagger
 * /v1/streets/images/{street_id}:
 *   delete:
 *     description: Deletes street thumbnail from cloudinary
 *     tags:
 *       - thumbnails
 *     parameters:
 *      - in: path
 *        name: street_id
 *        schema:
 *          type: string
 *          format: uuid
 *        required: true
 *        description: ID of the street
 *     produces:
 *      - application/json
 *     responses:
 *       204:
 *         description: Success
 *   get:
 *     description: Returns street thumbnail from cloudinary, mainly used to set metatag information for social sharing cards
 *     tags:
 *       - thumbnails
 *     parameters:
 *      - in: path
 *        name: street_id
 *        schema:
 *          type: string
 *          format: uuid
 *        required: true
 *        description: ID of the street
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: street image
 *         schema:
 *           $ref: '#/definitions/StreetImageData'
 *       204:
 *         description: Empty response. The owner of this street has deleted the thumbnail.
 *   post:
 *     description: Updates street
 *     tags:
 *       - thumbnails
 *     parameters:
 *       - in: path
 *         name: street_id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the street to update
 *       - in: body
 *         name: street image
 *         description: Street image object
 *         required: true
 *         type: string
 *         schema:
 *           $ref: '#/definitions/NewStreetImage'
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: street image
 *         schema:
 *           $ref: '#/definitions/StreetImageData'
 *
*/
routes.post('/api/v1/streets/images/:street_id', bodyParser.text({ limit: '3mb' }), resources.v1.street_images.post)
routes.delete('/api/v1/streets/images/:street_id', resources.v1.street_images.delete)
routes.get('/api/v1/streets/images/:street_id', resources.v1.street_images.get)

routes.get('/api/v1/geo', cors(), resources.v1.geo.get)

routes.get('/api/v1/translate/:locale_code/:resource_name', resources.v1.translate.get)

routes.get('/api/v1/flags', cors(), resources.v1.flags.get)

// Catch all for all broken api paths, direct to 404 response.
routes.get('/api/*', (req, res) => {
  res.status(404).json({ status: 404, error: 'Not found. Did you mispell something?' })
})

module.exports = routes
