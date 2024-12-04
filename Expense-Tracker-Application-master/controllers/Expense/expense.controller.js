const csv=require('fast-csv');
const validateExpenseData = require('../../utils/Validator');
const Expense = require('../../models/Expense/expense.models');
const UploadCSV = async(req,res)=>{
    const fileRows=[];
    const error=[];
    try {
        csv.parseFile(req.file.path,{headers:true})
        .on('data',(row)=>{
            // validate each row
            const { error } = validateExpenseData(row);
            if(error){
                error.push({row,error:error.message});
            }else{
                fileRows.push(row)
            }
        })
        .on('end',async()=>{
            try {
                const expenses = fileRows.map((row)=>({
                    userId:row.userId,
                    category:row.category,
                    amount:parseFloat(row.amount),
                    description:row.description,
                    date:new Date(row.date),
                    type:row.type
                }))
                await Expense.insertMany(expenses);
                res.status(201).json({message:"Expense UploadedSuccessfully.",error});
            } catch (err) {
                res.status(500).json({message:"Databse Error" , error:err.message})
            }
        })
    } catch (err) {
        console.log("Error In UploadCSV Controller :- ",err.message)
        res.status(400).json({message:'Invalid CSV File :- ',err:error})
    }
}

const ExpenseShow = async(req,res)=>{
    let {category,type,startDate,endDate,SortBy='amount',order='desc',page=1,limit=10} =req.query
    try {
          const filter = {};
          if(category) filter.category = category;
          if(type) filter.type = type;
          if(startDate && endDate){
                filter.date= {$gte:new Date(startDate), $lte: new Date(endDate)}
          }

        //   Sorting
          const sortOptions={}
        if(SortBy){
            sortOptions[SortBy] = order === 'desc' ? -1 : 1;
        }

        // Pagination
        const pageNum = parseInt(page);
        const pageLimit = parseInt(limit);
        const skip = (pageNum - 1) * pageLimit;

        const expenses = await Expense.find(filter).sort(sortOptions).skip(skip).limit(pageLimit);
        const totaleCount= await Expense.countDocuments(filter)
        res.status(201).json({
            totaleCount,
            currentPage:pageNum,
            totalPage:Math.ceil(totaleCount / pageLimit),
            data:expenses
        });
    } catch (err) {
        console.log("Error In ExpenseShow Controller :- ",err.message)
    res.status(400).json({message:'Internal Error :- ',err:err})
    }
}

const ExpenseUpdate =async(req,res)=>{
    let {id} = req.params;
    let update = req.body;

    try {
        const allFiled = ['category','amount','description','date','type']   
        const isOperation = Object.keys(update).every((key) => allFiled.includes(key)) 

        if(!isOperation){
            return res.status(400).json({message:'Invalid Fields in updates.'})
        }

        const expense = await Expense.findByIdAndUpdate(id,update,{new:true,runValidators:true});
        if(!expense){
            return res.status(404).json({message:'Expense not Found.'})
        }
        res.status(200).json({message:'Expense Update Successfully.',expense})
    } catch (error) {
        console.log("Error In ExpenseShow Controller :- ",error.message)
        res.status(400).json({message:'Invalid CSV File :- ',error:error})
    }
}

const ExpenDelete = async(req,res)=>{
    let {expensId} = req.body
    try {
        if(!Array.isArray(expensId) || expensId.length === 0){
            res.status(400).json({message:'ids must be a non-empty array.'})
        }

        const DeleteData = await Expense.deleteMany({_id:{$in:expensId}});
        res.status(201).json({message:`${DeleteData.deletedCount} expenses delete successfully.`,deletedCount:DeleteData.deletedCount})
    } catch (error) {
        console.log("Error In ExpenseShow Controller :- ",error.message)
        res.status(400).json({message:'Invalid CSV File :- ',error:error})
    }
}

module.exports = {UploadCSV,ExpenseShow,ExpenseUpdate,ExpenDelete}