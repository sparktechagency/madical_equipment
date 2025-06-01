const { User, Product, Transaction, Bid } = require("../models")
const {ObjectId} = require('mongoose').Types

// ******** seller Dashboard statistics *************

//seller dashboard statistics 
const sellerDashboardStatistics = async(sellerId)=>{
    const seller = await User.findById(sellerId)

    //count product
    const countProductQuery = Product.countDocuments({author: new ObjectId(seller), isDeleted:false})
    //active product
    const activeProductQuery = Product.countDocuments({author: new ObjectId(seller), date: {$gte: Date.now()}})
    // total sold product 
    const totalSoldProductQuery = Product.countDocuments({status:"sold", isDeleted:false})

    // database operation
      const [totalProduct, activeProduct, totalSoldProduct] = await Promise.all([countProductQuery, activeProductQuery, totalSoldProductQuery])
    // response 
    return {
        totalProduct:totalProduct, 
        activeProduct:activeProduct, 
        totalIncome:seller.totalIncome, 
        currentBalance:seller.currentBalance,
        totalSoldProduct:totalSoldProduct
    }
}

// seller recent selling product
const sellerRecentSellingProduct = async(sellerId) =>{
    return await Product.find({status:"sold"}).limit(15).sort({updatedAt:-1}).select('-isDeleted').populate('category', "name")
}

// seller seller income ratio 
const getSellerIncomeLast12Months = async (sellerId) =>{
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-based
  
    // 12 months ago (month start)
    const startDate = new Date(year, month - 11, 1);
  
    // Aggregate pipeline
    const pipeline = [
      {
        $match: {
          author: new ObjectId(sellerId),
          status: "sold",
        },
      },
      {
        $lookup: {
          from: "transactions",       // collection name of transactions
          localField: "_id",
          foreignField: "product",
          as: "transactions",
        },
      },
      { $unwind: "$transactions" }, // one doc per transaction
      {
        $match: {
          "transactions.status": "success",
          "transactions.createdAt": { $gte: startDate, $lte: now },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$transactions.createdAt" },
            month: { $month: "$transactions.createdAt" },
          },
          monthlyIncome: { $sum: "$transactions.amount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ];
  
    // data aggregate
    const incomeData = await Product.aggregate(pipeline).sort({month:-1});
  
    // Generate last 12 months with month names
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const last12Months = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(year, month - i, 1);
      last12Months.unshift({
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        monthName: monthNames[d.getMonth()],
        monthlyIncome: 0,
      });
    }
  
    // Map aggregation result for quick lookup
    const incomeMap = {};
    incomeData.forEach(({ _id, monthlyIncome }) => {
      incomeMap[`${_id.year}-${_id.month}`] = monthlyIncome;
    });
  
    // Merge and fill missing months with 0 income
    const finalIncome = last12Months.map(({ year, month, monthName }) => ({
      year,
      month,
      monthName,
      monthlyIncome: incomeMap[`${year}-${month}`] || 0,
    }));
  
    return finalIncome;
  }

// ******** admin Dashboard statistics *************

//admin dashboard statistics 
const adminDashboardStatistics = async()=>{
    //total user
    const totalUserQuery = User.countDocuments({role:"user"})

    //seller
    const totalSellerQuery = User.countDocuments({role:"seller"})

    //count product
    const countProductQuery = Product.countDocuments({isDeleted:false})

    //count total bid
    const countBidsQuery = Bid.countDocuments({isDeleted:false})

    //all transaction
    const transactionAggregation = Transaction.aggregate([
            {
                $match:{
                    status:"success",
                    isDeleted:false
               },
            } ,
            {
                $group:{
                    _id:null,
                    amount:{$sum:"$amount"}
                }
            }
        ])
    
    //granted balance
    const sellerGrantedBalanceQuery = User.aggregate([
        {
            $match:{
                role:'seller'
            }
        },
        {
            $group:{
                _id:null,
                amount:{$sum:"$currentBalance"}
            }
        }
    ])
    
    // database operation
      const [
        totalUser,
         totalSeller, 
         totalProduct, 
         totalBid,
         allTransaction, 
         sellerGrantedBalance] 
         = await Promise.all([
        totalUserQuery, 
        totalSellerQuery, 
        countProductQuery, 
        countBidsQuery,
        transactionAggregation,
        sellerGrantedBalanceQuery
    ])

    //   total revenue or set default 0
    const revenue = allTransaction[0]?.amount * .1 || 0
    //   total revenue or set default 0
    const totalGrantedBalance = sellerGrantedBalance[0]?.amount || 0
    // response 
    return {
        totalUser:totalUser,
        totalSeller:totalSeller, 
        totalProduct:totalProduct, 
        totalBid:totalBid, 
        revenue:revenue,
        grantedBalance:totalGrantedBalance,
    }
}

//monthly Transaction Ratio
const allTransactionRatio = async() =>{
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-based
    
    // Aggregate pipeline
    const pipeline = [
      {
        $match: {
          status: "success",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          monthlyIncome: { $sum: "$amount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ];
  
    // data aggregate
    const incomeData = await Transaction.aggregate(pipeline).sort({month:-1});
 
    // Generate last 12 months with month names
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const last12Months = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(year, month - i, 1);
      last12Months.unshift({
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        monthName: monthNames[d.getMonth()],
        monthlyIncome: 0,
      });
    }
  
    // Map aggregation result for quick lookup
    const incomeMap = {};
    incomeData.forEach(({ _id, monthlyIncome }) => {
      incomeMap[`${_id.year}-${_id.month}`] = monthlyIncome;
    });
  
    // Merge and fill missing months with 0 income
    const finalIncome = last12Months.map(({ year, month, monthName }) => ({
      year,
      month,
      monthName,
      monthlyIncome: incomeMap[`${year}-${month}`] || 0,
    }));
  
    return finalIncome;
}

//recent new user
// const 
// const update = async () =>{
//     const res = await Product.updateMany({},{
//         $set:{
//             author: '682968497c3915bb82c8648b'
//         }
//     })
//     console.log(res);
// }

// update()
module.exports = {
    //seller
    sellerDashboardStatistics,
    sellerRecentSellingProduct,
    getSellerIncomeLast12Months,
    //admin
    adminDashboardStatistics,
    allTransactionRatio
}