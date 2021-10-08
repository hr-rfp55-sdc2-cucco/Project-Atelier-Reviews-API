-- Initialize table schemas

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

-- Add foreign keys to tables

ALTER TABLE reviews ADD CONSTRAINT reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES product(id);
ALTER TABLE reviews_photos ADD CONSTRAINT reviews_photos_review_id_fkey FOREIGN KEY (review_id) REFERENCES reviews(id);
ALTER TABLE characteristics ADD CONSTRAINT characteristics_product_id_fkey FOREIGN KEY (product_id) REFERENCES product(id);
ALTER TABLE characteristic_reviews ADD CONSTRAINT characteristic_reviews_characteristic_id_fkey FOREIGN KEY (characteristic_id) REFERENCES characteristics(id);
ALTER TABLE characteristic_reviews ADD CONSTRAINT characteristic_reviews_review_id_fkey FOREIGN KEY (review_id) REFERENCES reviews(id);

CREATE INDEX characteristic_reviews_characteristic_id_idx
    ON public.characteristic_reviews USING btree
    (characteristic_id ASC NULLS LAST)
;

CREATE INDEX characteristic_reviews_review_id_idx
    ON public.characteristic_reviews USING btree
    (review_id ASC NULLS LAST)
;

CREATE INDEX characteristics_product_id_idx
    ON public.characteristics USING btree
    (product_id ASC NULLS LAST)
;

CREATE INDEX reviews_product_id_idx
    ON public.reviews USING btree
    (product_id ASC NULLS LAST)
;

CREATE INDEX reviews_photos_review_id_idx
    ON public.reviews_photos USING btree
    (review_id ASC NULLS LAST)
;

-- Import data using 'copy' command
-- copy product from '/Users/bishalgautam/Desktop/2021/Hack Reactor/SDC/product.csv' DELIMITER ',' CSV HEADER;
-- copy characteristics (id, product_id, name) from '/Users/bishalgautam/Desktop/2021/Hack Reactor/SDC/characteristics.csv' DELIMITER ',' CSV HEADER;
-- copy reviews (id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) from '/Users/bishalgautam/Desktop/2021/Hack Reactor/SDC/reviews.csv' DELIMITER ',' CSV HEADER;
-- copy characteristic_reviews (id, characteristic_id, review_id, value) from '/Users/bishalgautam/Desktop/2021/Hack Reactor/SDC/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;
-- copy reviews_photos (id, review_id, url) from '/Users/bishalgautam/Desktop/2021/Hack Reactor/SDC/reviews_photos.csv' DELIMITER ',' CSV HEADER;
copy product from '/Users/dhoaintloyal/HackReactor/SEI/Capstones/System-Design-Capstone/Data/Used/product.csv' DELIMITER ',' CSV HEADER;
copy reviews from '/Users/dhoaintloyal/HackReactor/SEI/Capstones/System-Design-Capstone/Data/Used/reviews.csv' DELIMITER ',' CSV HEADER;
copy reviews_photos from '/Users/dhoaintloyal/HackReactor/SEI/Capstones/System-Design-Capstone/Data/Used/reviews_photos.csv' DELIMITER ',' CSV HEADER;
copy characteristics from '/Users/dhoaintloyal/HackReactor/SEI/Capstones/System-Design-Capstone/Data/Used/characteristics.csv' DELIMITER ',' CSV HEADER;
copy characteristic_reviews from '/Users/dhoaintloyal/HackReactor/SEI/Capstones/System-Design-Capstone/Data/Used/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;

-- Change 'date' format from bigint to timestamp w/ timezone for Reviews table
ALTER TABLE reviews
ALTER COLUMN date SET DATA TYPE timestamp with time zone
USING
timestamp with time zone 'epoch' + date * interval '1 millisecond';