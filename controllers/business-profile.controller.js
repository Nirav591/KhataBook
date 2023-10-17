const { pool } = require('../config/sql.config');

const handleDatabaseError = (res, err) => {
  console.error('Database error:', err);
  return res.status(400).json({
    message: 'An error occurred',
    error: err.message,
  });
};

exports.addBusinessProfile = (req, res) => {
  try{
    const { name, registered_number, business_name, business_info, gstin, bank_details, staff } = JSON.parse(req.body.profileDetails);
    const { filename } = req.file;
    const imageFilePath = `uploads/${filename}`;

    const queryParams = [imageFilePath, name, registered_number, business_name, JSON.stringify(business_info), gstin, JSON.stringify(bank_details), staff];
    const query = 'INSERT INTO business_profile (profile_image, name, registered_number, business_name, business_info, gstin, bank_details, staff) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    pool.query(query, queryParams, (err, result)=>{
      if(err){
        return handleDatabaseError(res, err);
      }
      return res.status(200).json({ message: 'Business Profile added successfully!' });  
    })
  } catch(err) {
    return handleDatabaseError(res, err);
  }
}

exports.getBusinessProfile = (req, res) => {
  try{
   
    const query = 'SELECT * FROM business_profile';
    pool.query(query, (err, result)=>{
      if(err){
        return handleDatabaseError(res, err);
      }
      return res.status(200).json(result);  
    })
  } catch(err) {
    return handleDatabaseError(res, err);
  }
}

exports.updateBusinessProfile = (req, res) => {
  try{
    const { name, registered_number, business_name, business_info, gstin, bank_details, staff } = JSON.parse(req.body.profileDetails);
    const queryParams = [name, registered_number, business_name, JSON.stringify(business_info), gstin, JSON.stringify(bank_details), staff];
    let query = 'UPDATE business_profile SET name = ?, registered_number = ?, business_name = ?, business_info = ?, gstin = ?, bank_details = ?, staff = ?';

    if(req.file){
      const { filename } = req.file;
      const imageFilePath = `uploads/${filename}`;
      queryParams.unshift(imageFilePath);
      query = 'UPDATE business_profile SET Profile_image = ?, name = ?, registered_number = ?, business_name = ?, business_info = ?, gstin = ?, bank_details = ?, staff = ?';
    }
      
    pool.query(query, queryParams, (err, result)=>{
      if(err){
        return handleDatabaseError(res, err);
      }
      return res.status(200).json({ message: 'Business Profile updated successfully!' });  
    })
  } catch(err) {
    return handleDatabaseError(res, err);
  }
}