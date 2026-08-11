UPDATE "Product"
SET
  "description" = replace(
    replace("description", 'A+ grade refurbished', 'A+ grade renewed'),
    'A+ Grade Refurbished',
    'A+ Grade Renewed'
  ),
  "specifications" = CASE
    WHEN jsonb_typeof("specifications") = 'object'
      AND "specifications" ? 'condition'
      AND lower("specifications" ->> 'condition') LIKE '%refurbished%'
    THEN jsonb_set(
      "specifications",
      '{condition}',
      to_jsonb(replace("specifications" ->> 'condition', 'refurbished', 'renewed')),
      false
    )
    ELSE "specifications"
  END,
  "updatedAt" = CURRENT_TIMESTAMP
WHERE "condition" = 'REFURBISHED';
