const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const moment = require('moment-timezone');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

const config = {
  user: 'sa',
  password: '20p256',
  server:'LAPTOP-RVD8BNNA\\SQLEXPRESS',
  database: 'Genner_Industries',
  port: 1433,

  options: {
    encrypt: true,  // Disable SSL/TLS
    trustServerCertificate: true,
  },
};


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'downloads/'); // Save files to the 'downloads' folder
  },
  filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  }
});

const fileUpload = multer({ storage: multer.memoryStorage() });
const upload = multer({ storage: storage }); // Initialize Multer


const pool = new sql.ConnectionPool(config);
pool.connect().then(() => console.log('Connected to the database')).catch(err => console.error('Error connecting to the database:', err));


app.put('/api/programmasterdbedit/:id', upload.single('File'), async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const uploadedFile = req.file;

  try {
      let fileContent = null;
      let filePath = null;

      if (uploadedFile) {
          fileContent = fs.readFileSync(uploadedFile.path); // Read file content as a buffer
          filePath = uploadedFile.originalname; // Use the uploaded file's name
      }

      const pool = await sql.connect(config);
      const query = `
          UPDATE ProgramMaster
          SET date = @date,
              CustomerCode = @CustomerCode,
              FGName = @FGName,
              ItemID = @ItemID,
              ItemName = @ItemName,
              ProcessName = @ProcessName,
              SetterName = @SetterName
              ${filePath !== null ? ', FilePath = @FilePath, FileContent = @FileContent' : ''}
          WHERE ID = @ID
      `;

      const request = pool.request()
          .input('ID', sql.Int, id)
          .input('date', sql.NVarChar, updatedData.date)
          .input('CustomerCode', sql.NVarChar, updatedData.CustomerCode)
          .input('FGName', sql.NVarChar, updatedData.FGName)
          .input('ItemID', sql.NVarChar, updatedData.ItemID)
          .input('ItemName', sql.NVarChar, updatedData.ItemName)
          .input('ProcessName', sql.NVarChar, updatedData.ProcessName)
          .input('SetterName', sql.NVarChar, updatedData.SetterName);

      if (filePath !== null) {
          request.input('FilePath', sql.NVarChar, filePath)
                 .input('FileContent', sql.VarBinary(sql.MAX), fileContent);
      }

      await request.query(query);
      res.status(200).json('Row updated successfully');
  } catch (error) {
      console.error('Error updating row:', error);
      res.status(500).json('Error updating row');
  }
});




app.delete('/api/programmasterdbdelete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await sql.connect(config);
    await pool.request().input('ID', sql.Int, id).query('DELETE FROM ProgramMaster WHERE ID = @ID');
    res.status(200).json('Row deleted successfully');
  } catch (error) {
    console.error('Error deleting row:', error);
    res.status(500).json('Error deleting row');
  }
});



app.get('/api/programmasterdbsearch', async (req, res) => {
  const { date, custCode, fgName, itemId, itemName, processName } = req.query;
  try {
    const pool = await sql.connect(config);
    let query = 'SELECT * FROM ProgramMaster WHERE 1=1';
    if (date) query += ' AND CAST(date AS DATE) = @date'; // Ensure only the date part is matched
    if (custCode) query += ' AND CustomerCode = @custCode';
    if (fgName) query += ' AND FGName = @fgName';
    if (itemId) query += ' AND ItemID = @itemId';
    if (itemName) query += ' AND ItemName = @itemName';
    if (processName) query += ' AND ProcessName = @processName';

    const request = pool.request();
    if (date) request.input('date', sql.Date, date);
    if (custCode) request.input('custCode', sql.NVarChar, custCode);
    if (fgName) request.input('fgName', sql.NVarChar, fgName);
    if (itemId) request.input('itemId', sql.NVarChar, itemId);
    if (itemName) request.input('itemName', sql.NVarChar, itemName);
    if (processName) request.input('processName', sql.NVarChar, processName);

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Error fetching data' });
  }
});




  app.get('/api/programmasterdb', async (req, res) => {
    try {
      const pool = await sql.connect(config);
      const result = await pool.request().query('SELECT * FROM ProgramMaster');
      res.json(result.recordset);
    } catch (error) {
      console.error('Error fetching part entry data:', error);
      res.status(500).send('Error fetching part entry data');
    }
  });


  app.get('/api/programmasterdb/download/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const pool = await sql.connect(config);
      const result = await pool
        .request()
        .input('ID', sql.Int, id)
        .query('SELECT FilePath, FileContent FROM ProgramMaster WHERE ID = @ID');
  
      if (result.recordset.length > 0) {
        const { FilePath, FileContent } = result.recordset[0];
        const fileName = FilePath.split('\\').pop(); // Extract file name from the path
  
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.setHeader('Content-Type', 'application/octet-stream');
        res.send(FileContent); // Send binary file content
      } else {
        res.status(404).send('File not found');
      }
    } catch (error) {
      console.error('Error fetching file:', error);
      res.status(500).send('Error fetching file');
    }
  });
  app.get('/api/programmasterdb/download/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const pool = await sql.connect(config);
      const result = await pool
        .request()
        .input('ID', sql.Int, id)
        .query('SELECT FilePath, FileContent FROM ProgramMaster WHERE ID = @ID');
  
      if (result.recordset.length > 0) {
        const { FilePath, FileContent } = result.recordset[0];
        const fileName = FilePath.split('\\').pop(); // Extract the file name
  
        // Set appropriate headers for file download
        res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
        res.setHeader('Content-Type', 'application/octet-stream');
  
        // Send the binary content directly
        res.send(Buffer.from(FileContent, 'binary'));
      } else {
        res.status(404).json('File not found');
      }
    } catch (error) {
      console.error('Error fetching file:', error);
      res.status(500).json('Error fetching file');
    }
  });
  
    

app.post('/uploadprogrammaster', upload.single('file'), async (req, res) => {
  try {
    // Retrieve form data from the request body
    const { custcode, fgname, itemid, itemname, processname, settername } = req.body;

    // Check if a file was uploaded
    if (!req.file) {
      return res.status(400).send({ message: 'No file uploaded.' });
    }

    const filePath = req.file.path; // Local file path
    const fileBuffer = fs.readFileSync(filePath); // Read file content as a buffer

    // Connect to the database
    const pool = await sql.connect(config);

    // Insert data into the database, including the file content as binary
    const query = `
      INSERT INTO ProgramMaster 
      (date, CustomerCode, FGName, ItemID, ItemName, ProcessName, SetterName, FilePath, FileContent)
      VALUES (GETDATE(), @custcode, @fgname, @itemid, @itemname, @processname, @settername, @filePath, @fileContent)
    `;

    await pool.request()
      .input('custcode', sql.VarChar, custcode)
      .input('fgname', sql.VarChar, fgname)
      .input('itemid', sql.VarChar, itemid)
      .input('itemname', sql.VarChar, itemname)
      .input('processname', sql.VarChar, processname)
      .input('settername', sql.VarChar, settername)
      .input('filePath', sql.VarChar, filePath)
      .input('fileContent', sql.VarBinary, fileBuffer) // Store file content
      .query(query);

    res.status(200).send({ message: 'Program uploaded and data saved successfully.' });
  } catch (error) {
    console.error('Error uploading program master:', error.message);
    res.status(500).send({ message: 'Error uploading program master.', error: error.message });
  }
});


app.get('/downloadprogrammaster', async (req, res) => {
  try {
      // Retrieve query parameters
      const { custcode, fgname, itemid, itemname, processname } = req.query;

      // Connect to the database
      const pool = await sql.connect(config);

      // Query to find the record
      const query = `
          SELECT FilePath 
          FROM ProgramMaster 
          WHERE CustomerCode = @custcode 
          AND FGName = @fgname 
          AND ItemID = @itemid 
          AND ItemName = @itemname 
          AND ProcessName = @processname
      `;

      const result = await pool.request()
          .input('custcode', sql.VarChar, custcode)
          .input('fgname', sql.VarChar, fgname)
          .input('itemid', sql.VarChar, itemid)
          .input('itemname', sql.VarChar, itemname)
          .input('processname', sql.VarChar, processname)
          .query(query);

      if (result.recordset.length === 0) {
          return res.status(404).send({ message: 'No matching record found.' });
      }

      const filePath = result.recordset[0].FilePath;

      // Send the file for download
      res.download(filePath, (err) => {
          if (err) {
              console.error('Error sending file:', err.message);
              res.status(500).send({ message: 'Error downloading the file.' });
          }
      });
  } catch (error) {
      console.error('Error downloading program master:', error.message);
      res.status(500).send({ message: 'Error downloading program master.', error: error.message });
  }
});

app.post('/api/insertOEEData', async (req, res) => {
  const { machinename, oee_percent } = req.body;

  try {
    const pool = await sql.connect(/* your database config */);
    await pool.request()
      .input('machinename', sql.NVarChar, machinename)
      .input('oee_percent', sql.Float, oee_percent)
      .query(`INSERT INTO dbo.oee_dayvalue (machinename, date, oee_percent) VALUES (@machinename, GETDATE(), @oee_percent)`);

    res.status(200).json('OEE data inserted successfully');
  } catch (error) {
    console.error('Error inserting OEE data:', error);
    res.status(500).json('Error inserting OEE data');
  }
});

app.post('/api/updateActiveStatus', (req, res) => {
  const { custom_id, is_active } = req.body;

  const query = `UPDATE machine_allocation SET is_active = @is_active WHERE custom_id = @custom_id`;
  const request = new sql.Request();
  request.input('custom_id', sql.NVarChar, custom_id);
  request.input('is_active', sql.Bit, is_active);
  
  request.query(query, (err, result) => {
    if (err) {
      console.error('Error updating is_active status:', err);
      return res.status(500).json({ message: 'Server error', error: err });
    }

    // If successful, return a proper JSON response
    res.status(200).json({ message: 'Status updated successfully' });
  });
});


app.post('/api/updateActiveStatusnull', (req, res) => {
  const { custom_id, is_active } = req.body;

  const query = `UPDATE machine_allocation SET is_active = @is_active WHERE custom_id = @custom_id`;
  const request = new sql.Request();
  request.input('custom_id', sql.NVarChar, custom_id);
  request.input('is_active', sql.Bit, is_active);  // `false` will map to `0` (bit) in SQL
  
  request.query(query, (err, result) => {
    if (err) {
      console.error('Error updating is_active status:', err);
      return res.status(500).json({ message: 'Server error', error: err });
    }

    // Send success response
    res.status(200).json({ message: 'Status updated successfully' });
  });
});









