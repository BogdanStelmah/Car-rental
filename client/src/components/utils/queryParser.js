exports.queryParser = (pagination, filters, sorter) => {
    const params = {};

    params.skip = pagination.current;
    params.limit = pagination.pageSize;

    params.sort = '';

    if (!Array.isArray(sorter)) {
        sorter = Array(sorter);
    }
    for (let i = 0; i < sorter.length; i++) {
        if (sorter[i].order === 'ascend') {
            params.sort += '+' + sorter[i].field;
        }
        if (sorter[i].order === 'descend') {
            params.sort += '-' + sorter[i].field;
        }
        if (i !== sorter.length - 1) {
            params.sort += ',';
        }
    }
    if (params.sort === '') {
        delete params.sort;
    }

    return params;
}