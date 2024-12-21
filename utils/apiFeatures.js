class ApiFeatures{
    
    constructor(mongooseQuery, queryObject) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryObject;
        this.page = 0;
    }

    filter() {
        const queryStringObj = { ...this.queryString };
        const deletedKeys = ['limit', 'sort', 'page', 'fields'];
        deletedKeys.forEach(element => delete queryStringObj[element])
  
        //APPly operators
        let queryString = JSON.stringify(queryStringObj);
        queryString = JSON.parse(queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`));
        this.mongooseQuery = this.mongooseQuery.find(queryString);
        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const querySorting = this.queryString.sort.split(',').join(" ");
            this.mongooseQuery = this.mongooseQuery.sort(querySorting)// sort('price ect ect')
  
        } else {
            this.mongooseQuery = this.mongooseQuery.sort('-createdAt')// sort('price ect ect')
        }
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const querySorting = this.queryString.fields.split(',').join(" ");
            this.mongooseQuery = this.mongooseQuery.select(querySorting);
        } else {
            this.mongooseQuery = this.mongooseQuery.select("-__v");
        }
        return this;
    }

    search(modelName) {
        if (this.queryString.keyword) {
            let query = {};
            if (modelName === 'Products') {
                query.$or = [
                    { title: { $regex: this.queryString.keyword, $options: 'i' } },
                    { description: { $regex: this.queryString.keyword, $options: 'i' } },
                ];
            } else {
                query = { name: { $regex: this.queryString.keyword, $options: 'i' } };
            }

            this.mongooseQuery = this.mongooseQuery.find(query);
        }
        return this;
    }


    paginate(countDocuments) {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 15;
        const skip = (page - 1) * limit;
        const endIndex = page * limit;

        // Pagination result
        const pagination = {};
        pagination.currentPage = page;
        pagination.limit = limit;
        pagination.numberOfPages = Math.ceil(countDocuments / limit);

        // next page
        if (endIndex < countDocuments) {
            pagination.next = page + 1;
        }
        if (skip > 0) {
            pagination.prev = page - 1;
        }
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

        this.paginationResult = pagination;
        return this;
  
    }
}

module.exports = ApiFeatures;