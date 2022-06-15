import { query, getClient } from '../db/index.js';
import {
  createIndexes,
  updateCharacteristicReviews,
  populateRatings,
  setMetaAverages,
  setMetaCounts,
  setMetaIDs
} from './transform.js';

const createSchema = async () => {
  console.log('Creating Schema!');
  await query(`DROP SCHEMA IF EXISTS reviews CASCADE`);
  await query(`CREATE SCHEMA reviews`);
};

const createCharacteristics = async () => {
  console.log('Creating characteristics');
  await query(`DROP TABLE IF EXISTS characteristics`).then(() => {
    query(
      `CREATE TABLE characteristics (
        id                   INT  NOT NULL    PRIMARY KEY,
        product_id           INT  NOT NULL,
        name                 VARCHAR(50)
      )`
    )
      .then(() => {
        console.log('Created Table: Characteristics!');
        migrateCharacteristics();
      })
      .then(() => {
        query(`CREATE INDEX char_indx ON characteristics (id)`);
      });
  });
  return null;
};
// createCharacteristics();

const createCharacteristic_reviews = async () => {
  console.log('Creating characteristic_reviews');
  await query(`DROP TABLE IF EXISTS characteristic_reviews`);
  await query(
    `CREATE TABLE characteristic_reviews (
        id                   INT  NOT NULL    PRIMARY KEY,
        characteristic_id    INT      ,
        review_id            INT      ,
        value                INT
      )`
  );
  console.log('Created Table: Characteristic_reviews!');
  await migrateCharacteristic_reviews();
  await alterCharacteristic_reviewsTable();
};

const createReviews = async () => {
  console.log('Creating reviews');
  await query(`DROP TABLE if exists reviews`);
  await query(
    `CREATE TABLE reviews (
      id                   SERIAL    PRIMARY KEY,
      product_id           INT      ,
      rating               INT      ,
      date                 VARCHAR(20)      ,
      summary              VARCHAR(1000)      ,
      body                 VARCHAR(1000)      ,
      recommend            BOOLEAN      ,
      reported             BOOLEAN      ,
      reviewer_name        VARCHAR(100)      ,
      reviewer_email       VARCHAR(100)      ,
      response             VARCHAR(1000)      ,
      helpfulness          INT
    )`
  );
  console.log('Created Table: reviews!');
  await migrateReviews();
  await alterReviewsTable();
};

const createReviews_photos = async () => {
  console.log('Creating reviews_photos');
  await query(`DROP TABLE IF EXISTS reviews_photos`).then(() => {
    query(
      `CREATE TABLE reviews_photos (
        id                   SERIAL    PRIMARY KEY,
        review_id            INT      ,
        url                  VARCHAR(1000)
      )`
    ).then(() => {
      console.log('Created Table: reviews_photos!');
      migrateReviews_photos();
    });
  });
};

const createProduct = async () => {
  console.log('Creating product');
  await query(`DROP TABLE IF EXISTS product`);
  await query(
    `CREATE TABLE product (
        id                   INT  NOT NULL    PRIMARY KEY,
        name                 VARCHAR(150)      ,
        slogan               VARCHAR(1000)      ,
        description          VARCHAR(1000)      ,
        category             VARCHAR(150)      ,
        default_price        INT
      )`
  );

  console.log('Created Table: product!');
  await createMetas();
  await migrateProducts();

  await updateMetasTable();
};

const createMetas = async () => {
  console.log('Creating metas table');
  await query(`DROP TABLE IF EXISTS metas`);
  await query(
    `CREATE TABLE metas (
        prod_id              INT      ,
        recommend_count      INT      ,
        size_id              INT      ,
        size_avg             REAL     ,
        length_id            INT      ,
        length_avg           REAL   ,
        comfort_id           INT      ,
        comfort_avg          REAL  ,
        fit_id               INT      ,
        fit_avg              REAL      ,
        quality_id           INT      ,
        quality_avg          REAL  ,
        width_id             INT      ,
        width_avg            REAL    ,
        ratings_1            INT      ,
        ratings_2            INT      ,
        ratings_3            INT      ,
        ratings_4            INT      ,
        ratings_5            INT      ,
        CONSTRAINT pk_products PRIMARY KEY ( prod_id )
      )`
  );
};

