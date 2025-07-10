import express from 'express';
import { addproperty, listproperty, removeproperty, updateproperty,singleproperty } from '../controller/productcontroller.js';

import auth from '../middleware/auth.js';

const propertyrouter = express.Router();

propertyrouter.post('/add', addproperty);


propertyrouter.get('/list', listproperty);
propertyrouter.post('/remove',auth, removeproperty);
propertyrouter.post('/update',auth, updateproperty);
propertyrouter.get('/single/:id', singleproperty);

export default propertyrouter;