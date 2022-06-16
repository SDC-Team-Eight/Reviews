import { getClient } from './db/index.js';
// require('dotenv').config();
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import path from 'path';
import {
  getAllReviews,
  getMetas,
  updateReport,
  updateHelpful
} from './models/index.js';

const app = express();
app.use(express.json());
getClient().catch((err)=>{console.log(err)});
app.get('/reviews', async (req, res) => {
  // handle prodID
  if (isNaN(Number(req.query.product_id))) {
    console.log('INVALID ID');
    res.sendStatus(400);
    return;
  }
  const prodID = Number(req.query.product_id);
  // handle count
  let count = 5;
  if ('count' in req.query) {
    if (isNaN(Number(req.query.count))) {
      console.log('INVALID COUNT');
      res.sendStatus(400);
      return;
    }
    count = Number(req.query.count);
  }
  // handle page
  let page = 1;
  if ('page' in req.query) {
    if (isNaN(Number(req.query.page))) {
      console.log('INVALID PAGE');
      res.sendStatus(400);
      return;
    }
    page = Number(req.query.page);
  }
  // handle sort
  let sort = 'id ASC';
  if ('sort' in req.query) {
    switch (req.query.sort) {
      case 'newest':
        sort = 'date DESC';
        break;
      case 'relevant':
        sort = 'rating DESC';
        break;
      case 'helpful':
        sort = 'helpfulness DESC';
        break;
      default:
        sort = 'id ASC';
    }
  }
  const offset = (page - 1) * count;

  // finally call db
  // const productReviews = await getAllReviews(prodID, sort, count, offset, page);
  // if (getAllReviews === false) {
  //   res.sendStatus(400);
  // } else {
  //   res.send(getAllReviews).status(200);
  // }
  getAllReviews(prodID, sort, count, offset, page)
    .then((results) => {
      console.log(results);
      res.send(results);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get('/reviews/metas', async (req, res) => {
  if (isNaN(Number(req.query.product_id))) {
    console.log('INVALID ID');
    res.sendStatus(400);
    return;
  }
	//console.log('check');
  const prodID = Number(req.query.product_id);
  // const productMetas = await getMetas(prodID);
  // if (getMetas) {
  //   res.send(getMetas).status(200);
  // } else {
  //   res.sendStatus(400);
  // }
  getMetas(prodID)
    .then((results) => {
     // console.log(results);
      res.send(results);
    })
    .catch((err) => console.log(err));
});

app.put(`/reviews/:review_id/report`, async (req, res) => {
  const review_id = Number(req.params.review_id);
  console.log(review_id);
  await updateReport(review_id);
  res.sendStatus(201);
});
app.put(`/reviews/:review_id/helpful`, async (req, res) => {
  const review_id = Number(req.params.review_id);
  console.log(review_id);
  await updateHelpful(review_id);
  res.sendStatus(201);
});

app.get('/loaderio-3364e5ade73d58d2f6a0e91c42b038c6', (req, res) => {
	res.status(200).send('loaderio-3364e5ade73d58d2f6a0e91c42b038c6');
	});

app.listen(process.env.PORT || 3000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(
      `Listening at ${process.env.DB_HOST}: ${process.env.DB_PORT || 3000}`
    );
  }
});
