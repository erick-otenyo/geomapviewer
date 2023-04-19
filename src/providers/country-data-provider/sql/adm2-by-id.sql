CREATE OR REPLACE FUNCTION postgisftw.africa_adm2_by_id(adm2_id text)
RETURNS TABLE(id text, name_0 text, name_1 text, name_2 text)
AS $$
BEGIN
	RETURN QUERY
		SELECT t.gid_2::text as id,
            t.name_0::text as name_0,
            t.name_1::text as name_1,
            t.name_2::text as name_2
        FROM pgadapter.africa_gadm36_adm2 t
        WHERE t.gid_2 = adm2_id
        ORDER BY t.name_2;
END;
$$
LANGUAGE 'plpgsql' STABLE PARALLEL SAFE;

COMMENT ON FUNCTION postgisftw.africa_adm2_by_id IS 'Filter africa admin2 boundaries by id';