require('dotenv').config();
const connectDB = require('./config/db');
const app = require('./app.js')



;(async ()=>{
  try {
    //connect the DB.
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error("Something went wrong while starting the server:- ",error);
    process.exit(1);
  }
})();




