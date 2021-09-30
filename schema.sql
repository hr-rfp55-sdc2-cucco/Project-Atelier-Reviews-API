CREATE TABLE product (
 id SERIAL,
 name TEXT,
 slogan TEXT,
 description TEXT,
 category TEXT,
 default_price DECIMAL
);


ALTER TABLE product ADD CONSTRAINT product_pkey PRIMARY KEY (id);
COMMENT ON TABLE "product" IS 'Table listing the products that have reviews.';

CREATE TABLE reviews (
 id SERIAL,
 product_id INTEGER,
 rating INTEGER,
--  date TIMESTAMP,
 date BIGINT,
 summary TEXT,
 body TEXT,
 recommend BOOLEAN,
 reported BOOLEAN,
 reviewer_name TEXT,
 reviewer_email TEXT,
 response TEXT,
 helpfulness INTEGER
);


ALTER TABLE reviews ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);
COMMENT ON TABLE "reviews" IS 'Main table for reviews. Each review is tied to a product ID.';

CREATE TABLE reviews_photos (
 id SERIAL,
 review_id INTEGER,
 url TEXT
);


ALTER TABLE reviews_photos ADD CONSTRAINT reviews_photos_pkey PRIMARY KEY (id);
COMMENT ON TABLE "reviews_photos" IS 'Photo table. Each photo is tied to a review ID.';

CREATE TABLE characteristics (
 id SERIAL,
 product_id INTEGER,
 name TEXT
);


ALTER TABLE characteristics ADD CONSTRAINT characteristics_pkey PRIMARY KEY (id);
COMMENT ON TABLE "characteristics" IS 'Characteristics for each product. Each product will have many characteristics, with different number/selection of characteristics for each product.';

CREATE TABLE characteristic_reviews (
 id SERIAL,
 characteristic_id INTEGER,
 review_id INTEGER,
 value INTEGER
);


ALTER TABLE characteristic_reviews ADD CONSTRAINT characteristic_reviews_pkey PRIMARY KEY (id);

ALTER TABLE reviews ADD CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES product(id);
ALTER TABLE reviews_photos ADD CONSTRAINT reviews_photos_review_id_fkey FOREIGN KEY (review_id) REFERENCES reviews(id);
ALTER TABLE characteristics ADD CONSTRAINT characteristics_product_id_fkey FOREIGN KEY (product_id) REFERENCES product(id);
ALTER TABLE characteristic_reviews ADD CONSTRAINT characteristic_reviews_characteristic_id_fkey FOREIGN KEY (characteristic_id) REFERENCES characteristics(id);
ALTER TABLE characteristic_reviews ADD CONSTRAINT characteristic_reviews_review_id_fkey FOREIGN KEY (review_id) REFERENCES reviews(id);