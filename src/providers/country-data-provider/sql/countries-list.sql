CREATE OR REPLACE FUNCTION postgisftw.africa_countries_list(country_iso text default '')
RETURNS TABLE(iso text, name text, bbox text)
AS $$
BEGIN
    IF coalesce(TRIM(country_iso), '') = '' THEN
        RETURN QUERY
            SELECT t.gid_0::text as iso,
                t.name_0::text as name,
                t.bbox::text as bbox
            FROM pgadapter.africa_gadm36_countries t
            ORDER BY t.name_1;
    ELSE
        RETURN QUERY
            SELECT t.gid_0::text as iso,
                    t.name_0::text as name,
                    t.bbox::text as bbox
            FROM pgadapter.africa_gadm36_countries t
            WHERE t.gid_0 = country_iso
            ORDER BY t.name_1;
    END IF;
END;
$$
LANGUAGE 'plpgsql' STABLE PARALLEL SAFE;

COMMENT ON FUNCTION postgisftw.africa_countries_list IS 'Get all africa countries, filtering by iso if needed';

