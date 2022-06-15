import { query, getClient } from '../db/index.js';

export const createIndexes = async () => {
  await Promise.all([
    await query(`ALTER TABLE reviews_photos
       ADD CONSTRAINT fk_reviews_photos_reviews
       FOREIGN KEY ( review_id )
       REFERENCES reviews( id )`),
    await query(
      'CREATE INDEX cr_name_indx         ON characteristic_reviews (name)'
    ),
    await query(
      'CREATE INDEX cr_prod_indx         ON characteristic_reviews (product_id)'
    ),
    await query(
      'CREATE INDEX cr_reviewsID_indx    ON characteristic_reviews (review_id)'
    ),
    await query(
      'CREATE INDEX cr_id_indx           ON characteristic_reviews (id)'
    ),
    await query('CREATE INDEX rev_id_indx          ON reviews (id)'),
    await query('CREATE INDEX rev_prod_indx        ON reviews (product_id)'),
    await query('CREATE INDEX rev_rating_indx      ON reviews (rating)'),
    await query('CREATE INDEX rev_date_indx        ON reviews (created_at)'),
    await query('CREATE INDEX rev_help_indx        ON reviews (helpfulness)'),
    await query(
      'CREATE INDEX rp_reviewsID_indx    ON reviews_photos (review_id)'
    ),
    await query('CREATE INDEX prod_indx            ON product (id)'),
    await query('CREATE INDEX metas_prodID_indx    ON metas (prod_id)')
  ]);
};

export const updateCharacteristicReviews = async () => {
  console.log('Updating characteristic reviews');
  await query(`UPDATE characteristic_reviews as cr
          SET name = characteristics.name,
              product_id = characteristics.product_id
          FROM characteristics
          WHERE characteristics.id = cr.characteristic_id
  `)
    .then(() => {
      console.log('char_reviews updated!');
      // putMetasInReviews();
    })
    .catch((err) => {
      console.log(err);
    });
};

export const populateRatings = async () => {
  Promise.all([
    await query(`UPDATE metas SET recommend_count =
          (SELECT count(*) FROM reviews
            WHERE product_id = metas.prod_id
            AND recommend = true)
    `),
    //   await query(`UPDATE metas SET reviews_count =
    //         (SELECT count(*) FROM reviews
    //           WHERE product_id = metas.prod_id
    // )`),
    await query(`UPDATE metas SET ratings_1 =
          (SELECT count(*) FROM reviews
            WHERE reviews.product_id = metas.prod_id
            AND reviews.rating = 1
  )`),
    await query(`UPDATE metas SET ratings_2 =
          (SELECT count(*) FROM reviews
            WHERE reviews.product_id = metas.prod_id
            AND reviews.rating = 2
  )`),
    await query(`UPDATE metas SET ratings_3 =
          (SELECT count(*) FROM reviews
            WHERE reviews.product_id = metas.prod_id
            AND reviews.rating = 3
  )`),
    await query(`UPDATE metas SET ratings_4 =
          (SELECT count(*) FROM reviews
            WHERE reviews.product_id = metas.prod_id
            AND reviews.rating = 4
  )`),
    await query(`UPDATE metas SET ratings_5 =
          (SELECT count(*) FROM reviews
            WHERE reviews.product_id = metas.prod_id
            AND reviews.rating = 5
  )`)
  ]);
};

export const setMetaAverages = async () => {
  await Promise.all([
    await query(`UPDATE metas SET fit_avg =
          (SELECT avg(value) FROM characteristic_reviews
            WHERE product_id = metas.prod_id
            AND name = 'Fit'
          )
  `),
    await query(`UPDATE metas SET width_avg =
          (SELECT avg(value) FROM characteristic_reviews
            WHERE product_id = metas.prod_id
            AND name = 'Width'
          )
  `),
    await query(`UPDATE metas SET size_avg =
          (SELECT avg(value) FROM characteristic_reviews
            WHERE product_id = metas.prod_id
            AND name = 'Size'
          )
  `),
    await query(`UPDATE metas SET length_avg =
          (SELECT avg(value) FROM characteristic_reviews
            WHERE product_id = metas.prod_id
            AND name = 'Length'
          )
  `),
    await query(`UPDATE metas SET comfort_avg =
          (SELECT avg(value) FROM characteristic_reviews
            WHERE product_id = metas.prod_id
            AND name = 'Comfort'
          )
  `),
    await query(`UPDATE metas SET quality_avg =
          (SELECT avg(value) FROM characteristic_reviews
            WHERE product_id = metas.prod_id
            AND name = 'Quality'
          )
  `)
  ]);
};

export const setMetaCounts = async () => {
  await Promise.all([
    await query(`UPDATE metas SET quality_count =
          (SELECT count(*) FROM characteristic_reviews
            WHERE product_id = metas.prod_id
            AND name = 'Quality'
          )
  `),
    await query(`UPDATE metas SET width_count =
          (SELECT count(*) FROM characteristic_reviews
            WHERE product_id = metas.prod_id
            AND name = 'Width'
          )
  `),
    await query(`UPDATE metas SET length_count =
          (SELECT count(*) FROM characteristic_reviews
            WHERE product_id = metas.prod_id
            AND name = 'Length'
          )
  `),
    await query(`UPDATE metas SET fit_count =
          (SELECT count(*) FROM characteristic_reviews
            WHERE product_id = metas.prod_id
            AND name = 'Fit'
          )
  `),
    await query(`UPDATE metas SET comfort_count =
          (SELECT count(*) FROM characteristic_reviews
            WHERE product_id = metas.prod_id
            AND name = 'Comfort'
          )
  `),
    await query(`UPDATE metas SET size_count =
          (SELECT count(*) FROM characteristic_reviews
            WHERE product_id = metas.prod_id
            AND name = 'Size'
          )
  `)
  ]);
};

export const setMetaIDs = async () => {
  console.log('SIZE ID');
  await query(`UPDATE metas SET size_id = id
          FROM characteristic_reviews
          WHERE product_id = metas.prod_id
            AND name = 'Size'`);
  console.log('FIT ID');
  await query(`UPDATE metas SET fit_id = id
      FROM characteristic_reviews
      WHERE product_id = metas.prod_id
        AND name = 'Fit'`);
  console.log('LENGTH ID');
  await query(`UPDATE metas SET length_id = id
      FROM characteristic_reviews
      WHERE product_id = metas.prod_id
        AND name = 'Length'
  `);
  console.log('WIDTH ID');
  await query(`UPDATE metas SET width_id = id
          FROM characteristic_reviews
          WHERE product_id = metas.prod_id
            AND name = 'Width'
  `);
  console.log('QUALITY ID');
  await query(`UPDATE metas SET quality_id = id
          FROM characteristic_reviews
          WHERE product_id = metas.prod_id
            AND name = 'Quality'`);
  console.log('COMFORT ID');
  await query(`UPDATE metas SET comfort_id = id
          FROM characteristic_reviews
          WHERE product_id = metas.prod_id
            AND name = 'Comfort'
  `);
};
