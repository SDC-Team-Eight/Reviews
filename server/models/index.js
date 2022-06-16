import { query, getClient } from '../db/index.js';

export const getAllReviews = async (prodID, sort, count, offset, page) => {
  let queryStr = `SELECT json_build_object(
    'product', ${prodID}::integer,
    'page', ${page}::integer,
    'count', ${count}::integer,
    'results', (
      SELECT array_agg(
        json_build_object(
          'id',          id,
          'rating',      rating,
          'summary',     summary,
          'date',        created_at,
          'review_name', reviewer_name,
          'helpfulness', helpfulness,
          'photos', (
            SELECT array_agg(
              json_build_object(
                'id',   id,
                'url',  url
              )
            ) FROM reviews_photos
              WHERE review_id = reviews.id
          )
        )
      ) as results
        FROM reviews
        WHERE product_id = ${prodID} GROUP BY id
        ORDER BY ${sort} LIMIT ${count} OFFSET ${offset}
    )
  );`;
  let params = [prodID, sort, count, offset, page];
  try {
    await getClient();
    const res = await query(queryStr);
    console.log(res.rows[0]);
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const getMetas = async (productID) => {
  let queryStr = `SELECT (
    json_build_object(
      'product_id',   prod_id,
      'ratings',      json_build_object(
        '1', ratings_1,
        '2', ratings_2,
        '3', ratings_3,
        '4', ratings_4,
        '5', ratings_5
      ),
      'recommend', recommend_count,
      'characteristics', json_build_object(
        'Fit', json_build_object(
          'id',    fit_id,
          'value', fit_avg
        ) ,
        'Comfort', json_build_object(
          'id',    comfort_id,
          'value', comfort_avg
        ),
        'Width', json_build_object(
          'id',    width_id,
          'value', width_avg
        ),
        'Length', json_build_object(
          'id',    length_id,
          'value', length_avg
        ),
        'Quality', json_build_object(
          'id',    quality_id,
          'value', quality_avg
        ),
        'Size', json_build_object(
          'id',    size_id,
          'value', size_avg
        )
      )
    )
  ) FROM metas WHERE prod_id = ${productID}`;
  try {
    await getClient();
    const res = await query(queryStr, [productID]);
    return res.rows[0].json_build_object;
  } catch (err) {
    console.log(err);
  }
};

export const updateReport = async (review_id) => {
  let queryStr = `UPDATE reviews SET reported = true WHERE id = ${review_id}`;
  await getClient();
  await query(queryStr, [review_id]).catch((err) => {
    console.log(err);
  });
};

export const updateHelpful = async (review_id) => {
  let queryStr = `UPDATE reviews SET helpfulness = helpfulness + 1 WHERE id = ${review_id}`;
  await getClient();
  await query(queryStr).catch((err) => {
    err;
  });
};