const migrateCharacteristics = () => {
  console.log('Migrating data for characteristics');
  query(
    `COPY characteristics FROM '/Users/michaelzaki/Hack/SDC/SDC_DATA/characteristics.csv' DELIMITER ',' CSV HEADER;`
  )
    .then(() => {
      console.log('Copied characteristics!');
    })
    .catch((err) => {
      console.log(err);
    });
};
// migrateCharacteristics();

const migrateCharacteristic_reviews = async () => {
  console.log('Migrating data for characteristic_reviews');
  await query(
    `COPY characteristic_reviews FROM '/Users/michaelzaki/Hack/SDC/SDC_DATA/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;`
  )
    .then(() => {
      console.log('Copied characteristic_reviews!');
    })
    .catch((err) => {
      console.log(err);
    });
};

const migrateProducts = async () => {
  console.log('Migrating data for product');
  await query(
    `COPY product FROM '/Users/michaelzaki/Hack/SDC/SDC_DATA/product.csv' DELIMITER ',' CSV HEADER;`
  )
    .then(() => {
      console.log('Copied product!');
    })
    .catch((err) => {
      console.log(err);
    });
};

const migrateReviews = async () => {
  console.log('Migrating data for reviews');
  await query(
    `COPY reviews FROM '/Users/michaelzaki/Hack/SDC/SDC_DATA/reviews.csv' DELIMITER ',' CSV HEADER;`
  )
    .then(() => {
      console.log('Copied reviews!');
    })
    .catch((err) => {
      console.log(err);
    });
};

const migrateReviews_photos = () => {
  console.log('Migrating data for reviews_photos');
  query(
    `COPY reviews_photos FROM '/Users/michaelzaki/Hack/SDC/SDC_DATA/reviews_photos.csv' DELIMITER ',' CSV HEADER;`
  )
    .then(() => {
      console.log('Copied reviews_photos!');
    })
    .catch((err) => {
      console.log(err);
    });
};

const alterReviewsTable = async () => {
  console.log('Converting Date!');
  await query(
    `ALTER TABLE reviews RENAME COLUMN date TO created_at
    `
  );
  await query(`
    ALTER TABLE reviews ALTER COLUMN created_at TYPE timestamp(3) USING to_timestamp(created_at::BIGINT / 1000.0),
      ALTER COLUMN created_at SET DEFAULT LOCALTIMESTAMP(3);
    `);
  console.log('Date converted!');
};

const alterCharacteristic_reviewsTable = async () => {
  console.log('Adding Columns to characteristic_reviews');
  await query(
    `ALTER TABLE characteristic_reviews
      ADD COLUMN if not exists name        VARCHAR(150),
      ADD COLUMN if not exists product_id  INT
    `
  );
};

const updateMetasTable = async () => {
  await query(`INSERT INTO metas (prod_id)
          SELECT id
          FROM product
  `);
};

// getClient()
//   .then(async () => {
//     await createSchema();
//   })
//   .then(() => {
//     createCharacteristics();
//     createProduct();
//     createReviews();
//     createCharacteristic_reviews();
//     createReviews_photos();
//     createMetas();
//   })
//   .then(()=>{
//     createIndexes();
//   })
//   .then(()=>{
//     updateCharacteristicReviews;();
//   })
//   .then(()=>{
//     populateRatings();
//     setMetaCounts();
//     setMetaIDs();
//     setMetaTotals();
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const seed = async () => {
  try {
    await getClient();
    await createSchema();
    await Promise.all([
      await createCharacteristics(),
      await createProduct(),
      await createReviews(),
      await createCharacteristic_reviews(),
      await createReviews_photos()
    ]);
    await updateCharacteristicReviews();
    await createIndexes();
    await populateRatings();
    await setMetaAverages();
    await setMetaIDs();
  } catch (err) {
    console.log(err);
  }
};

seed();
