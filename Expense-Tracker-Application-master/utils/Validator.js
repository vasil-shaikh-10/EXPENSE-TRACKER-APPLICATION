const joi = require('joi')

const expenseSchema = joi.object({
    userId:joi.string().required(),
    category:joi.string().required(),
    amount:joi.number().positive().required(),
    description:joi.string().optional(),
    date:joi.date().required(),
    type:joi.string().valid('Cash','Credit').required()
});

function validateExpenseData(data){
    return expenseSchema.validate(data);
}

module.exports = validateExpenseData