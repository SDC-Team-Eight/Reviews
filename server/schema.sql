CREATE SCHEMA `sdc reviews`;

CREATE TABLE `sdc reviews`.metas (
	prod_id              integer  NOT NULL    PRIMARY KEY,
	size_count           integer default 0      ,
	size_id              integer default 0      ,
	length_count         integer default 0      ,
	length_id            integer default 0      ,
	comfort_count        integer default 0      ,
	comfort_id           integer default 0      ,
	fit_count            integer default 0      ,
	fit_id               integer default 0      ,
	quality_count        integer default 0      ,
	quality_id           integer default 0      ,
	review_count         integer default 0      ,
	recommend_count      integer default 0      ,
	ratings_1            integer default 0      ,
	ratings_2            integer default 0      ,
	ratings_3            integer default 0      ,
	ratings_4            integer default 0      ,
	ratings_5            integer default 0
 );

CREATE TABLE `sdc reviews`.photos (
	id                   INT  NOT NULL    PRIMARY KEY,
	reviews_id           INT  NOT NULL    ,
	url_id               INT      ,
	url                  VARCHAR(100)      ,
  CONSTRAINT unq_photos_reviews_id UNIQUE ( reviews_id )
 ) engine=InnoDB;

CREATE TABLE `sdc reviews`.reviews (
	id                   INT  NOT NULL    PRIMARY KEY,
	prod_id              INT  NOT NULL    ,
	rating               INT  NOT NULL    ,
	body                 VARCHAR(1000)  NOT NULL    ,
	summary              VARCHAR(60)  NOT NULL    ,
	recommend            BOOLEAN      ,
	name                 VARCHAR(60)  NOT NULL    ,
	email                VARCHAR(60)  NOT NULL    ,
	created_at           DATE   DEFAULT (CURRENT_DATE)   ,
	helpful              INT   DEFAULT (0)   ,
	response             VARCHAR(1000)   DEFAULT (Null)   ,
	reported             BOOLEAN   DEFAULT (false)   ,
	fit                  INT      ,
	comfort              INT      ,
	size                 INT      ,
	width                INT      ,
	quality              INT      ,
	CONSTRAINT fk_reviews_photos FOREIGN KEY ( id ) REFERENCES `sdc reviews`.photos( reviews_id ) ON DELETE NO ACTION ON UPDATE NO ACTION
 ) engine=InnoDB;

CREATE TABLE `Reviews Data Migration`.characteristics (
	id                   INT  NOT NULL    PRIMARY KEY,
	product_id           INT  NOT NULL,
	name                 INT
)
/COPY `Reviews Data Migration`.characteristics FROM `documents/SDC DATA/characteristic_reviews.csv` DELIMITER ',' CSV HEADER;