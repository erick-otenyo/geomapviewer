CREATE OR REPLACE FUNCTION postgisftw.repair_geojson_geometry(geojson_str text, geometry_type integer)
RETURNS TABLE(geojson text)
AS $$
BEGIN
	RETURN QUERY
    SELECT ST_AsGeoJson(ST_CollectionExtract(st_MakeValid(ST_GeomFromGeoJSON(geojson_str)), geometry_type)) as geojson;
END;
$$
LANGUAGE 'plpgsql' STABLE PARALLEL SAFE;

COMMENT ON FUNCTION postgisftw.repair_geojson_geometry IS 'Repair geoJSON geometry';