app.get('/api/partitem101/by-fgname', async (req, res) => {
  const { fgname } = req.query; // Get fgname from query parameters
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('fgname', sql.VarChar, fgname) // Assuming fgname is of type VarChar
      .query('SELECT DISTINCT part_id FROM part_excel WHERE fg_name = @fgname');
    const partIds = result.recordset.map(row => row.part_id);
    res.json(partIds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/part-dataexcel1101', async (req, res) => {
  const custCode = req.query.cust_code;
  try {
    const pool = await sql.connect(config);
    const query =  `SELECT DISTINCT fg_name FROM part_excel WHERE cust_code = @cust_code`;
    const result = await pool.request()
                             .input('cust_code', sql.VarChar, custCode)  // Pass the selected customer code
                             .query(query);
    const names = result.recordset.map(row => row.fg_name);
    res.json(names);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/updateEmployeeAcceptCount', async (req, res) => {
  const { custom_id, emp_accept_count } = req.body; // Get data from the request body

  if (!custom_id || !emp_accept_count) {
    return res.status(400).json({ error: 'Custom ID and Employee Accept Count are required.' });
  }

  try {
    const pool = await sql.connect(config);

    // Query to update emp_accpt_count and also set the current date/time for end_datetime
    const query = `
      UPDATE machine_allocation
      SET emp_accpt_count = @emp_accept_count, end_datetime = GETDATE()
      WHERE custom_id = @custom_id;
    `;

    const result = await pool.request()
      .input('emp_accept_count', sql.Int, emp_accept_count) // Assuming emp_accept_count is an integer
      .input('custom_id', sql.NVarChar, custom_id) // Assuming custom_id is a string
      .query(query);

    res.json({ message: 'Employee accept count updated and current date/time inserted successfully' });
  } catch (err) {
    console.error('Error updating emp_accept_count:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/updateruntimecnc01', async (req, res) => {
  const { custom_id, run_time_cnc01 } = req.body; // Get data from the request body

  if (!custom_id || !run_time_cnc01) {
    return res.status(400).json({ error: 'Custom ID and Employee Accept Count are required.' });
  }

  try {
    const pool = await sql.connect(config);

    // Query to update emp_accpt_count and also set the current date/time for end_datetime
    const query = `
      UPDATE machine_allocation
      SET run_time_cnc01 = @run_time_cnc01, end_datetime = GETDATE()
      WHERE custom_id = @custom_id;
    `;

    const result = await pool.request()
      .input('run_time_cnc01', sql.Int, run_time_cnc01) // Assuming emp_accept_count is an integer
      .input('custom_id', sql.NVarChar, custom_id) // Assuming custom_id is a string
      .query(query);

    res.json({ message: 'Employee accept count updated and current date/time inserted successfully' });
  } catch (err) {
    console.error('Error updating run_time_cnc01:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.post('/api/updateStartDateTime', async (req, res) => {
  const { custom_id } = req.body; // Get custom_id from the request body

  if (!custom_id) {
    return res.status(400).json({ error: 'Custom ID is required.' });
  }

  try {
    const pool = await sql.connect(config);

    // Query to update start_datetime with the current date/time
    const query = `
      UPDATE machine_allocation
      SET start_datetime = GETDATE()
      WHERE custom_id = @custom_id;
    `;

    const result = await pool.request()
      .input('custom_id', sql.NVarChar, custom_id)
      .query(query);

    res.json({ message: 'Start date/time updated successfully' });
  } catch (err) {
    console.error('Error updating start date/time:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/compreportallocation', async (req, res) => {
  const { cust_code, fg_name, part_id, work_order, fromDate, toDate } = req.query;

  try {
    const pool = await sql.connect(config);
    let query = `
      SELECT ma.*, qa.accept, qa.reject, qa.rework
      FROM machine_allocation ma
      LEFT JOIN qualityaccept qa ON ma.custom_id = qa.unique_id
      WHERE ma.submitted = '3'
    `;

    const request = pool.request();

    if (cust_code) {
      query += ` AND ma.cust_code = @cust_code`;
      request.input('cust_code', sql.VarChar, cust_code);
    }
    if (fg_name) {
      query += ` AND ma.fg_name = @fg_name`;
      request.input('fg_name', sql.VarChar, fg_name);
    }
    if (part_id) {
      query += ` AND ma.itemcode = @part_id`;
      request.input('part_id', sql.VarChar, part_id);
    }
    if (work_order) {
      query += ` AND ma.work_order = @work_order`;
      request.input('work_order', sql.VarChar, work_order);
    }
    if (fromDate) {
      query += ` AND ma.[date] >= @fromDate`;
      request.input('fromDate', sql.Date, fromDate);
    }
    if (toDate) {
      query += ` AND ma.[date] <= @toDate`;
      request.input('toDate', sql.Date, toDate);
    }

    query += ` ORDER BY [date] ASC`;

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});



app.get('/api/reportallocation', async (req, res) => {
  const { cust_code, fg_name, part_id, work_order, fromDate, toDate } = req.query;

  try {
    const pool = await sql.connect(config);
    let query = `
      SELECT ma.*, qa.accept, qa.reject, qa.rework
      FROM machine_allocation ma
      LEFT JOIN qualityaccept qa ON ma.custom_id = qa.unique_id
      WHERE ma.submitted IN (0, 1, 2, 3)
    `;
    const request = pool.request();

    if (cust_code) {
      query += ` AND ma.cust_code = @cust_code`;
      request.input('cust_code', sql.VarChar, cust_code);
    }
    if (fg_name) {
      query += ` AND ma.fg_name = @fg_name`;
      request.input('fg_name', sql.VarChar, fg_name);
    }
    if (part_id) {
      query += ` AND ma.itemcode = @part_id`;
      request.input('part_id', sql.VarChar, part_id);
    }
    if (work_order) {
      query += ` AND ma.work_order = @work_order`;
      request.input('work_order', sql.VarChar, work_order);
    }
    if (fromDate) {
      query += ` AND ma.[date] >= @fromDate`;
      request.input('fromDate', sql.Date, fromDate);
    }
    if (toDate) {
      query += ` AND ma.[date] <= @toDate`;
      request.input('toDate', sql.DateTime, `${toDate} 23:59:59`);
    }

    query += ` ORDER BY [date] ASC`;
    console.log('Generated Query:', query); // Debugging assistance
    const result = await request.query(query);

    res.json(result.recordset);
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.get('/api/prodreportallocation', async (req, res) => {
  const { cust_code, fg_name, part_id, fromDate, toDate } = req.query; // Get the query parameters
  try {
    const pool = await sql.connect(config);
    let query = `
      SELECT ma.*, qa.accept, qa.reject, qa.rework
      FROM machine_allocation ma
      LEFT JOIN qualityaccept qa ON ma.custom_id = qa.unique_id
      WHERE ma.submitted = '3'
      ORDER BY date ASC`; // Base query with submitted = 3

    // Add conditions for filtering
    if (cust_code) {
      query += ` AND cust_code = '${cust_code}'`;
    }
    if (fg_name) {
      query += ` AND ma.fg_name = '${fg_name}'`;
    }
    if (part_id) {
      query += ` AND ma.itemcode = '${part_id}'`;
    }

    // Date range filtering
    if (fromDate) {
      query += ` AND ma.[date] >= '${fromDate}'`; // From date
    }
    if (toDate) {
      query += ` AND ma.[date] <= '${toDate} 23:59:59'`; // Include the entire toDate
    }

    const result = await pool.request().query(query);
    const tableData = result.recordset;
    res.json(tableData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/empreportallocation', async (req, res) => {
  const { settername, operatorname, fromDate, toDate } = req.query; // Get the query parameters
  try {
    const pool = await sql.connect(config);
    let query = 'SELECT * FROM machine_allocation WHERE 1=1'; // Base query

    // Add conditions for filtering by settername and operatorname
    if (settername) {
      query += ` AND settername LIKE '%${settername}%'`;  // Allow partial matching
    }
    if (operatorname) {
      query += ` AND operatorname LIKE '%${operatorname}%'`;  // Allow partial matching
    }

    // Date range filtering
    if (fromDate) {
      query += ` AND [date] >= '${fromDate}'`; // From date as is
    }
    if (toDate) {
      query += ` AND [date] <= '${toDate} 23:59:59'`; // Include the entire toDate
    }

    // Order by date in ascending order
    query += ` ORDER BY [date] ASC`;

    // Execute query
    const result = await pool.request().query(query);
    const tableData = result.recordset;
    res.json(tableData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/insertMachineDataactualcycle', async (req, res) => {
  const machineData = req.body;

  try {
    const pool = await sql.connect(config); // Use await here

    const promises = []; // Array to hold all promises

    for (const machineName in machineData) {
      const machine = machineData[machineName];
      const { timers, part_count, color, cycle_time, mode, itemcode, process_name } = machine;

      // Prepare the insert request
      const request = pool.request()
        .input('machine_name', sql.VarChar, machineName)
        .input('runtime', sql.Float, timers.runtime)
        .input('process_idle', sql.Float, timers.process_idle)
        .input('breakdown', sql.Float, timers.breakdown)
        .input('idle', sql.Float, timers.idle)
        .input('part_count', sql.Int, part_count)
        .input('color', sql.VarChar, color)
        .input('cycle_time', sql.Float, cycle_time)
        .input('mode', sql.VarChar, mode)
        .input('itemcode', sql.VarChar, itemcode)
        .input('process_name', sql.VarChar, process_name)
        .query(`
          INSERT INTO machine_data_cycle (machine_name, runtime, process_idle, breakdown, idle, part_count, color, cycle_time, mode, itemcode, process_name)
          VALUES (@machine_name, @runtime, @process_idle, @breakdown, @idle, @part_count, @color, @cycle_time, @mode, @itemcode, @process_name)
        `);
      
      promises.push(request); // Add the promise to the array
    }

    await Promise.all(promises); // Wait for all queries to complete
    res.status(200).json('Data inserted successfully');
  } catch (err) {
    console.error('Error inserting machine data:', err);
    res.status(500).json('Server error');
  }
});



app.get('/getCycle', async (req, res) => {
  const { value5, process_name } = req.query;

  try {
    let pool = await sql.connect(config);
    let result = await pool.request()
      .input('partId', sql.VarChar, value5)  // assuming value5 is part ID
      .input('processId', sql.VarChar, process_name)  // assuming process_name is process id
      .query(`
        SELECT 
          MIN(average) AS least_cycle_time,   -- Get the minimum cycle time
          CAST(date AS DATE) AS cycle_date    -- Return the date
        FROM averagecycletime
        WHERE item_name = @partId AND process_name = @processId
        GROUP BY CAST(date AS DATE)           -- Group the cycle time by each day
        ORDER BY MIN(average) ASC             -- Sort by least cycle time
      `);
    
    if (result.recordset.length > 0) {
      res.json({
        least_average_day: result.recordset[0].cycle_date,  // The date with the least cycle time
        cycle_time: result.recordset[0].least_cycle_time    // The least cycle time
      });
    } else {
      res.status(404).json({ message: 'No data found for the given part ID and process name' });
    }
  } catch (error) {
    console.error('Error retrieving cycle:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



app.get('/api/getSetterNames', async (req, res) => {
  try {
    const { fromDate, toDate } = req.query; // Get query parameters from the request

    await sql.connect(config);
    const request = new sql.Request();

    // Prepare the query with parameters
    let query = 'SELECT * FROM machine_allocation WHERE 1=1';
    if (fromDate && toDate) {
      query += ' AND date >= @fromDate AND date <= @toDate';
      request.input('fromDate', sql.Date, fromDate);
      request.input('toDate', sql.Date, toDate);
    } else {
      // Otherwise, filter by today's date
      query += ' AND date = CAST(GETDATE() AS DATE)';
    }

    // Add ORDER BY clause to sort by date in descending order
    query += ' ORDER BY time DESC';

    request.query(query, (err, result) => {
      if (err) {
        console.error('Error fetching setter names:', err);
        res.status(500).json({ message: 'Error fetching setter names', error: err.message });
      } else {
        res.status(200).json(result.recordset);
      }
    });
  } catch (err) {
    console.error('Error fetching setter names:', err);
    res.status(500).json({ message: 'Error fetching setter names', error: err.message });
  }
});





app.delete('/api/deleterecord/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM machine_allocation WHERE id = @id');
    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    console.error('Error deleting record:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/getmachinetoday', async (req, res) => {
  try {
    const { machine, dateFrom, dateTo } = req.query;
    const pool = await sql.connect(config);

    // Use today's date if no dateFrom or dateTo is provided
    const fromDate = dateFrom ? dateFrom : new Date().toISOString().split('T')[0];
    const toDate = dateTo ? dateTo : new Date().toISOString().split('T')[0];

    // Build the SQL query with a date range
    let query = `
      SELECT * FROM machine_allocation
      WHERE CAST([date] AS DATE) >= CAST(@dateFrom AS DATE)
        AND CAST([date] AS DATE) <= CAST(@dateTo AS DATE)
        AND submitted = 0
    `;

    // If a machine is provided, add it to the query
    if (machine) {
      query += ` AND machineno = @machineno`;
    }

    query += ` ORDER BY CAST([date] AS DATE) ASC, starttime ASC;`;

    const request = pool.request();
    request.input('dateFrom', sql.Date, fromDate);
    request.input('dateTo', sql.Date, toDate);

    // If a machine is provided, add it as an input parameter
    if (machine) {
      request.input('machineno', sql.VarChar, machine);
    }

    // Execute the query and return the result
    request.query(query, (err, result) => {
      if (err) {
        console.error('Error fetching data:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json(result.recordset); // Return the result to the frontend
    });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.put('/api/updateSubmittedStatusmachine/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const pool = await sql.connect(config);
      await pool.request()
        .input('id', sql.Int, id)
        .query('UPDATE machine_allocation SET submitted = 1 WHERE id = @id');
  
      res.json({ success: true, message: 'Status updated successfully' });
    } catch (error) {
      console.error('Error updating status:', error);
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  });


app.post('/api/uploaddemofile', fileUpload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    await sql.connect(config);
    const request = new sql.Request();
    const fileName = file.originalname;
    const fileContent = file.buffer;

    // Check if the file already exists
    const checkQuery = 'SELECT Id FROM FileStorage WHERE FileName = @FileName';
    request.input('FileName', sql.NVarChar, fileName);
    const checkResult = await request.query(checkQuery);

    if (checkResult.recordset.length > 0) {
      // File exists, update it
      const fileId = checkResult.recordset[0].Id;
      const updateQuery = 'UPDATE FileStorage SET FileContent = @FileContent WHERE Id = @Id';
      request.input('FileContent', sql.VarBinary, fileContent);
      request.input('Id', sql.Int, fileId);
      await request.query(updateQuery);
      res.status(200).json({ message: 'File updated successfully' });
    } else {
      // File does not exist, insert new
      const insertQuery = `
        INSERT INTO FileStorage (FileName, FileContent)
        VALUES (@FileName, @FileContent)
      `;
      request.input('FileContent', sql.VarBinary, fileContent);
      await request.query(insertQuery);
      res.status(200).json({ message: 'File uploaded successfully' });
    }
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ message: 'Error uploading file', error: err.message });
  }
});


// Endpoint to get list of files
app.get('/api/getdemofiles', async (req, res) => {
  try {
    await sql.connect(config);
    const request = new sql.Request();
    const result = await request.query('SELECT Id, FileName FROM FileStorage');
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error fetching files:', err);
    res.status(500).json({ message: 'Error fetching files', error: err.message });
  }
});



// Endpoint to download file by ID
app.get('/api/downloadfromtable/:id', async (req, res) => {
  try {
    const fileId = req.params.id;

    await sql.connect(config);
    const request = new sql.Request();
    request.input('Id', sql.Int, fileId);
    const result = await request.query('SELECT FileName, FileContent FROM FileStorage WHERE Id = @Id');

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'File not found' });
    }

    const file = result.recordset[0];
    res.setHeader('Content-Type', 'application/octet-stream');
    res.json({
      fileName: file.FileName,
      fileContent: file.FileContent.toString('base64') // Convert binary data to base64
    });
  } catch (err) {
    console.error('Error downloading file:', err);
    res.status(500).json({ message: 'Error downloading file', error: err.message });
  }
});


// Update a record in the database
app.put('/api/records/:id', async (req, res) => {
  const { id } = req.params;
  const updatedRecord = req.body;
  try {
    const pool = await sql.connect(config);
    const query = `
      UPDATE machine_allocation
      SET
        plannumber = @plannumber,
        work_order = @work_order,
        cust_code = @cust_code,
        fg_name = @fg_name,
        itemcode = @itemcode,
        itemname = @itemname,
        quantity = @quantity,
        process_id = @process_id,
        process_name = @process_name,
        processtype = @processtype,
        settername = @settername,
        operatorname = @operatorname,
        plannedcycletime = @plannedcycletime,
        starttime = @starttime,
        endtime = @endtime,
        planquantity = @planquantity,
        date = @date,
        machineno = @machineno
      WHERE id = @id
    `;
    const result = await pool.request()
      .input('id', sql.Int, id)
      .input('plannumber', sql.VarChar, updatedRecord.plannumber)
      .input('work_order', sql.VarChar, updatedRecord.work_order)

      .input('cust_code', sql.VarChar, updatedRecord.cust_code)
      .input('fg_name', sql.VarChar, updatedRecord.fg_name)
      .input('itemcode', sql.VarChar, updatedRecord.itemcode)
      .input('itemname', sql.VarChar, updatedRecord.itemname)
      .input('quantity', sql.VarChar, updatedRecord.quantity)
      .input('process_id', sql.VarChar, updatedRecord.process_id)
      .input('process_name', sql.VarChar, updatedRecord.process_name)
      .input('processtype', sql.VarChar, updatedRecord.processtype)
      .input('settername', sql.VarChar, updatedRecord.settername)
      .input('operatorname', sql.VarChar, updatedRecord.operatorname)
      .input('plannedcycletime', sql.VarChar, updatedRecord.plannedcycletime)
      .input('starttime', sql.VarChar, updatedRecord.starttime)
      .input('endtime', sql.VarChar, updatedRecord.endtime)
      .input('planquantity', sql.VarChar, updatedRecord.planquantity)
      .input('date', sql.Date, updatedRecord.date) // Assuming date is in 'yyyy-MM-dd' format
      .input('machineno', sql.VarChar, updatedRecord.machineno) // Assuming machine number is a string
      .query(query);

    res.json(result);
  } catch (err) {
    console.error('Error updating record:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



//oee new







//oee
app.get('/api/oeetotalunits', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query("SELECT machine_name, total_units FROM oee_totalunits");
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching maintenance_schedule data:', error.message);
    res.status(500).send('Error fetching maintenance_schedule data');
  }
});

app.get('/api/oeepart1', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query("SELECT machine_name, run_time, planned_production_time FROM oee_part1");
    console.log('Fetched oee_part1 data:', result.recordset);  // Debugging line
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching oee_part1 data:', error.message);
    res.status(500).send('Error fetching oee_part1 data');
  }
});



app.get('/api/oeecycletime', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query("SELECT machine_name, ideal_cycle_time FROM oee_cycletime");
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching maintenance_schedule data:', error.message);
    res.status(500).send('Error fetching maintenance_schedule data');
  }
});

app.get('/api/oeeaccept', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query("SELECT machine_name, good_units FROM oee_acceptcount");
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching maintenance_schedule data:', error.message);
    res.status(500).send('Error fetching maintenance_schedule data');
  }
});





















































 // API endpoint to get condition monitoring data
 app.get('/condition_monitoringdata', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM condition_monitoringdata');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// API endpoint to get prediction log data
app.get('/prediction_log', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM prediction_log');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// API endpoint to get maintenance action taken data
app.get('/maintenance_actiontaken', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM maintenance_actiontaken');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// API endpoint to get post maintenance analysis data
app.get('/post_maintenanceanalysis', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM post_maintenanceanalysis');
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

  // Fetch maintenance_repairlog data
app.get('/maintenance_repairlog', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query("SELECT * FROM maintenance_repairlog");
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching maintenance_repairlog data:', error.message);
    res.status(500).send('Error fetching maintenance_repairlog data');
  }
});

// Fetch incident_log data
app.get('/incident_log', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query("SELECT * FROM incident_log");
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching incident_log data:', error.message);
    res.status(500).send('Error fetching incident_log data');
  }
});

// Fetch performance_utilization data
app.get('/performance_utilization', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query("SELECT * FROM performance_utilization");
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching performance_utilization data:', error.message);
    res.status(500).send('Error fetching performance_utilization data');
  }
});

// Fetch part_replacement data
app.get('/part_replacement', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query("SELECT * FROM part_replacementlog");
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching part_replacement data:', error.message);
    res.status(500).send('Error fetching part_replacement data');
  }
});

// Fetch scheduled_maintenance data
app.get('/scheduled_maintenance', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query("SELECT * FROM scheduled_maintenance");
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching scheduled_maintenance data:', error.message);
    res.status(500).send('Error fetching scheduled_maintenance data');
  }
});

  app.get('/general_information', async (req, res) => {
    try {
      const pool = await sql.connect(config);
      const result = await pool.request().query("SELECT * FROM general_information");
      res.json(result.recordset);
    } catch (error) {
      console.error('Error fetching general_information data:', error.message);
      res.status(500).send('Error fetching general_information data');
    }
  });

  app.get('/general_information', async (req, res) => {
    try {
      const pool = await sql.connect(config);
      const result = await pool.request().query("SELECT * FROM general_information");
      res.json(result.recordset);
    } catch (error) {
      console.error('Error fetching general_information data:', error.message);
      res.status(500).send('Error fetching general_information data');
    }
  });

  app.get('/installation_detail', async (req, res) => {
    try {
      const pool = await sql.connect(config);
      const result = await pool.request().query("SELECT * FROM installation_detail");
      res.json(result.recordset);
    } catch (error) {
      console.error('Error fetching installation_detail data:', error.message);
      res.status(500).send('Error fetching installation_detail data');
    }
  });

  app.get('/machine_specifications', async (req, res) => {
    try {
      const pool = await sql.connect(config);
      const result = await pool.request().query("SELECT * FROM machine_specifications");
      res.json(result.recordset);
    } catch (error) {
      console.error('Error fetching machine_specifications data:', error.message);
      res.status(500).send('Error fetching machine_specifications data');
    }
  });

  app.get('/safety_compliance', async (req, res) => {
    try {
      const pool = await sql.connect(config);
      const result = await pool.request().query("SELECT * FROM  safety_compliance");
      res.json(result.recordset);
    } catch (error) {
      console.error('Error fetching safety_compliance data:', error.message);
      res.status(500).send('Error fetching safety_compliance data');
    }
  });

  app.get('/initialtesting_calibration', async (req, res) => {
    try {
      const pool = await sql.connect(config);
      const result = await pool.request().query("SELECT * FROM initialtesting_calibration");
      res.json(result.recordset);
    } catch (error) {
      console.error('Error fetching initialtesting_calibration data:', error.message);
      res.status(500).send('Error fetching initialtesting_calibration data');
    }
  });


  app.get('/maintenance_schedule', async (req, res) => {
    try {
      const pool = await sql.connect(config);
      const result = await pool.request().query("SELECT * FROM maintenance_schedule");
      res.json(result.recordset);
    } catch (error) {
      console.error('Error fetching maintenance_schedule data:', error.message);
      res.status(500).send('Error fetching maintenance_schedule data');
    }
  });


  app.get('/training_documentation', async (req, res) => {
    try {
      const pool = await sql.connect(config);
      const result = await pool.request().query("SELECT * FROM training_documentation");
      res.json(result.recordset);
    } catch (error) {
      console.error('Error fetching training_documentation data:', error.message);
      res.status(500).send('Error fetching training_documentation data');
    }
  });


  app.get('/warranty_support', async (req, res) => {
    try {
      const pool = await sql.connect(config);
      const result = await pool.request().query("SELECT * FROM warranty_support");
      res.json(result.recordset);
    } catch (error) {
      console.error('Error fetching warranty_support data:', error.message);
      res.status(500).send('Error fetching warranty_support data');
    }
  });

  app.get('/machine_allocation', async (req, res) => {
    const { setterName } = req.query;
  
    // Get current date in 'yyyy-MM-dd' format
    const currentDate = moment().format('YYYY-MM-DD');
  
    try {
      const pool = await sql.connect(config);
      const result = await pool.request()
        .input('setterName', sql.NVarChar, setterName)
        .input('currentDate', sql.Date, currentDate)
        .query(`
          SELECT * 
          FROM machine_allocation 
          WHERE settername = @setterName 
          AND CONVERT(date, date) = @currentDate
        `);
  
      res.status(200).json(result.recordset);
    } catch (error) {
      console.error('Error fetching allocations:', error); // Added console error logging
      res.status(500).json({ message: 'Error fetching allocations', error });
    }
  });
  



// Store uploaded files
app.post('/api/allocation', upload.array('files'), async (req, res) => {
  try {
    const files = req.files;
    const formData = req.body.data ? JSON.parse(req.body.data) : null;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    if (!formData) {
      return res.status(400).json({ error: 'No form data provided' });
    }

    // Process the form data and files as needed
    console.log('Files:', files);
    console.log('Form Data:', formData);

    // Save file info in a JSON file (or database)
    const filesInfo = files.map(file => ({
      name: file.originalname,
      path: file.path,
      uploadedAt: new Date()
    }));

    const filesDataPath = path.join(__dirname, 'uploads', 'files.json');
    let filesData = [];
    if (fs.existsSync(filesDataPath)) {
      filesData = JSON.parse(fs.readFileSync(filesDataPath));
    }
    filesData.push(...filesInfo);
    fs.writeFileSync(filesDataPath, JSON.stringify(filesData, null, 2));

    res.status(200).json({ message: 'Data and files processed successfully' });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// Endpoint to retrieve uploaded files
app.get('/api/uploadedfiles', (req, res) => {
  const filesDataPath = path.join(__dirname, 'uploads', 'files.json');
  if (fs.existsSync(filesDataPath)) {
    const filesData = JSON.parse(fs.readFileSync(filesDataPath));
    res.status(200).json(filesData);
  } else {
    res.status(200).json([]);
  }
});

// Endpoint to download a file by name
app.get('/api/download/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filesDataPath = path.join(__dirname, 'uploads', 'files.json');
  if (fs.existsSync(filesDataPath)) {
    const filesData = JSON.parse(fs.readFileSync(filesDataPath));
    const file = filesData.find(f => f.name === fileName);
    if (file) {
      const filePath = path.resolve(file.path); // Ensure the path is absolute
      console.log(`Attempting to download file from path: ${filePath}`);
      if (fs.existsSync(filePath)) {
        res.download(filePath, file.name);
      } else {
        console.error(`File not found at path: ${filePath}`);
        res.status(404).json({ error: 'File not found' });
      }
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } else {
    res.status(404).json({ error: 'No files uploaded' });
  }
});
  



// POST endpoint to insert data into the part_graph table
app.post('/api/insertPartGraphData', async (req, res) => {
  try {
    // Extract data from request body
    const { date, machine_name, actual_partcount, planned_partcount } = req.body;

    // Validate and convert part counts to integers
    const actualPartCount = parseInt(actual_partcount, 10);
    const plannedPartCount = parseInt(planned_partcount, 10);

    // Check if the conversion was successful
    if (isNaN(actualPartCount) || isNaN(plannedPartCount)) {
      return res.status(400).json({ message: 'Invalid part count values' });
    }

    // Connect to SQL Server using config
    await sql.connect(config);
    const request = new sql.Request();

    // Define the SQL query
    const query = `
      INSERT INTO dbo.part_graph (date, machine_name, actual_partcount, planned_partcount)
      VALUES (GETDATE(), @machine_name, @actual_partcount, @planned_partcount)
    `;

    // Set parameters for the SQL query
    request.input('machine_name', sql.NVarChar, machine_name);
    request.input('actual_partcount', sql.Int, actualPartCount); // Ensure actual part count is an integer
    request.input('planned_partcount', sql.Int, plannedPartCount); // Ensure planned part count is an integer

    // Execute the query
    const result = await request.query(query);

    // Log success and send response
    console.log('Data inserted successfully:', result); 
    res.status(201).json({ success: true, message: 'Data inserted successfully', insertedData: req.body });
  } catch (err) {
    // Log error and send error response
    console.error('Error inserting data:', err);
    res.status(500).json({ success: false, message: 'Error inserting data', error: err.message });
  }
});

// POST endpoint to insert machine data into SQL Server
app.post('/insertMachineData', async (req, res) => {
  try {
    await sql.connect(config); // Connect to SQL Server using config
    const request = new sql.Request();

    const { machine_name, run_time, process_idle, machine_idle, breakdown, cycle_time } = req.body;

    const query = `
      INSERT INTO demotable (date, machine_name, run_time, process_idle, machine_idle, breakdown, cycle_time)
      VALUES (GETDATE(), @machine_name, @run_time, @process_idle, @machine_idle, @breakdown, @cycle_time)
    `;

    request.input('machine_name', sql.NVarChar, machine_name);
    request.input('run_time', sql.Int, run_time); // Assuming run_time, process_idle, machine_idle, breakdown are all integers in minutes
    request.input('process_idle', sql.Int, process_idle);
    request.input('machine_idle', sql.Int, machine_idle);
    request.input('breakdown', sql.Int, breakdown);
    request.input('cycle_time', sql.Int, cycle_time);


    const result = await request.query(query);

    console.log('Data inserted successfully:', result);
    res.status(201).json({ success: true, message: 'Data inserted successfully', insertedData: req.body });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ success: false, message: 'Error inserting data', error: err.message });
  } 
});

// POST endpoint to insert machine data into SQL Server
app.post('/insertoeepartData', async (req, res) => {
  try {
    await sql.connect(config); // Connect to SQL Server using config
    const request = new sql.Request();

    const { machine_name, run_time, planned_production_time } = req.body;

    const query = `
      INSERT INTO oee_part1 (date, machine_name, run_time, planned_production_time)
      VALUES (GETDATE(), @machine_name, @run_time, @planned_production_time)
    `;

    request.input('machine_name', sql.NVarChar, machine_name);
    request.input('run_time', sql.Int, run_time); // Assuming run_time, process_idle, machine_idle, breakdown are all integers in minutes
    request.input('planned_production_time', sql.Int, planned_production_time); // Assuming run_time, process_idle, machine_idle, breakdown are all integers in minutes



    const result = await request.query(query);

    console.log('Data inserted successfully:', result);
    res.status(201).json({ success: true, message: 'Data inserted successfully', insertedData: req.body });
  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ success: false, message: 'Error inserting data', error: err.message });
  } 
});





app.post('/api/insertqualityData', async (req, res) => {
  const { unique_id, machine_name,work_order,cust_code,fg_name,itemprocess_id, part_id, part_name, process_name, planned_quantity, setter_name,operator_name, accept, reject, rework, reason, id } = req.body;

  try {
    // Connect to SQL Server
    const pool = await sql.connect(config);
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      // Insert into the qualityaccept table with current date using GETDATE()
      await transaction.request().query`
        INSERT INTO [dbo].[qualityaccept]
    ([unique_id], [date], [machine_name],[work_order],[cust_code],[fg_name], [itemprocess_id], [part_id], [part_name], [Process_name], [planned_quantity], [setter_name], [operator_name], [accept], [reject], [rework], [reason])
        VALUES
          (${unique_id},GETDATE(), ${machine_name},${work_order},${cust_code},${fg_name},${itemprocess_id}, ${part_id}, ${part_name}, ${process_name}, ${planned_quantity}, ${setter_name},${operator_name}, ${accept}, ${reject}, ${rework},${reason})
      `;

      // Update the machine_allocation table to mark the record as submitted
      await transaction.request().query`
        UPDATE machine_allocation SET submitted = 3 WHERE id = ${id}
      `;

      await transaction.commit();
      res.status(200).json({ message: 'Data inserted and machine allocation updated successfully' });
    } catch (error) {
      // Rollback the transaction on error
      await transaction.rollback();
      console.error('Error during transaction:', error.message);
      throw error; // Re-throw the error to be caught by the outer catch block
    }
  } catch (error) {
    // Handle the error
    console.error('Error connecting to database or during transaction:', error.message);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});








//machine allocation
app.post('/api/machineallocation', async (req, res) => {
  try {
    const { time, plannumber, selectedCNC, workorder, fgname, custcode, value5, itemName, value1, value2, processName, rows, drawingName, drawingContent } = req.body;

    const insertPromises = rows.map(row => {
      const { date, setterName, optName, startTime, endTime, planQuality, plannedCycleTime1, selectedProcesstype } = row;
      const formattedDate = moment(date).format('YYYY-MM-DD');
      const formattedStartTime = moment(startTime, 'HH:mm:ss').format('HH:mm:ss');
      const formattedEndTime = moment(endTime, 'HH:mm:ss').format('HH:mm:ss');
  
      const itemprocess_id = `${value5}-${value2}`;
      let drawingContentBuffer = null; // Default to null
      if (typeof drawingContent === 'string') {
          drawingContentBuffer = Buffer.from(drawingContent); // String to Buffer
      } else if (Buffer.isBuffer(drawingContent)) {
          drawingContentBuffer = drawingContent; // Already a Buffer
      } else if (Array.isArray(drawingContent)) {
          drawingContentBuffer = Buffer.from(JSON.stringify(drawingContent)); // Array to Buffer
      } else if (typeof drawingContent === 'object') {
          drawingContentBuffer = Buffer.from(JSON.stringify(drawingContent)); // Object to Buffer
      } else {
          drawingContentBuffer = Buffer.alloc(0); // Default to empty Buffer if type is unrecognized
      }  
      return sql.query`
          INSERT INTO machine_allocation (
              time, plannumber, machineno, work_order, cust_code, fg_name, itemcode, itemname, quantity, process_id, process_name, date, operatorname, settername, starttime, endtime, planquantity, plannedcycletime, drawing_name, drawing_content, processtype, itemprocess_id
          )
          VALUES (
              GETDATE(),
              ${plannumber},
              ${selectedCNC},
              ${workorder},
              ${custcode},
              ${fgname},
              ${value5},
              ${itemName},
              ${value1},
              ${value2},
              ${processName},
              ${formattedDate},
              ${optName},
              ${setterName},
              ${formattedStartTime},
              ${formattedEndTime},
              ${planQuality},
              ${plannedCycleTime1},
              ${drawingName || null},  
              ${drawingContentBuffer || null}, 
              ${selectedProcesstype},
              ${itemprocess_id}
          )
      `;
  });
      await Promise.all(insertPromises);
      res.json({ success: true, message: 'Data inserted successfully' });
  } catch (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
  } finally {
      await sql.close(); // Ensure to close the connection
  }
});


app.put('/update-part', (req, res) => {
  const updatedPart = req.body;
  const query = `UPDATE qualityaccept
                 SET accept = @accept, reject = @reject, reason = @reason
                 WHERE id = @id`;

  const request = new sql.Request();
  request.input('accept', sql.Int, updatedPart.accept);
  request.input('reject', sql.Int, updatedPart.reject);
  request.input('reason', sql.NVarChar, updatedPart.reason);
  request.input('id', sql.Int, updatedPart.id);

  request.query(query, (err, result) => {
    if (err) {
      console.error('Error updating part:', err);
      res.status(500).json({ message: 'Error updating part' });
    } else {
      res.status(200).json({ message: 'Part updated successfully' });
    }
  });
});

app.delete('/delete-part/:id', (req, res) => {
  const partId = parseInt(req.params.id, 10);
  const query = `DELETE FROM qualityaccept
                 WHERE id = @id`;

  const request = new sql.Request();
  request.input('id', sql.Int, partId);

  request.query(query, (err, result) => {
    if (err) {
      console.error('Error deleting part:', err);
      res.status(500).json({ message: 'Error deleting part' });
    } else {
      res.status(200).json({ message: 'Part deleted successfully' });
    }
  });
});

// server.js

app.put('/api/updateSubmittedStatus/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, id)
      .query('UPDATE machine_allocation SET submitted = 2 WHERE id = @id');

    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

app.put('/api/updateSubmittedStatus1/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, id)
      .query('UPDATE machine_allocation SET submitted = 0 WHERE id = @id');

    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

app.put('/api/updateSubmittedStatus2/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, id)
      .query('UPDATE machine_allocation SET submitted = 0 WHERE id = @id');

    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});app.put('/api/updateSubmittedStatus3/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, id)
      .query('UPDATE machine_allocation SET submitted = 0 WHERE id = @id');

    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});app.put('/api/updateSubmittedStatus4/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, id)
      .query('UPDATE machine_allocation SET submitted = 0 WHERE id = @id');

    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});app.put('/api/updateSubmittedStatus5/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, id)
      .query('UPDATE machine_allocation SET submitted = 0 WHERE id = @id');

    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});
app.put('/api/updateSubmittedStatus6/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, id)
      .query('UPDATE machine_allocation SET submitted = 0 WHERE id = @id');

    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

app.put('/api/updateSubmittedStatus7/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const pool = await sql.connect(config);
    await pool.request()
      .input('id', sql.Int, id)
      .query('UPDATE machine_allocation SET submitted = 0 WHERE id = @id');

    res.json({ success: true, message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

app.get('/api/emptab', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
      SELECT * 
      FROM machine_allocation
      WHERE machineno = 'CNC 001' AND submitted = 1
    `);
    const qualityData = result.recordset;
    res.json(qualityData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



//oee
app.get('/api/oeevalue', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM oee_machine_data');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching summary data:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});


app.get('/api/summaryqualityaccept', async (req, res) => {
  try {
    const pool = await sql.connect(config);

    // Query to select all data and order by 'accept_date' in descending order
    const query = `
      SELECT * 
      FROM qualityaccept 
      ORDER BY [date] DESC;
    `;

    // Execute the query
    const result = await pool.request().query(query);

    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching summary data:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});


app.get('/api/summaryqualityaccepttoday', async (req, res) => {
  try {
    const pool = await sql.connect(config);

    // Query to select today's data based on 'accept_date'
    const query = `
      SELECT * 
      FROM qualityaccept 
      WHERE CAST([date] AS DATE) = CAST(GETDATE() AS DATE)
      ORDER BY [date] DESC;
    `;

    // Execute the query
    const result = await pool.request().query(query);

    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching summary data:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});


app.get('/api/getpartgraphdata', async (req, res) => {
  const { machineName, startDate, endDate } = req.query;
  let query = `
    SELECT [date], [actual_partcount], [planned_partcount]
    FROM part_graph
    WHERE machine_name = @machineName
    AND CAST([date] AS DATE) BETWEEN @startDate AND @endDate
    ORDER BY [date]
  `;
  try {
    await sql.connect(config);
    const request = new sql.Request();
    request.input('machineName', sql.VarChar, machineName);
    request.input('startDate', sql.Date, new Date(startDate));
    request.input('endDate', sql.Date, new Date(endDate));
    const result = await request.query(query);
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ success: false, message: 'Error fetching data', error: err.message });
  }
});



app.get('/getMachineData', async (req, res) => {
  const { machineName, startDate, endDate } = req.query;
  let query = `
    SELECT [date], [run_time], [process_idle], [machine_idle], [breakdown]
    FROM demotable
    WHERE machine_name = @machineName
    AND CAST([date] AS DATE) BETWEEN @startDate AND @endDate
    ORDER BY [date]
  `;

  try {
    await sql.connect(config);
    const request = new sql.Request();
    request.input('machineName', sql.VarChar, machineName);
    request.input('startDate', sql.Date, new Date(startDate));
    request.input('endDate', sql.Date, new Date(endDate));
    const result = await request.query(query);
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ success: false, message: 'Error fetching data', error: err.message });
  }
});


app.get('/getFilteredDataoperator', async (req, res) => {
  console.log(req.query); // Log query parameters
  const { operatorName, fromDate, toDate } = req.query;

  try {
    const query = `
      SELECT * FROM machine_allocation
      WHERE (operatorname = @operatorName OR @operatorName IS NULL)
      AND (date >= @fromDate OR @fromDate IS NULL)
      AND (date <= @toDate OR @toDate IS NULL)
      ORDER BY date ASC, starttime ASC    `;

    const request = new sql.Request();
    request.input('operatorName', sql.VarChar, operatorName);
    request.input('fromDate', sql.Date, fromDate);
    request.input('toDate', sql.Date, toDate);

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.get('/getFilteredData', async (req, res) => {
  const { setterName, fromDate, toDate } = req.query;

  try {
    const query = `
      SELECT * FROM machine_allocation
      WHERE (settername = @setterName OR @setterName IS NULL)
      AND (date >= @fromDate OR @fromDate IS NULL)
      AND (date <= @toDate OR @toDate IS NULL) -- Keep inclusive filter for toDate
      ORDER BY date ASC, starttime ASC    `;

    const request = new sql.Request();
    request.input('setterName', sql.VarChar, setterName);
    request.input('fromDate', sql.Date, fromDate);
    request.input('toDate', sql.Date, toDate);


    const result = await request.query(query);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).send(error.message);
  }
});






//breakdown maintenance summary
app.get('/api/breaksum', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM breakdown_maintenance');
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//breakdown maintenance
app.post('/api/breakmain', async (req, res) => {
  try {
    const {
      dateTime, machineIdName, location, reportedBy, breakdownDescription, rootCause,
      actionsTaken, downtimeDuration, maintenancePersonnel, followUpRequired, comments,
      spareParts, totalCostOfRepair
    } = req.body;
    
    const parsedDateTime = moment(dateTime, 'YYYY-MM-DD').toDate();

    const pool = await sql.connect(config);

    // Loop through each spare part and insert individually
    for (const sparePart of spareParts) {
      const sparesQuery = 
        `INSERT INTO breakdown_maintenance (date_time, machine_no, location, reported_by, breakdown_desc,
          root_cause, actions_taken, downtime_duration, maintenance_personnel, followup_required, comments,
          spares, spares_cost, total_cost)
        VALUES (@dateTime, @machineIdName, @location, @reportedBy, @breakdownDescription,
          @rootCause, @actionsTaken, @downtimeDuration, @maintenancePersonnel, @followUpRequired, @comments,
          @sparePartsUsed, @sparePartsCost, @totalCostOfRepair)
        `;

      const request = pool.request()
         .input('dateTime', sql.Date, parsedDateTime)
        .input('machineIdName', sql.NVarChar, machineIdName)
        .input('location', sql.NVarChar, location)
        .input('reportedBy', sql.NVarChar, reportedBy)
        .input('breakdownDescription', sql.NVarChar, breakdownDescription)
        .input('rootCause', sql.NVarChar, rootCause)
        .input('actionsTaken', sql.NVarChar, actionsTaken)
        .input('downtimeDuration', sql.NVarChar, downtimeDuration)
        .input('maintenancePersonnel', sql.NVarChar, maintenancePersonnel)
        .input('followUpRequired', sql.NVarChar, followUpRequired)
        .input('comments', sql.NVarChar, comments)
        .input('sparePartsUsed', sql.NVarChar, sparePart.sparePartsUsed)
        .input('sparePartsCost', sql.Int, sparePart.sparePartsCost)
        .input('totalCostOfRepair', sql.Int, totalCostOfRepair);

      await request.query(sparesQuery);
    }

    res.json({ success: true, message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});



//process mapping summary
app.get('/api/promap', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query("SELECT * FROM process_tableentry");
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching CNC machine data:', error.message);
    res.status(500).send('Error fetching CNC machine data');
  }
});


//cnc machines
app.get('/api/cnc01machine', async (req, res) => {
  try {
    const pool = await sql.connect(config);

    // Fetch all CNC machine data
    const result = await pool.request().query("SELECT * FROM CNC_machines");
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching CNC machine data:', error.message);
    res.status(500).send('Error fetching CNC machine data');
  }
});


//vmc machines
app.get('/api/vmc01machine', async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const result = await pool.request().query('SELECT * FROM VMC_machines');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching customer data:', error.message);
    res.status(500).send('Error fetching customer data');
  }
});

//weld machines
app.get('/api/weld01machine', async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const result = await pool.request().query('SELECT * FROM WELDING_machines');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching customer data:', error.message);
    res.status(500).send('Error fetching customer data');
  }
});

//test machines
app.get('/api/test01machine', async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const result = await pool.request().query('SELECT * FROM TESTING_machines');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching customer data:', error.message);
    res.status(500).send('Error fetching customer data');
  }
});

//part process mapping values
app.get('/api/partid/names', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT part_id FROM part_entry');
    const names = result.recordset.map(row => row.part_id);
    res.json(names);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/partiddetails/:itemCode', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const itemCode = req.params.itemCode;
    const result = await pool.request()
      .input('itemCode', sql.VarChar, itemCode)
      .query('SELECT part_name AS part_name FROM part_entry WHERE part_id = @itemCode');
    
    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).send({ message: 'Item not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//new process table
app.get('/api/processentry', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
    SELECT process_id, process_name, process_type
    FROM process_newentry 
  `);
    const qualityData = result.recordset;
    res.json(qualityData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//get ma
app.get('/api/getmachine', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    
    // Query to get records with submitted = 0, 1, or 2, sorted by date in descending order
    const query = `
      SELECT *
      FROM machine_allocation
      WHERE submitted IN (0, 1, 2)
      ORDER BY [date] DESC, starttime ASC;
    `;

    const result = await pool.request().query(query);

    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});







//new
app.get('/api/part/names', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT part_name FROM part_entry');
    const names = result.recordset.map(row => row.part_name);
    res.json(names);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//process tableentry
app.get('/api/process_table', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM process_tableentry');
    const names = result.recordset.map(row => row.part_name);
    res.json(names);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//part name id call
app.get('/api/partitem/names', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT DISTINCT part_id FROM part_excel');
    const names = result.recordset.map(row => row.part_id);
    res.json(names);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// emp name call
app.get('/api/empitem/names', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    // const result = await pool.request().query('SELECT emp_name FROM employee_excel WHERE department = ');
    const result = await pool.request().query(`
      SELECT emp_name FROM employee_excel
      WHERE department = 'SETTER'
    `);
    const names = result.recordset.map(row => row.emp_name);
    res.json(names);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/empitem/namesop', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    // const result = await pool.request().query('SELECT emp_name FROM employee_excel WHERE department = ');
    const result = await pool.request().query(`
      SELECT emp_name FROM employee_excel
      WHERE department = 'OPERATOR'
    `);
    const names = result.recordset.map(row => row.emp_name);
    res.json(names);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//machine setter part name
app.get('/api/partmac/names', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT part_name FROM process_tableentry');
    const names = result.recordset.map(row => row.part_name);
    res.json(names);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/partitemname/names', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT DISTINCT part_name FROM part_excel');
    const names = result.recordset.map(row => row.part_name);
    res.json(names);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//signup
app.post('/api/login', async (req, res) => {
  try {
    const { emp, name, password } = req.body;

    // Use parameterized queries to prevent SQL injection
    const result = await sql.query`
      INSERT INTO authentication (emp, name, password)
      VALUES (
        ${emp},
        ${name},
        ${password} 
      )
    `;

    res.json({ success: true, message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});


//change password
app.post('/api/change-password', async (req, res) => {
  try {
    const { id, password } = req.body;

    // Use parameterized queries to prevent SQL injection
    const result = await sql.query`
      UPDATE authentication
      SET password = ${password}
      WHERE emp = ${id}
    `;

    if (result.rowsAffected && result.rowsAffected[0] > 0) {
      res.json({ success: true, message: 'Password changed successfully' });
    } else {
      res.status(404).json({ error: 'User not found', message: 'User with the given ID does not exist' });
    }
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});



//signin

app.post('/api/check', async (req, res) => {
  try {
    const { emp, name, password } = req.body;

    // Query the database to check if the employee ID and password exist
    const result = await sql.query`
      SELECT * FROM authentication WHERE emp = ${emp} AND password = ${password}
    `;

    if (result.recordset.length > 0) {
      // Credentials found, login successful
      res.json({ success: true, message: 'Login successful' });
    } else {
      // Credentials not found, login unsuccessful
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});



app.get('/api/emptab2', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
    SELECT *FROM machine_allocation
    WHERE machineno = 'CNC 002' AND submitted = 1
    ORDER BY  starttime ASC
  `);
    const qualityData = result.recordset;
    res.json(qualityData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/emptab3', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
    SELECT *FROM machine_allocation
    WHERE machineno = 'CNC 003' AND submitted = 1
        ORDER BY  starttime ASC

  `);
    const qualityData = result.recordset;
    res.json(qualityData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/emptab4', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
    SELECT *FROM machine_allocation
    WHERE machineno = 'CNC 004' AND submitted = 1
        ORDER BY  starttime ASC

  `);
    const qualityData = result.recordset;
    res.json(qualityData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/emptab5', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
    SELECT *FROM machine_allocation
    WHERE machineno = 'CNC 005' AND submitted = 1
        ORDER BY  starttime ASC

  `);
    const qualityData = result.recordset;
    res.json(qualityData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/emptab6', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
    SELECT *FROM machine_allocation
    WHERE machineno = 'VMC 001' AND submitted = 1
        ORDER BY  starttime ASC

  `);
    const qualityData = result.recordset;
    res.json(qualityData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/emptab7', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query(`
    SELECT *FROM machine_allocation
    WHERE machineno = 'VMC 002' AND submitted = 1
        ORDER BY  starttime ASC

  `);
    const qualityData = result.recordset;
    res.json(qualityData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/qualitydata', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM machine_allocation WHERE submitted = 2');
    res.json(result.recordset);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error: ' + error.message); // Send the error message
  }
});


app.post('/api/planning', async (req, res) => {
  try {
    const { date1, value1, value2, selectedCustomer, value4, value5, selectedMachinetype, selectedShift, selectedProcess, selectedPlan } = req.body;

    // Make sure to validate input data here before executing the query

    let selectedMachineNumber = null;

    switch (selectedMachinetype.code) {
      case 'M1':
        selectedMachineNumber = req.body.selectedAdditionalOption1?.name;
        break;
      case 'M2':
        selectedMachineNumber = req.body.selectedAdditionalOption2?.name;
        break;
      case 'M3':
        selectedMachineNumber = req.body.selectedAdditionalOption3?.name;
        break;
      // Add more cases as needed for other machine types
    }

    // Use parameterized queries to prevent SQL injection
    const result = await sql.query`
      INSERT INTO production_planning (date, customer, type, machine_number, part_name, part_ID, quantity, planned_cycle_time, shift, process, plancategory, status)
      VALUES (
        ${date1},
        ${selectedCustomer},
        ${selectedMachinetype.name},
        ${selectedMachineNumber},  -- Assuming machine_number is a numeric field
        ${value1},
        ${value2},
        ${value4},
        ${value5},
        ${selectedShift.name},
        ${selectedProcess.name},   -- Insert selected process
        ${selectedPlan.name},      -- Insert selected plan category
        ${getStatus(value4)}       -- Calculate status based on quantity
      )
    `;

    res.json({ success: true, message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

app.post('/api/setuptime', async (req, res) => {
  try {
    const { selectedCustomer, value2, value3, selectedOperator, selectedMachine, selectedProcess,value4, value5, } = req.body;

    // Use parameterized queries to prevent SQL injection
    const result = await sql.query`
      INSERT INTO setuptime (cust_name, part_name, part_id, operator, machine, process,received_by,approved_by)
      VALUES (
        ${selectedCustomer},
        ${value2},
        ${value3},
        ${selectedOperator},  
        ${selectedMachine},
        ${selectedProcess},
        ${value4},
        ${value5}
      )
    `;

    res.json({ success: true, message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

app.post('/api/iteration', async (req, res) => {
  try {
    const { selectedCustomer, value6, value7, cycleTimeInputs,selectedOperator } = req.body;

    // Use parameterized queries to prevent SQL injection
    const queries = [];

    // Get the current timestamp
    const currentTimestamp = new Date().toISOString();

    // Insert multiple rows based on quantity
    for (let i = 0; i < value7; i++) {
      // Insert each cycle time input separately
      queries.push(sql.query`
        INSERT INTO iteration (cust_name, iteration, quantity, cycletime, time, employee)
        VALUES (
          ${selectedCustomer},
          ${value6},
          ${value7},
          ${cycleTimeInputs[i]?.value},
          ${currentTimestamp}, -- Insertion timestamp
          ${selectedOperator}

        )
      `);
    }

    // Execute all queries concurrently
    await Promise.all(queries);

    res.json({ success: true, message: 'Data inserted successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});




app.post('/api/quality', async (req, res) => {
  try {
    const { currentDate, itemname, quantity, employee_accepted_count, rejection, id } = req.body;

    const pool = await sql.connect(config);

    // Start a transaction
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      // Insert into the quality table
      const insertQualityResult = await transaction.request().query`
        INSERT INTO quality (date, partname, totalcount, emp_count, rejection)
        VALUES (${currentDate}, ${itemname}, ${quantity}, ${employee_accepted_count}, ${rejection})
      `;

      // Update the machine_allocation table to mark the record as submitted
      const updateMachineAllocationResult = await transaction.request().query`
        UPDATE machine_allocation SET submitted = 1 WHERE id = ${id}
      `;

      // Commit the transaction
      await transaction.commit();

      res.json({ success: true, message: 'Data inserted and updated successfully' });
    } catch (error) {
      // Rollback the transaction on error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

//quantity
app.get('/api/quantityshow', async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const result = await pool.request().query('SELECT * FROM quality');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching customer data:', error.message);
    res.status(500).send('Error fetching customer data');
  }
});



// customer entry CRUD operation
app.get('/customer_entry', async (req, res) => {
  try {
    const pool = await sql.connect(config);

    const result = await pool.request().query('SELECT * FROM customer_entry');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching customer data:', error.message);
    res.status(500).send('Error fetching customer data');
  }
});

app.post('/insert1', async (req, res) => {
  try {
   
    await sql.connect(config);
    const request = new sql.Request();
    const query = `
      INSERT INTO customer_entry (customer_id, customer_name, customer_type, address, mail_id, contact_person, phone_number)
      VALUES (@customer_id, @customer_name, @customer_type, @address, @mail_id, @contact_person, @phone_number)
    `;

    request.input('customer_id', sql.VarChar, req.body.customer_id);
    request.input('customer_name', sql.VarChar, req.body.customer_name);
    request.input('customer_type', sql.VarChar, req.body.customer_type);
    request.input('address', sql.VarChar, req.body.address);
    request.input('mail_id', sql.VarChar, req.body.mail_id);
    request.input('contact_person', sql.VarChar, req.body.contact_person);
    request.input('phone_number', sql.NChar, req.body.phone_number);
    const result = await request.query(query);

    console.log('Data inserted successfully:', result);
    res.status(201).json({ success: true, message: 'Data inserted successfully', insertedData: req.body });

  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ success: false, message: 'Error inserting data', error: err.message });
  } finally {
    sql.close();
  }
});

// Update customer data route
app.put('/api/customers/:id', async (req, res) => {
  const id = req.params.id;
  const newData = req.body;

  try {
    
    await sql.connect(config);

    const request = new sql.Request();

    request.input('customer_id', sql.VarChar, newData.customer_id);
    request.input('customer_name', sql.VarChar, newData.customer_name);
    request.input('customer_type', sql.VarChar, newData.customer_type);
    request.input('address', sql.VarChar, newData.address);
    request.input('mail_id', sql.VarChar, newData.mail_id);
    request.input('contact_person', sql.VarChar, newData.contact_person);
    request.input('phone_number', sql.VarChar, newData.phone_number);
    request.input('id', sql.Int, id);
    
    const result = await request.query(`
      UPDATE customer_entry SET 
      customer_id = @customer_id,
      customer_name = @customer_name,
      customer_type = @customer_type,
      address = @address,
      mail_id = @mail_id,
      contact_person = @contact_person,
      phone_number = @phone_number
      WHERE id = @id
    `);

    console.log('Customer data updated successfully');
    res.status(200).json({ message: 'Customer data updated successfully' });
  } catch (err) {
    console.error('Error updating customer data:', err);
    res.status(500).json({ error: 'An error occurred while updating customer data.' });
  } finally {
    sql.close();
  }
});

// Delete customer data route
app.delete('/api/customers/:id', async (req, res) => {
  const id = req.params.id;

  try {
    await sql.connect(config);
    const request = new sql.Request();
    const result = await request.query(`
      DELETE FROM customer_entry WHERE id = '${id}'
    `);

    console.log('Customer data deleted successfully');
    res.status(200).json({ message: 'Customer data deleted successfully' });
  } catch (err) {
    console.error('Error deleting customer data:', err);
    res.status(500).json({ error: 'An error occurred while deleting customer data.' });
  } finally {
    sql.close();
  }
});



// employee entry crud method
app.get('/employee_entry', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM employe_entry');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching employee data:', error);
    res.status(500).send('Error fetching employee data');
  }
});
// POST method for inserting employee data
app.post('/insertEmployee', async (req, res) => {
  try {
    const { employee_id, employee_name, joining_year, employee_type, mail_id, phone_number } = req.body;
    if (!employee_id || !employee_name || !joining_year || !employee_type || !mail_id || !phone_number) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    await sql.connect(config);
    const request = new sql.Request();
    const query = `
      INSERT INTO employe_entry (employee_id, employee_name, joining_year, employee_type, mail_id, phone_number)
      VALUES (@employee_id, @employee_name, @joining_year, @employee_type, @mail_id, @phone_number)
    `;
    request.input('employee_id', sql.VarChar, employee_id);
    request.input('employee_name', sql.VarChar, employee_name);
    request.input('joining_year', sql.VarChar, joining_year);
    request.input('employee_type', sql.VarChar, employee_type);
    request.input('mail_id', sql.VarChar, mail_id);
    request.input('phone_number', sql.VarChar, phone_number);
    const result = await request.query(query);
    console.log('Data inserted successfully:', result);
    res.status(201).json({ success: true, message: 'Data inserted successfully', insertedData: req.body });
  } catch (err) {
    console.error('Error inserting employee data:', err);
    res.status(500).json({ success: false, message: 'Error inserting employee data', error: err.message });
  } finally {
    sql.close();
  }
});

// PUT method for updating employee data
app.put('/api/employees/:id', async (req, res) => {
  const id = req.params.id;
  const newData = req.body;

  try {
    await sql.connect(config);
    const request = new sql.Request();
    request.input('employee_id', sql.VarChar, newData.employee_id);
    request.input('employee_name', sql.VarChar, newData.employee_name);
    request.input('joining_year', sql.VarChar, newData.joining_year);
    request.input('employee_type', sql.VarChar, newData.employee_type);
    request.input('mail_id', sql.VarChar, newData.mail_id);
    request.input('phone_number', sql.VarChar, newData.phone_number);
    request.input('id', sql.Int, id);
    
    const result = await request.query(`
      UPDATE employe_entry SET 
      employee_id = @employee_id,
      employee_name = @employee_name,
      joining_year = @joining_year,
      employee_type = @employee_type,
      mail_id = @mail_id,
      phone_number = @phone_number
      WHERE id = @id
    `);

    console.log('Employee data updated successfully');
    res.status(200).json({ message: 'Employee data updated successfully' });
  } catch (err) {
    console.error('Error updating employee data:', err);
    res.status(500).json({ error: 'An error occurred while updating employee data.' });
  } finally {
    sql.close();
  }
});

// DELETE method for deleting employee data
app.delete('/api/employees/:id', async (req, res) => {
  const id = req.params.id;

  try {
    await sql.connect(config);
    const request = new sql.Request();
    const result = await request.query(`
      DELETE FROM employe_entry 
      WHERE id = ${id}
    `);

    console.log('Employee deleted successfully');
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error('Error deleting employee:', err);
    res.status(500).json({ error: 'An error occurred while deleting employee.' });
  } finally {
    sql.close();
  }
});



//part entry crud method
app.post('/api/insertPartEntry', async (req, res) => {
  try {
    const {  partName, partId } = req.body;
    if ( !partName || !partId ) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    await sql.connect(config);
    const request = new sql.Request();
    const query = `
      INSERT INTO part_entry ( part_id,part_name )
      VALUES ( @partId,@partName )
    `;
    request.input('partId', sql.VarChar, partId);
    request.input('partName', sql.VarChar, partName);
   
   
    
    const result = await request.query(query);
    console.log('Part entry inserted successfully:', result);
    res.status(201).json({ success: true, message: 'Data inserted successfully' });
  } catch (err) {
    console.error('Error inserting part entry:', err);
    res.status(500).json({ success: false, message: 'Error inserting part entry', error: err.message });
  } finally {
    sql.close();
  }
});

// PUT method for updating part entry
app.put('/api/parts/:id', async (req, res) => {
  const id = req.params.id;
  const newData = req.body;
  try {
    await sql.connect(config);
    const request = new sql.Request();
    
    request.input('partName', sql.VarChar, newData.partName);
    request.input('partId', sql.VarChar, newData.partId);
    request.input('id', sql.Int, id);
    
    const result = await request.query(`
      UPDATE part_entry SET 
        part_name = @partName,
        part_id = @partId
      WHERE id = @id
    `);

    console.log('Part entry updated successfully');
    res.status(200).json({ message: 'Part entry updated successfully' });
  } catch (err) {
    console.error('Error updating part entry:', err);
    res.status(500).json({ error: 'An error occurred while updating part entry.' });
  } finally {
    sql.close();
  }
});


// DELETE method for deleting part entry
app.delete('/api/parts/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await sql.connect(config);
    const request = new sql.Request();
    const result = await request.query(`
      DELETE FROM part_entry 
      WHERE id = ${id}
    `);

    console.log('Part entry deleted successfully');
    res.status(200).json({ message: 'Part entry deleted successfully' });
  } catch (err) {
    console.error('Error deleting part entry:', err);
    res.status(500).json({ error: 'An error occurred while deleting part entry.' });
  } finally {
    sql.close();
  }
});

app.get('/part_entries', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM part_entry');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching part entry data:', error);
    res.status(500).send('Error fetching part entry data');
  }
});

app.get('/excelpart', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM part_excel');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching part entry data:', error);
    res.status(500).send('Error fetching part entry data');
  }
});
app.get('/excelemp', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM employee_excel');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching part entry data:', error);
    res.status(500).send('Error fetching part entry data');
  }
});
app.get('/excelprocess', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM process_excel');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching part entry data:', error);
    res.status(500).send('Error fetching part entry data');
  }
});



app.get('/api/customers/names', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT customer_name FROM customer_entry');
    const names = result.recordset.map(row => row.customer_name);
    res.json(names);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


//new process entry module
app.post('/insertFormData', async (req, res) => {
  try {
    const { processId, processName, machineName } = req.body;
    if (!processId || !processName || !machineName) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }
    await sql.connect(config);
    const request = new sql.Request();
    const query = `
      INSERT INTO process_newentry (process_id, process_name, process_type)
      VALUES (@processId, @processName, @machineName)
    `;
    request.input('processId', sql.VarChar, processId);
    request.input('processName', sql.VarChar, processName);
    request.input('machineName', sql.VarChar, machineName);
    const result = await request.query(query);
    console.log('Process entry inserted successfully:', result);
    res.status(201).json({ success: true, message: 'Process entry inserted successfully' });
  } catch (err) {
    console.error('Error inserting process entry:', err);
    res.status(500).json({ success: false, message: 'Error inserting process entry', error: err.message });
  } finally {
    sql.close();
  }
});




app.put('/api/processes/:id', async (req, res) => {
  const id = req.params.id;
  const { processId, processName, machineName } = req.body;
  try {
    await sql.connect(config);
    await sql.query`
      UPDATE process_newentry 
      SET 
        process_id = ${processId},
        process_name = ${processName},
        process_type = ${machineName}
      WHERE id = ${id}
    `;
    
    console.log('Process entry updated successfully');
    res.status(200).json({ message: 'Process entry updated successfully' });
  } catch (err) {
    console.error('Error updating process entry:', err);
    res.status(500).json({ error: 'Error updating process entry' });
  } finally {
    sql.close();
  }
});



// DELETE method for deleting process entry
app.delete('/api/processes/:id', async (req, res) => {
  const id = req.params.id;

  try {
    await sql.connect(config);
    const result = await sql.query(`
      DELETE FROM process_newentry 
      WHERE id = ${id}
    `);

    console.log('Process entry deleted successfully');
    res.status(200).send('Process entry deleted successfully');
  } catch (err) {
    console.error('Error deleting process entry:', err);
    res.status(500).send('Error deleting process entry');
  } finally {
    sql.close();
  }
});

app.get('/api/processes', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM process_newentry');
    const processes = result.recordset;
    res.json(processes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// maintenance planned data insert query
app.post('/submit', async (req, res) => {
  try {
    await sql.connect(config);

    for (const entry of req.body) {
      console.log('Entry:', entry);

      // Handle potential undefined date
      const parsedDate = moment(entry.date).isValid() ? moment(entry.date).tz('your_time_zone') : null;
      const formattedDate = parsedDate ? parsedDate.format('YYYY-MM-DD') : null;

      let tableName;
      switch (entry.machineName) {
        case 'CNC 001':
          tableName = 'planned_cnc';
          break;
        case 'CNC 002':
          tableName = 'planned_cnc002';
          break;
        case 'CNC 003':
          tableName = 'planned_cnc003';
          break;
        case 'CNC 004':
          tableName = 'planned_cnc004';
          break;
        case 'CNC 005':
          tableName = 'planned_cnc005';
          break;
        case 'VMC 001':
          tableName = 'planned_vmc001';
          break;
          case 'VMC 002':
            tableName = 'planned_vmc002';
            break;
        case 'Welding Auto':
          tableName = 'welding_auto1';
          break;
        case 'Welding Manual':
          tableName = 'welding_manual1';
          break;
        case 'Test Station 1':
          tableName = 'test_station1';
          break;
        case 'Test Station 2':
          tableName = 'test_station2';
          break;
        case 'Test Station 3':
          tableName = 'test_station3';
          break;
        default:
          // Handle invalid machine names explicitly
          return res.status(400).send(`Invalid machine name: ${entry.machineName}`);
      }

      const query = `
        INSERT INTO ${tableName} (date, machine_name, maintenance_description, checkbox, reviewed_by, approved_by)
        VALUES (@date, @machineName, @maintenanceDescription, @checkbox, @reviewedBy, @approvedBy)
      `;

      const request = new sql.Request();

      request.input('date', sql.Date, formattedDate);
      request.input('machineName', sql.NVarChar, entry.machineName);
      request.input('maintenanceDescription', sql.NVarChar, entry.maintenanceDescription);
      request.input('checkbox', sql.NVarChar, entry.checkbox ? 'complete' : 'pending');
      request.input('reviewedBy', sql.NVarChar, entry.reviewedBy);
      request.input('approvedBy', sql.NVarChar, entry.approvedBy);

      const result = await request.query(query);
      console.log('Rows affected:', result.rowsAffected);
    }
    await sql.close();
    res.status(200).send('Form data submitted successfully!');
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal server error');
  }
});



// planned cnc
app.put('/api/updateItem/:id', async (req, res) => {
  try {
    const itemId = req.params.id; 
    const { date, machine_name, maintenance_description, checkbox, reviewed_by, approved_by } = req.body;
    const query = `
    UPDATE planned_cnc 
    SET date = @date, 
        machine_name = @machineName, 
        maintenance_description = @maintenanceDescription, 
        checkbox = @checkbox, 
        reviewed_by = @reviewedBy, 
        approved_by = @approvedBy
    WHERE id = @itemId
  `;
    const request = new sql.Request();
    request.input('date', sql.Date, date);
    request.input('machineName', sql.NVarChar, machine_name);
    request.input('maintenanceDescription', sql.NVarChar, maintenance_description);
    request.input('checkbox', sql.NVarChar, checkbox );
    request.input('reviewedBy', sql.NVarChar, reviewed_by);
    request.input('approvedBy', sql.NVarChar, approved_by);
    request.input('itemId', sql.Int, itemId);

    const result = await request.query(query);

    console.log('Rows affected:', result.rowsAffected);
    res.status(200).json({ message: 'Item updated successfully!'});
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal server error'});
  }
});


app.delete('/api/deleteItem/:itemId', async (req, res) => {
  try {
    
    const itemId = req.params.itemId;
    const query = 'DELETE FROM planned_cnc WHERE id = @itemId';
    const request = new sql.Request(); 
    request.input('itemId', sql.Int, itemId);
    const result = await request.query(query);
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.get('/api/tableData', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM planned_cnc');
    const tableData = result.recordset;
    res.json(tableData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// planned cnc2
app.get('/api/anotherTableData', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM planned_cnc002');
    const tableData = result.recordset;
    res.json(tableData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/updateItemc/:id', async (req, res) => {
  try {
    const itemId = req.params.id; 
    const { date, machine_name, maintenance_description, checkbox, reviewed_by, approved_by } = req.body;
    const query = `
    UPDATE planned_cnc002 
    SET date = @date, 
        machine_name = @machineName, 
        maintenance_description = @maintenanceDescription, 
        checkbox = @checkbox, 
        reviewed_by = @reviewedBy, 
        approved_by = @approvedBy
    WHERE id = @itemId
  `;
    const request = new sql.Request();
    request.input('date', sql.Date, date);
    request.input('machineName', sql.NVarChar, machine_name);
    request.input('maintenanceDescription', sql.NVarChar, maintenance_description);
    request.input('checkbox', sql.NVarChar, checkbox);
    request.input('reviewedBy', sql.NVarChar, reviewed_by);
    request.input('approvedBy', sql.NVarChar, approved_by);
    request.input('itemId', sql.Int, itemId);

    const result = await request.query(query);
    
  console.log('Rows affected:', result.rowsAffected);
    res.status(200).json({ message: 'Item updated successfully!'});
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal server error'});
  }
});


app.delete('/api/deleteItemc/:itemId', async (req, res) => {
  try {
    
    const itemId = req.params.itemId;
    const query = 'DELETE FROM planned_cnc002 WHERE id = @itemId';
    const request = new sql.Request();
    request.input('itemId', sql.Int, itemId);
    const result = await request.query(query);
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// planned cnc3
app.get('/api/plannedTableData', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM planned_cnc003');
    const tableData = result.recordset;
    res.json(tableData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/updateItema/:id', async (req, res) => {
  try {
    const itemId = req.params.id; 
    const { date, machine_name, maintenance_description, checkbox, reviewed_by, approved_by } = req.body;
    const query = `
    UPDATE planned_cnc003 
    SET date = @date, 
        machine_name = @machineName, 
        maintenance_description = @maintenanceDescription, 
        checkbox = @checkbox, 
        reviewed_by = @reviewedBy, 
        approved_by = @approvedBy
    WHERE id = @itemId
  `;
    const request = new sql.Request();
    request.input('date', sql.Date, date);
    request.input('machineName', sql.NVarChar, machine_name);
    request.input('maintenanceDescription', sql.NVarChar, maintenance_description);
    request.input('checkbox', sql.NVarChar, checkbox );
    request.input('reviewedBy', sql.NVarChar, reviewed_by);
    request.input('approvedBy', sql.NVarChar, approved_by);
    request.input('itemId', sql.Int, itemId);

    const result = await request.query(query);
   console.log('Rows affected:', result.rowsAffected);
    res.status(200).json({ message: 'Item updated successfully!'});
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal server error'});
  }
});


app.delete('/api/deleteItema/:itemId', async (req, res) => {
  try {
    
    const itemId = req.params.itemId;
    const query = 'DELETE FROM planned_cnc003 WHERE id = @itemId';
    const request = new sql.Request();
    request.input('itemId', sql.Int, itemId);
    const result = await request.query(query);
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// planned cnc4
app.get('/api/planTableData', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM planned_cnc004');
    const tableData = result.recordset;
    res.json(tableData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/updateItemb/:id', async (req, res) => {
  try {
    const itemId = req.params.id; 
    const { date, machine_name, maintenance_description, checkbox, reviewed_by, approved_by } = req.body;
    const query = `
    UPDATE planned_cnc004 
    SET date = @date, 
        machine_name = @machineName, 
        maintenance_description = @maintenanceDescription, 
        checkbox = @checkbox, 
        reviewed_by = @reviewedBy, 
        approved_by = @approvedBy
    WHERE id = @itemId
  `;
    const request = new sql.Request();
    request.input('date', sql.Date, date);
    request.input('machineName', sql.NVarChar, machine_name);
    request.input('maintenanceDescription', sql.NVarChar, maintenance_description);
    request.input('checkbox', sql.NVarChar, checkbox );
    request.input('reviewedBy', sql.NVarChar, reviewed_by);
    request.input('approvedBy', sql.NVarChar, approved_by);
    request.input('itemId', sql.Int, itemId);

    const result = await request.query(query);
    console.log('Rows affected:', result.rowsAffected);
    res.status(200).json({ message: 'Item updated successfully!'});
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal server error'});
  }
});


app.delete('/api/deleteItemb/:itemId', async (req, res) => {
  try {
    
    const itemId = req.params.itemId;
    const query = 'DELETE FROM planned_cnc004 WHERE id = @itemId';
    const request = new sql.Request();
    request.input('itemId', sql.Int, itemId);
    const result = await request.query(query);
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});
 

// planned cnc5
app.get('/api/plannTableData', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM planned_cnc005');
    const tableData = result.recordset;
    res.json(tableData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/updateItemd/:id', async (req, res) => {
  try {
    const itemId = req.params.id; 
    const { date, machine_name, maintenance_description, checkbox, reviewed_by, approved_by } = req.body;
    const query = `
    UPDATE planned_cnc005 
    SET date = @date, 
        machine_name = @machineName, 
        maintenance_description = @maintenanceDescription, 
        checkbox = @checkbox, 
        reviewed_by = @reviewedBy, 
        approved_by = @approvedBy
    WHERE id = @itemId
  `;
    const request = new sql.Request();
    request.input('date', sql.Date, date);
    request.input('machineName', sql.NVarChar, machine_name);
    request.input('maintenanceDescription', sql.NVarChar, maintenance_description);
    request.input('checkbox', sql.NVarChar, checkbox );
    request.input('reviewedBy', sql.NVarChar, reviewed_by);
    request.input('approvedBy', sql.NVarChar, approved_by);
    request.input('itemId', sql.Int, itemId);

    const result = await request.query(query);
    console.log('Rows affected:', result.rowsAffected);
     res.status(200).json({ message: 'Item updated successfully!'});
   } catch (error) {
     console.error('Error:', error.message);
     res.status(500).json({ error: 'Internal server error'});
   }
});


app.delete('/api/deleteItemd/:itemId', async (req, res) => {
  try {
    
    const itemId = req.params.itemId;
    const query = 'DELETE FROM planned_cnc005 WHERE id = @itemId';
    const request = new sql.Request();
    request.input('itemId', sql.Int, itemId);
    const result = await request.query(query);
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// planned vmv1
app.get('/api/planvTableData', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM planned_vmc001');
    const tableData = result.recordset;
    res.json(tableData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/updateIteme/:id', async (req, res) => {
  try {
    const itemId = req.params.id; 
    const { date, machine_name, maintenance_description, checkbox, reviewed_by, approved_by } = req.body;
    const query = `
    UPDATE planned_vmc001 
    SET date = @date, 
        machine_name = @machineName, 
        maintenance_description = @maintenanceDescription, 
        checkbox = @checkbox, 
        reviewed_by = @reviewedBy, 
        approved_by = @approvedBy
    WHERE id = @itemId
  `;
    const request = new sql.Request();
    request.input('date', sql.Date, date);
    request.input('machineName', sql.NVarChar, machine_name);
    request.input('maintenanceDescription', sql.NVarChar, maintenance_description);
    request.input('checkbox', sql.NVarChar, checkbox );
    request.input('reviewedBy', sql.NVarChar, reviewed_by);
    request.input('approvedBy', sql.NVarChar, approved_by);
    request.input('itemId', sql.Int, itemId);

     const result = await request.query(query);
   console.log('Rows affected:', result.rowsAffected);
    res.status(200).json({ message: 'Item updated successfully!'});
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal server error'});
  }
});


app.delete('/api/deleteIteme/:itemId', async (req, res) => {
  try {
    
    const itemId = req.params.itemId;
    const query = 'DELETE FROM planned_vmc001 WHERE id = @itemId';
    const request = new sql.Request();
    request.input('itemId', sql.Int, itemId);
    const result = await request.query(query);
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//planned_vmc002
app.get('/api/planvmc2TableData', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM planned_vmc002');
    const tableData = result.recordset;
    res.json(tableData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/updateItemev/:id', async (req, res) => {
  try {
    const itemId = req.params.id; 
    const { date, machine_name, maintenance_description, checkbox, reviewed_by, approved_by } = req.body;
    const query = `
    UPDATE planned_vmc002 
    SET date = @date, 
        machine_name = @machineName, 
        maintenance_description = @maintenanceDescription, 
        checkbox = @checkbox, 
        reviewed_by = @reviewedBy, 
        approved_by = @approvedBy
    WHERE id = @itemId
  `;
    const request = new sql.Request();
    request.input('date', sql.Date, date);
    request.input('machineName', sql.NVarChar, machine_name);
    request.input('maintenanceDescription', sql.NVarChar, maintenance_description);
    request.input('checkbox', sql.NVarChar, checkbox );
    request.input('reviewedBy', sql.NVarChar, reviewed_by);
    request.input('approvedBy', sql.NVarChar, approved_by);
    request.input('itemId', sql.Int, itemId);

     const result = await request.query(query);
   console.log('Rows affected:', result.rowsAffected);
    res.status(200).json({ message: 'Item updated successfully!'});
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal server error'});
  }
});


app.delete('/api/deleteItemev/:itemId', async (req, res) => {
  try {
    
    const itemId = req.params.itemId;
    const query = 'DELETE FROM planned_vmc002 WHERE id = @itemId';
    const request = new sql.Request();
    request.input('itemId', sql.Int, itemId);
    const result = await request.query(query);
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// planned welding
app.get('/api/planwaTableData', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM welding_auto1');
    const tableData = result.recordset;
    res.json(tableData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/updateItemf/:id', async (req, res) => {
  try {
    const itemId = req.params.id; 
    const { date, machine_name, maintenance_description, checkbox, reviewed_by, approved_by } = req.body;
    const query = `
    UPDATE welding_auto1 
    SET date = @date, 
        machine_name = @machineName, 
        maintenance_description = @maintenanceDescription, 
        checkbox = @checkbox, 
        reviewed_by = @reviewedBy, 
        approved_by = @approvedBy
    WHERE id = @itemId
  `;
    const request = new sql.Request();
    request.input('date', sql.Date, date);
    request.input('machineName', sql.NVarChar, machine_name);
    request.input('maintenanceDescription', sql.NVarChar, maintenance_description);
    request.input('checkbox', sql.NVarChar, checkbox );
    request.input('reviewedBy', sql.NVarChar, reviewed_by);
    request.input('approvedBy', sql.NVarChar, approved_by);
    request.input('itemId', sql.Int, itemId);

    const result = await request.query(query);
   console.log('Rows affected:', result.rowsAffected);
    res.status(200).json({ message: 'Item updated successfully!'});
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal server error'});
  }
});


app.delete('/api/deleteItemf/:itemId', async (req, res) => {
  try {
    
    const itemId = req.params.itemId;
    const query = 'DELETE FROM welding_auto1 WHERE id = @itemId';
    const request = new sql.Request();
    request.input('itemId', sql.Int, itemId);
    const result = await request.query(query);
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// planned manual
app.get('/api/planwmTableData', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM welding_manual1');
    const tableData = result.recordset;
    res.json(tableData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/updateItemg/:id', async (req, res) => {
  try {
    const itemId = req.params.id; 
    const { date, machine_name, maintenance_description, checkbox, reviewed_by, approved_by } = req.body;
    const query = `
    UPDATE welding_manual1 
    SET date = @date, 
        machine_name = @machineName, 
        maintenance_description = @maintenanceDescription, 
        checkbox = @checkbox, 
        reviewed_by = @reviewedBy, 
        approved_by = @approvedBy
    WHERE id = @itemId
  `;
    const request = new sql.Request();
    request.input('date', sql.Date, date);
    request.input('machineName', sql.NVarChar, machine_name);
    request.input('maintenanceDescription', sql.NVarChar, maintenance_description);
    request.input('checkbox', sql.NVarChar, checkbox );
    request.input('reviewedBy', sql.NVarChar, reviewed_by);
    request.input('approvedBy', sql.NVarChar, approved_by);
    request.input('itemId', sql.Int, itemId);

    const result = await request.query(query);
   console.log('Rows affected:', result.rowsAffected);
    res.status(200).json({ message: 'Item updated successfully!'});
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal server error'});
  }
});


app.delete('/api/deleteItemg/:itemId', async (req, res) => {
  try {
    
    const itemId = req.params.itemId;
    const query = 'DELETE FROM welding_manual1 WHERE id = @itemId';
    const request = new sql.Request();
    request.input('itemId', sql.Int, itemId);
    const result = await request.query(query);
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// planned station1
app.get('/api/planteTableData', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM test_station1');
    const tableData = result.recordset;
    res.json(tableData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/updateItemh/:id', async (req, res) => {
  try {
    const itemId = req.params.id; 
    const { date, machine_name, maintenance_description, checkbox, reviewed_by, approved_by } = req.body;
    const query = `
    UPDATE test_station1
    SET date = @date, 
        machine_name = @machineName, 
        maintenance_description = @maintenanceDescription, 
        checkbox = @checkbox, 
        reviewed_by = @reviewedBy, 
        approved_by = @approvedBy
    WHERE id = @itemId
  `;
    const request = new sql.Request();
    request.input('date', sql.Date, date);
    request.input('machineName', sql.NVarChar, machine_name);
    request.input('maintenanceDescription', sql.NVarChar, maintenance_description);
    request.input('checkbox', sql.NVarChar, checkbox);
    request.input('reviewedBy', sql.NVarChar, reviewed_by);
    request.input('approvedBy', sql.NVarChar, approved_by);
    request.input('itemId', sql.Int, itemId);

    const result = await request.query(query);
   console.log('Rows affected:', result.rowsAffected);
    res.status(200).json({ message: 'Item updated successfully!'});
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal server error'});
  }
});


app.delete('/api/deleteItemh/:itemId', async (req, res) => {
  try {
    
    const itemId = req.params.itemId;
    const query = 'DELETE FROM test_station1 WHERE id = @itemId';
    const request = new sql.Request();
    request.input('itemId', sql.Int, itemId);
    const result = await request.query(query);
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// planned station2
app.get('/api/plantesTableData', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM test_station2');
    const tableData = result.recordset;
    res.json(tableData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/updateItemi/:id', async (req, res) => {
  try {
    const itemId = req.params.id; 
    const { date, machine_name, maintenance_description, checkbox, reviewed_by, approved_by } = req.body;
    const query = `
    UPDATE test_station2
    SET date = @date, 
        machine_name = @machineName, 
        maintenance_description = @maintenanceDescription, 
        checkbox = @checkbox, 
        reviewed_by = @reviewedBy, 
        approved_by = @approvedBy
    WHERE id = @itemId
  `;
    const request = new sql.Request();
    request.input('date', sql.Date, date);
    request.input('machineName', sql.NVarChar, machine_name);
    request.input('maintenanceDescription', sql.NVarChar, maintenance_description);
    request.input('checkbox', sql.NVarChar, checkbox );
    request.input('reviewedBy', sql.NVarChar, reviewed_by);
    request.input('approvedBy', sql.NVarChar, approved_by);
    request.input('itemId', sql.Int, itemId);

    const result = await request.query(query);
   console.log('Rows affected:', result.rowsAffected);
    res.status(200).json({ message: 'Item updated successfully!'});
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal server error'});
  }
});


app.delete('/api/deleteItemi/:itemId', async (req, res) => {
  try {
    
    const itemId = req.params.itemId;
    const query = 'DELETE FROM test_station2 WHERE id = @itemId';
    const request = new sql.Request();
    request.input('itemId', sql.Int, itemId);
    const result = await request.query(query);
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// planned station3
app.get('/api/plantestTableData', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM test_station3');
    const tableData = result.recordset;
    res.json(tableData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/updateItemj/:id', async (req, res) => {
  try {
    const itemId = req.params.id; 
    const { date, machine_name, maintenance_description, checkbox, reviewed_by, approved_by } = req.body;
    const query = `
    UPDATE test_station3
    SET date = @date, 
        machine_name = @machineName, 
        maintenance_description = @maintenanceDescription, 
        checkbox = @checkbox, 
        reviewed_by = @reviewedBy, 
        approved_by = @approvedBy
    WHERE id = @itemId
  `;
    const request = new sql.Request();
    request.input('date', sql.Date, date);
    request.input('machineName', sql.NVarChar, machine_name);
    request.input('maintenanceDescription', sql.NVarChar, maintenance_description);
    request.input('checkbox', sql.NVarChar, checkbox );
    request.input('reviewedBy', sql.NVarChar, reviewed_by);
    request.input('approvedBy', sql.NVarChar, approved_by);
    request.input('itemId', sql.Int, itemId);

    const result = await request.query(query);
   console.log('Rows affected:', result.rowsAffected);
    res.status(200).json({ message: 'Item updated successfully!'});
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal server error'});
  }
});


app.delete('/api/deleteItemj/:itemId', async (req, res) => {
  try {
    
    const itemId = req.params.itemId;
    const query = 'DELETE FROM test_station3 WHERE id = @itemId';
    const request = new sql.Request();
    request.input('itemId', sql.Int, itemId);
    const result = await request.query(query);
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/qualitysum', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT date, customer, partname, totalcount, emp_count, rejection FROM quality');
    const qualityData = result.recordset;
    res.json(qualityData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//new process entry module
app.post('/api/process', async (req, res) => {
  const { processId, processName, processType } = req.body;
  try {
    await sql.connect(config);
    const request = new sql.Request();
    const query = `
      INSERT INTO process_newentry (process_id, process_name, process_type)
      VALUES (@processId, @processName, @processType)
    `;
    request.input('processId', sql.VarChar, processId);
    request.input('processName', sql.VarChar, processName);
    request.input('processType', sql.VarChar, processType);
    
    const result = await request.query(query);
    console.log('Process entry inserted successfully:', result);
    res.status(201).json({ success: true, message: 'Process entry inserted successfully' });
  } catch (err) {
    console.error('Error inserting process entry:', err);
    res.status(500).json({ success: false, message: 'Error inserting process entry', error: err.message });
  } finally {
    sql.close();
  }
});

app.get('/api/processitem/names', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT process_id FROM process_newentry');
    const names = result.recordset.map(row => row.process_id);
    res.json(names);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/processname/names', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT process_name FROM process_newentry');
    const names = result.recordset.map(row => row.process_name);
    res.json(names);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.get('/api/processtype/names', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT process_type FROM process_newentry');
    const names = result.recordset.map(row => row.process_type);
    res.json(names);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/tableprocess', async (req, res) => {
  const { partId, partName, processId, processName, processType, cycleTime, programNo } = req.body;
  try {
    await sql.connect(config);
    const request = new sql.Request();
    const query = `
      INSERT INTO process_tableentry (part_id, part_name, process_id, process_name, process_type, cycle_time, program_no)
      VALUES (@partId, @partName, @processId, @processName, @processType, @cycleTime, @programNo)
    `;
    request.input('partId', sql.VarChar, partId);
    request.input('partName', sql.VarChar, partName);
    request.input('processId', sql.VarChar, processId);
    request.input('processName', sql.VarChar, processName);
    request.input('processType', sql.VarChar, processType);
    request.input('cycleTime', sql.VarChar, cycleTime);
    request.input('programNo', sql.VarChar, programNo);
    
    const result = await request.query(query);
    console.log('Process entry inserted successfully:', result);
    res.status(201).json({ success: true, message: 'Process entry inserted successfully' });
  } catch (err) {
    console.error('Error inserting process entry:', err);
    res.status(500).json({ success: false, message: 'Error inserting process entry', error: err.message });
  } finally {
    sql.close();
  }
});

app.get('/api/process/names/:partId', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const partId = req.params.partId;
    const result = await pool.request()
      .input('partId', sql.VarChar, partId)
      .query('SELECT process_id FROM process_excel ');
    
    const names = result.recordset.map(row => row.process_id);
    res.json(names);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/process/partname', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT DISTINCT process_id FROM process_excel');
    const names = result.recordset.map(row => row.process_id);
    res.json(names);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/itemdetails/:itemCodeOrName', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const itemCodeOrName = req.params.itemCodeOrName;

    const result = await pool.request()
      .input('itemCodeOrName', sql.VarChar, itemCodeOrName)
      .query(`
        SELECT part_id, part_name 
        FROM part_excel 
        WHERE part_id = @itemCodeOrName OR part_name = @itemCodeOrName
      `);

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).send({ message: 'Item not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});






// app.get('/api/part-dataexcel', async (req, res) => {
//   try {
//     const pool = await sql.connect(config);
//     const result = await pool.request().query('SELECT cust_code, fg_name FROM part_excel');
//     res.json(result.recordset);
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

app.get('/api/part-dataexcel', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT DISTINCT cust_code FROM part_excel');
    const names = result.recordset.map(row => row.cust_code);
    res.json(names);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/part-dataexcelwork', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT DISTINCT work_order FROM part_excel');
    const names = result.recordset.map(row => row.work_order);
    res.json(names);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/part-dataexcel1', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT DISTINCT fg_name FROM part_excel');
    const names = result.recordset.map(row => row.fg_name);
    res.json(names);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.get('/api/part-fgname1/:fgName', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const fgName = req.params.fgName; // Work order name    const result = await pool.request().query('SELECT DISTINCT fg_name FROM part_excel');
    const result = await pool.request()
    .input('fgName', sql.VarChar, fgName)
    .query(`
      SELECT   part_id, part_name 
      FROM part_excel
      WHERE fg_name = @fgName OR part_name = @fgName
    `);

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).send({ message: 'Item not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/workorderdetails12/:workOrserName', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const workOrserName = req.params.workOrserName; // Work order name
    
    // Query for work order details based on either part_id or part_name
    const result = await pool.request()
      .input('workOrserName', sql.VarChar, workOrserName)
      .query(`
        SELECT cust_code, fg_name, part_id, part_name 
        FROM part_excel
        WHERE work_order = @workOrserName OR part_name = @workOrserName
      `);

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).send({ message: 'Item not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



//process name get method
// Server-side endpoint for fetching process details
app.get('/api/processnamedetails/:itemCode', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const itemCode = req.params.itemCode;
    const result = await pool.request()
      .input('itemCode', sql.VarChar, itemCode)
      .query('SELECT process_name AS process_name FROM process_excel WHERE process_id = @itemCode');
    
    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).send({ message: 'Process not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get planned cycle time
app.get('/getPlannedCycleTime/:partId/:processName', async (req, res) => {
  const { partId, processName } = req.params;
  try {
    const pool = await sql.connect(config);
    const result = await pool.request()
      .input('partId', sql.VarChar, partId)
      .input('processName', sql.VarChar, processName)
      .query('SELECT cycle_time FROM part_excel WHERE part_id = @partId AND process_name = @processName');
    
    if (result.recordset.length > 0) {
      res.json({ cycle_time: result.recordset[0].cycle_time });
    } else {
      res.status(404).json({ error: 'Cycle time not found' });
    }
  } catch (error) {
    console.error('Error fetching planned cycle time:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/insertDatamac', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const {setterName, optName, startTime, endTime, dateFrom, dateTo } = req.body;
    const query = `
      INSERT INTO setter_name (setterName, operatorname, startTime, endTime, dateFrom, dateTo)
      VALUES (@setterName, @optName, @starttime, @endtime, @datefrom, @dateto)
    `;
    const request = pool.request();
    request.input('setterName',sql.NVarChar,setterName);
    request.input('optName',sql.NVarChar,optName);

    request.input('startTime', sql.NVarChar, startTime);
    request.input('endTime', sql.NVarChar, endTime);
    request.input('dateFrom', sql.NVarChar, dateFrom);
    request.input('dateTo', sql.NVarChar, dateTo);

    await request.query(query);
    res.status(200).send({ message: 'Data inserted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



//live data db
// General Information
app.post('/api/general_info', async (req, res) => {
  try {
    const { machinename, modelnumber, serialnumber, manufactor, dateinstall, addpoint, report, approve } = req.body;
    const pool = await sql.connect(config);
    const result = await sql.query`
          INSERT INTO general_information (machinename, modelnumber, serialnumber, manufacturer, dateofinstallation, addpoint, preparedby, approvedby)
          VALUES (${machinename}, ${modelnumber}, ${serialnumber}, ${manufactor}, ${dateinstall}, ${addpoint}, ${report}, ${approve})
      `;

    const request = pool.request();
    request.input('machinename', sql.NVarChar, machinename);
    request.input('modelnumber', sql.NVarChar, modelnumber);
    request.input('serialnumber', sql.NVarChar, serialnumber);
    request.input('manufactor', sql.NVarChar, manufactor);
    request.input('dateinstall', sql.Date, dateinstall);
    request.input('addpoint', sql.NVarChar, addpoint);
    request.input('report', sql.NVarChar, report);
    request.input('approve', sql.NVarChar, approve);

    res.json({ success: true, message: 'General Information inserted successfully' });
  } catch (error) {
    console.error('Error inserting General Information:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// Installation Details
app.post('/api/installation_detail', async (req, res) => {
  try {
    const { location, installedBy, installationSupervisor, installationMethod, addpoint, report, approve } = req.body;
    const pool = await sql.connect(config);
    const result = await sql.query`
          INSERT INTO installation_detail (location, installedby, installationsupervisor, installationmethod, addpoint, preparedby, approvedby)
          VALUES (${location}, ${installedBy}, ${installationSupervisor}, ${installationMethod}, ${addpoint}, ${report}, ${approve})
      `;

    res.json({ success: true, message: 'Installation Details inserted successfully' });
  } catch (error) {
    console.error('Error inserting Installation Details:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// Machine Specifications
app.post('/api/machine_specifications', async (req, res) => {
  try {
    const { powerRequirement, dimension, weight, operationalCapacity, addpoint, report, approve } = req.body;
    const pool = await sql.connect(config);
    const result = await sql.query`
          INSERT INTO machine_specifications (powerrequirements, dimensions, weight, operationalcapacity, addpoint, preparedby, approvedby)
          VALUES (${powerRequirement}, ${dimension}, ${weight}, ${operationalCapacity}, ${addpoint}, ${report}, ${approve})
      `;

    res.json({ success: true, message: 'Machine Specifications inserted successfully' });
  } catch (error) {
    console.error('Error inserting Machine Specifications:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// Safety Compliance
app.post('/api/safety_compliance', async (req, res) => {
  try {
    const { safetyFeatures, complianceStandards, safetyInspectionsConducted, inspectionDate, addpoint, report, approve } = req.body;
    const pool = await sql.connect(config);
    const result = await sql.query`
          INSERT INTO safety_compliance (safetyfeatures, compliancestandards, safetyinspections, inspectiondate, addpoint, preparedby, approvedby)
          VALUES (${safetyFeatures}, ${complianceStandards}, ${safetyInspectionsConducted}, ${inspectionDate}, ${addpoint}, ${report}, ${approve})
      `;

    res.json({ success: true, message: 'Safety Compliance inserted successfully' });
  } catch (error) {
    console.error('Error inserting Safety Compliance:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// Initial Testing Calibration
app.post('/api/initial_testing_calibration', async (req, res) => {
  try {
    const { testConducted, testResults, calibrationDetails, calibratedBy, addpoint, report, approve } = req.body;
    const pool = await sql.connect(config);
    const result = await sql.query`
          INSERT INTO initialtesting_calibration (testconducted, results, calibrationdetails, calibratedby, addpoint, preparedby, approvedby)
          VALUES (${testConducted}, ${testResults}, ${calibrationDetails}, ${calibratedBy}, ${addpoint}, ${report}, ${approve})
      `;

    res.json({ success: true, message: 'Initial Testing Calibration inserted successfully' });
  } catch (error) {
    console.error('Error inserting Initial Testing Calibration:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// Maintenance Schedule
app.post('/api/maintenance_schedule', async (req, res) => {
  try {
    const { firstMaintenanceDate, routineMaintenanceFrequency, nextScheduledMaintenance, addpoint, report, approve } = req.body;
    const pool = await sql.connect(config);
    const result = await sql.query`
          INSERT INTO maintenance_schedule (firstmaintenancedate, routinemaintenance, nextscheduledmaintenance, addpoint, preparedby, approvedby)
          VALUES (${firstMaintenanceDate}, ${routineMaintenanceFrequency}, ${nextScheduledMaintenance}, ${addpoint}, ${report}, ${approve})
      `;

    res.json({ success: true, message: 'Maintenance Schedule inserted successfully' });
  } catch (error) {
    console.error('Error inserting Maintenance Schedule:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// Training and Documentation
app.post('/api/training_and_documentation', async (req, res) => {
  try {
    const { trainingProvided, trainingDate, trainerName, documentationProvided, userManuals, addpoint, report, approve } = req.body;
    const pool = await sql.connect(config);
    const result = await sql.query`
          INSERT INTO training_documentation (trainingprovide, trainingdate, trainername, documentationprovided, usermanuals, addpoint, preparedby, approvedby)
          VALUES (${trainingProvided}, ${trainingDate}, ${trainerName}, ${documentationProvided}, ${userManuals}, ${addpoint}, ${report}, ${approve})
      `;

    res.json({ success: true, message: 'Training and Documentation inserted successfully' });
  } catch (error) {
    console.error('Error inserting Training and Documentation:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// Warranty and Support
app.post('/api/warranty_and_support', async (req, res) => {
  try {
    const { warrantyPeriod, warrantyStartDate, warrantyEndDate, supportContactInformation, addpoint, report, approve } = req.body;
    const pool = await sql.connect(config);
    const result = await sql.query`
          INSERT INTO warranty_support (warrantyperiod, warrantystartdate, warrantyenddate, supportcontact, addpoint,preparedby, approvedby)
          VALUES (${warrantyPeriod}, ${warrantyStartDate}, ${warrantyEndDate}, ${supportContactInformation}, ${addpoint}, ${report}, ${approve})
      `;

    res.json({ success: true, message: 'Warranty and Support inserted successfully' });
  } catch (error) {
    console.error('Error inserting Warranty and Support:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

//get machine names
app.get('/api/machine/names', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT  machinename FROM general_information');
    const names = result.recordset.map(row => row.machinename);
    res.json(names);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
//mapping the machine name and get that values
app.get('/api/machinenamedetails/:itemCode', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const itemCode = req.params.itemCode;
    const result = await pool.request()
      .input('itemCode', sql.VarChar, itemCode)
      .query('SELECT modelnumber AS modelnumber, serialnumber AS serialnumber, manufacturer AS manufacturer, dateofinstallation AS dateofinstallation FROM general_information WHERE machinename = @itemCode');

    if (result.recordset.length > 0) {
      res.json(result.recordset[0]);
    } else {
      res.status(404).send({ message: 'Process not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/maintenance_logs', async (req, res) => {
  try {
      const maintenanceData = req.body;

      const pool = await sql.connect(config);
      for (let log of maintenanceData) {
          const result = await sql.query`
              INSERT INTO maintenance_repairlog (date, descriptionactivity, performedby, remark, addpoint)
              VALUES (${log.date}, ${log.activity}, ${log.performedBy}, ${log.remark}, ${log.addpoint})
          `;
      }

      res.json({ success: true, message: 'Maintenance logs saved successfully' });
  } catch (error) {
      console.error('Error saving maintenance logs:', error);
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});


app.post('/api/incident_logs', async (req, res) => {
  try {
      const incidentData = req.body;

      const pool = await sql.connect(config);
      for (let log of incidentData) {
          const result = await sql.query`
              INSERT INTO incident_log (date, incidentdescription, reportedby, actiontaken, addpoint)
              VALUES (${log.date}, ${log.description}, ${log.reportedBy}, ${log.actionTaken}, ${log.addpoint})
          `;
      }

      res.json({ success: true, message: 'incident logs saved successfully' });
  } catch (error) {
      console.error('Error saving incident logs:', error);
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

app.post('/api/performance_logs', async (req, res) => {
  try {
      const performanceData = req.body;

      const pool = await sql.connect(config);
      for (let log of performanceData) {
          const result = await sql.query`
              INSERT INTO performance_utilization (date, performancemetrics, remark, addpoint)
              VALUES (${log.date}, ${log.metrics}, ${log.remarks}, ${log.addpoint})
          `;
      }

      res.json({ success: true, message: 'performance logs saved successfully' });
  } catch (error) {
      console.error('Error saving performance logs:', error);
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

app.post('/api/parts_replacement_logs', async (req, res) => {
  try {
      const partsReplacementData = req.body;

      const pool = await sql.connect(config);
      for (let log of partsReplacementData) {
          const result = await sql.query`
              INSERT INTO part_replacementlog (date, partreplaced, replacedby, remark, addpoint)
              VALUES (${log.date}, ${log.part}, ${log.replacedBy} ,${log.remarks}, ${log.addpoint})
          `;
      }

      res.json({ success: true, message: 'partsReplacementData logs saved successfully' });
  } catch (error) {
      console.error('Error saving partsReplacementData logs:', error);
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});


app.post('/api/scheduled_maintenance_logs', async (req, res) => {
  try {
      const scheduledMaintenanceData = req.body;

      const pool = await sql.connect(config);
      for (let log of scheduledMaintenanceData) {
          const result = await sql.query`
              INSERT INTO scheduled_maintenance (date, maintenancetask, performedby, remark, addpoint)
              VALUES (${log.date}, ${log.task}, ${log.performedBy} ,${log.remarks}, ${log.addpoint})
          `;
      }

      res.json({ success: true, message: 'scheduledMaintenanceData logs saved successfully' });
  } catch (error) {
      console.error('Error saving scheduledMaintenanceData logs:', error);
      res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});
//predictive backend
app.post('/api/machinedata', async(req, res) => {
try {
  const { machine_name, modelNumber, serialNumber, manufacturer, dateOfPurchase, dateOfInstallation, addpoint } = req.body;

  const pool = await sql.connect(config);
  const result = await pool.request()
      .input('machinename', sql.NVarChar, machine_name)
      .input('modelnumber', sql.NVarChar, modelNumber)
      .input('serialnumber', sql.NVarChar, serialNumber)
      .input('manufacturer', sql.NVarChar, manufacturer)
      .input('dateofpurchase', sql.NVarChar, dateOfPurchase)
      .input('dateofinstallation', sql.NVarChar, dateOfInstallation)
      .input('addpoint', sql.NVarChar, addpoint)
      .query(`
          INSERT INTO machinehistory_information (machinename, modelnumber, serialnumber, manufacturer, dateofpurchase, dateofinstallation, addpoint)
          VALUES (@machinename, @modelnumber, @serialnumber, @manufacturer, @dateofpurchase, @dateofinstallation, @addpoint)
      `);

  res.json({ success: true, message: 'Machine history information inserted successfully' });
} catch (error) {
  console.error('Error inserting machine history information:', error);
  res.status(500).json({ error: 'Internal Server Error', message: error.message });
}
});

app.post('/api/machinedata1', async(req, res) => {
  try {
    const { machine_name, modelNumber, serialNumber, manufacturer, dateOfPurchase, dateOfInstallation, addpoint } = req.body;
  
    const pool = await sql.connect(config);
    const result = await pool.request()
        .input('machinename', sql.NVarChar, machine_name)
        .input('modelnumber', sql.NVarChar, modelNumber)
        .input('serialnumber', sql.NVarChar, serialNumber)
        .input('manufacturer', sql.NVarChar, manufacturer)
        .input('dateofpurchase', sql.NVarChar, dateOfPurchase)
        .input('dateofinstallation', sql.NVarChar, dateOfInstallation)
        .input('addpoint', sql.NVarChar, addpoint)
        .query(`
            INSERT INTO machinepredictive_information (machinename, modelnumber, serialnumber, manufacturer, dateofpurchase, dateofinstallation, addpoint)
            VALUES (@machinename, @modelnumber, @serialnumber, @manufacturer, @dateofpurchase, @dateofinstallation, @addpoint)
        `);
  
    res.json({ success: true, message: 'Machine predict information inserted successfully' });
  } catch (error) {
    console.error('Error inserting machine predict information:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
  });

  app.post('/api/conditionMonitoring', async (req, res) => {
    try {
        const conditionMonitoringData = req.body;
  
        const pool = await sql.connect(config);
        for (let log of conditionMonitoringData) {
            const result = await sql.query`
                INSERT INTO condition_monitoringdata (date, sensormetric, reading, normalrange, status, remark , addpoint)
                VALUES (${log.date}, ${log.sensorMetric}, ${log.reading} ,${log.normalRange}, ${log.status}, ${log.remark} ,${log.addpoint})
            `;
        }
  
        res.json({ success: true, message: 'conditionMonitoring logs saved successfully' });
    } catch (error) {
        console.error('Error saving conditionMonitoring logs:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  });

  app.post('/api/predictionLog', async (req, res) => {
    try {
        const  predictionLogData = req.body;
  
        const pool = await sql.connect(config);
        for (let log of  predictionLogData) {
            const result = await sql.query`
                INSERT INTO prediction_log (date, predictedissue, predictivesource, confidencelevel, predictivefailuredate, remarks, addpoint )
                VALUES (${log.date}, ${log.predictedIssue}, ${log.predictionSource} ,${log.confidenceLevel}, ${log.predictedFailureDate}, ${log.remark}, ${log.addpoint})
            `;
        }
  
        res.json({ success: true, message: 'predictionLog saved successfully' });
    } catch (error) {
        console.error('Error saving predictionLog:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  });

  
  app.post('/api/maintenanceActions', async (req, res) => {
    try {
        const  maintenanceActionsData = req.body;
  
        const pool = await sql.connect(config);
        for (let log of  maintenanceActionsData) {
            const result = await sql.query`
                INSERT INTO maintenance_actiontaken (date, actiontaken, performedby, basedonperdiction,  remarks, addpoint )
                VALUES (${log.date}, ${log.actionTaken}, ${log.performedBy} ,${log.basedOnPrediction}, ${log.remark}, ${log.addpoint})
            `;
        }
  
        res.json({ success: true, message: 'maintenanceActions saved successfully' });
    } catch (error) {
        console.error('Error saving maintenanceActions:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  });

  app.post('/api/postMaintenance', async (req, res) => {
    try {
        const  postMaintenanceData = req.body;
  
        const pool = await sql.connect(config);
        for (let log of  postMaintenanceData) {
            const result = await sql.query`
                INSERT INTO post_maintenanceanalysis (date, issueresolved, remainingissue, nextstep,  remarks, addpoint )
                VALUES (${log.date}, ${log.issueResolved}, ${log.remainingIssues} ,${log.nextSteps}, ${log.remark}, ${log.addpoint})
            `;
        }
  
        res.json({ success: true, message: 'postMaintenance saved successfully' });
    } catch (error) {
        console.error('Error saving postMaintenance:', error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
  });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

