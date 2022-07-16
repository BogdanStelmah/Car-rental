// BUILD QUERY
exports.queryParser = async (query, Model) => {
    try {
        const tableFields = await Model.getTableFields();

        // Pagination
        let limit = Math.abs(parseInt(query.limit)) || 10;
        let skip = Math.abs(parseInt(query.skip)) || 1;
        skip = (skip - 1) * limit
        delete query.limit;
        delete query.skip;

        // Sorting
        let sort = {};
        if (query.sort) {
            const paramsSort = query.sort.split(',');

            // Checks the first character, if "-" then desc, if "+" then asc
            paramsSort.forEach(fieldNames => {
                if (fieldNames[0] === '-'){
                    sort[fieldNames.slice(1)] = -1;
                } else {
                    sort[fieldNames.slice(1)] = 1;
                }
            })
        }
        if (Object.keys(sort).length === 0) {
            sort = null;
        }
        delete query?.sort;

        // Filtering
        const filters = {};

        const generateFilters = (keyQuery, tableFields, value, fieldToSave) => {
            console.log(keyQuery, tableFields, value)
            for (keyTableField in tableFields) {
                // Checks if this field exists in the table
                const queryField = keyQuery.split('.');

                if (keyTableField === queryField[0]) {
                    // Checks the field type and sets search parameters
                    console.log(keyQuery, value)
                    if (tableFields[queryField[0]] === 'String') {
                        filters[fieldToSave] = {$regex: value, $options: 'i'}
                        continue;
                    }
                    if (tableFields[queryField[0]] === 'Number' && Number(value)) {
                        filters[fieldToSave] = {$eq: value}
                        continue;
                    }
                    if (tableFields[queryField[0]] === 'Boolean' && ['true', 'false'].includes(value)) {
                        filters[fieldToSave] = {$eq: value}
                        continue;
                    }
                    if (typeof tableFields[queryField[0]] === 'object') {
                        generateFilters(queryField[1], tableFields[queryField[0]], value, fieldToSave);
                    }
                }
            }
        }
        for (keyQuery in query) {
            generateFilters(keyQuery, tableFields, query[keyQuery], keyQuery);
        }

        return { limit, skip, sort, filters }
    } catch (err) {
        throw new Error(err.message);
    }
}