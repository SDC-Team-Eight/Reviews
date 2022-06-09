CREATE SCHEMA `sdc reviews`;

CREATE TABLE `sdc reviews`.metas (
	prod_id              INT  NOT NULL    PRIMARY KEY,
	size_count           INT      ,
	size_avg             INT      ,
	length_count         INT      ,
	length_avg           INT      ,
	comfort_count        INT      ,
	comfort_avg          INT      ,
	fit_count            INT      ,
	fit_avg              INT      ,
	quality_avg          INT      ,
	quality_count        INT      ,
	review_count         INT      ,
	ratings_1            INT      ,
	ratings_2            INT      ,
	ratings_3            INT      ,
	ratings_4            INT      ,
	ratings_5            INT
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

