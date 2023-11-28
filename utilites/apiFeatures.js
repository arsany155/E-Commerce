class apiFeatures {
    constructor(mongoose ,  queryString){
        this.mongoose = mongoose,
        this.queryString = queryString
    }

    sort(){
        if (this.queryString.sort) {
            this.mongoose = this.mongoose.sort(this.queryString.sort);
        } else {
            this.mongoose = this.mongoose.sort("-createdAt");// if there is no sort make the sorting by the newest
        }
        return this
    }


    pagination(countDocuments){
        const  page  = this.queryString.page || 1;
        const limit = this.queryString.limit || 2;
        // const endIndex = page * limit //hena by7sb howa 5ales ad eh men el items ely betzhar 3ashan y3rf fe next wla l2a 

        const pagination = {}
        pagination.currentPage = page , //hena 3ashan azhr howa fe page kam
        pagination.limit = limit //hena ba2ol howa 3ayz yzhar kam item fel page 
        pagination.numberOfPages = Math.ceil(countDocuments / limit) // hena ba7sb total el pages kolaha 3ala 7asb 3adad el items wl limit beta3y lel page el wa7da
        
        // if(endIndex > countDocuments){
        //     pagination.next = page + 1 // hena b3ml zorar lel next
        // }else{
        //     pagination.prev = page - 1 //hena b3ml zorar lel previous
        // }   
    
        this.mongoose = this.mongoose.skip((page - 1) * limit).limit(limit);
        this.paginationResult = pagination
        return this
    }


    search(){
        if(this.queryString.search){
            const query={}
            query.$or = [
                {title: {$regex: this.queryString.search , $options: "i"}},
                {description: {$regex: this.queryString.search , $options: "i"}}
            ]
            this.mongoose = this.mongoose.find(query)
        }
        return this
    }


    filter(){
        const queryStringObj = { ...this.queryString };
        const excludeFields = ['page' , 'sort' , 'limit' , 'search' ]
        excludeFields.forEach((field) => delete queryStringObj[field])

        let modifiedQueryString = JSON.stringify(queryStringObj);
        modifiedQueryString = modifiedQueryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        this.mongoose = this.mongoose.find(JSON.parse(modifiedQueryString));
        return this
    }

}

module.exports = apiFeatures