// BUILD QUERY
exports.queryParser = async (query, Model) => {
    try {
        const tableFields = await Model.getTableFields();

        // Pagination
        let limit = Math.abs(parseInt(query.limit)) || 10;
        let skip = Math.abs(parseInt(query.skip)) || 1;
        delete query.limit;
        delete query.skip;

        // Sorting
        const sort  = {};
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

            delete query.sort;
        }

        // Filtering
        const filters = {};
        for (keyQuery in query) {
            for (keyTableField in tableFields) {
                // Checks if this field exists in the table
                if (keyQuery === keyTableField) {
                    // Checks the field type and sets search parameters
                    if (tableFields[keyTableField] === 'String') {
                        filters[keyQuery] = {$regex: query[keyQuery], $options: 'i'}
                        continue;
                    }
                    if (tableFields[keyTableField] === 'Number' && Number(query[keyQuery])) {
                        filters[keyQuery] = {$eq: query[keyQuery]}
                        continue;
                    }
                    if (tableFields[keyTableField] === 'Boolean' && ['true', 'false'].includes(query[keyQuery])) {
                        filters[keyQuery] = {$eq: query[keyQuery]}
                    }
                }
            }
        }
        return { limit, skip, sort, filters }
    } catch (err) {
        throw new Error(err.message);
    }
}