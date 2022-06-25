exports.queryParser = async (query) => {
    try {
        let limit = query.limit || 10;
        let skip = query.skip || 1;
        delete query.limit;
        delete query.skip;

        const sort  = {};
        if (query.sort) {
            const paramsSort = query.sort.split(',');

            paramsSort.forEach(fieldNames => {
                if (fieldNames[0] === '-'){
                    sort[fieldNames.slice(1)] = -1;
                } else {
                    sort[fieldNames.slice(1)] = 1;
                }
            })

            delete query.sort;
        }

        const filters = {};

        console.log(limit)
        return { limit, skip, sort, filters }
    } catch (err) {
        throw new Error(err.message);
    }

}