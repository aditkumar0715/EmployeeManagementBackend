exports.paginate = (model, populateFields) => {
  return async (req, res, next) => {
    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);

    if (!page) {
      page = 1;
    }

    if (!limit) {
      limit = 5;
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const result = {};

    if (endIndex < (await model.countDocuments().exec())) {
      result.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      result.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    try {
      result.total = await model.countDocuments();
      result.result = await model
        .find({})
        .limit(limit)
        .skip(startIndex)
        .populate(populateFields)
        .exec();

      res.paginatedResult = result;
      next();
    } catch (error) {
      console.log("Error while pagination: ", error);
      res.status(501).json({
        success: false,
        message: `Unable to fetch ${model} and paginate them`,
        error: error.message,
      });
    }
  };
};
