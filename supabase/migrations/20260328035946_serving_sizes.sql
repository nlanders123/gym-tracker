-- Add serving size support to saved_meals
-- Existing macros become "per serving" values
-- serving_size is the base quantity (e.g. 100 for "100g", 1 for "1 cup")
-- serving_unit is free text to support any unit

alter table saved_meals
  add column serving_size numeric not null default 1,
  add column serving_unit text;

-- Existing saved meals remain unchanged: serving_size=1, no unit = "1 serving"
