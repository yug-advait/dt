// import React, { useState } from 'react';
// import {
//   Box,
//   Paper,
//   Grid,
//   TextField,
//   Typography,
//   Button,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   MenuItem,
//   Checkbox,
//   FormControlLabel,
//   Tooltip,
//   Autocomplete,
//   useMediaQuery,
//   useTheme,
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import DeleteIcon from '@mui/icons-material/Delete';
// import InfoIcon from '@mui/icons-material/Info';
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
// import Breadcrumbs from 'components/Common/Breadcrumb';

// // Sample data for dropdowns
// const customerList = [
//   { id: 1, name: 'John Doe', phone: '1234567890', balance: 1000, address: '123 Main St' },
//   { id: 2, name: 'Jane Smith', phone: '0987654321', balance: 2000, address: '456 Oak Ave' },
// ];

// const itemList = [
//   { id: 1, name: 'Item 1', price: 100, unit: 'Box' },
//   { id: 2, name: 'Item 2', price: 200, unit: 'Bag' },
// ];


// const units = ['Box', 'Bag', 'Rol', 'NONE'];
// const taxRates = ['GST@18%', 'IGST@18%'];
// const paymentTypes = ['Cash', 'Card', 'UPI', 'Bank Transfer'];

// const CreateSalesOrder = () => {
//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
//   const [customer, setCustomer] = useState({
//     name: '',
//     phone: '',
//     balance: '',
//     address: '',
//   });

//   const [invoiceDetails, setInvoiceDetails] = useState({
//     number: '',
//     date: null,
//     state: '',
//   });

//   const [items, setItems] = useState([{
//     id: 1,
//     name: '',
//     qty: '',
//     unit: '',
//     price: '',
//     discount: '',
//     tax: '',
//     amount: 0,
//   }]);

//   const [payment, setPayment] = useState({
//     type: 'Cash',
//     roundOff: 0,
//     received: 0,
//   });

//   const calculateItemAmount = (item) => {
//     const quantity = parseFloat(item.qty) || 0;
//     const price = parseFloat(item.price) || 0;
//     const discount = parseFloat(item.discount) || 0;
//     const subtotal = quantity * price;
//     const discountAmount = (subtotal * discount) / 100;
//     const taxableAmount = subtotal - discountAmount;
//     const taxRate = item.tax === 'GST@18%' || item.tax === 'IGST@18%' ? 0.18 : 0;
//     const taxAmount = taxableAmount * taxRate;
//     return taxableAmount + taxAmount;
//   };

//   const handleItemChange = (index, field, value) => {
//     const newItems = [...items];
//     newItems[index] = { ...newItems[index], [field]: value };
//     newItems[index].amount = calculateItemAmount(newItems[index]);
//     setItems(newItems);
//   };

//   const addItem = () => {
//     setItems([...items, {
//       id: items.length + 1,
//       name: '',
//       qty: '',
//       unit: '',
//       price: '',
//       discount: '',
//       tax: '',
//       amount: 0,
//     }]);
//   };

//   const removeItem = (index) => {
//     setItems(items.filter((_, i) => i !== index));
//   };

//   const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
//   const balance = totalAmount - payment.received;

//   return (
//     <React.Fragment>
//       <div className="page-content">
//         <div className="container-fluid">
//           {/* BreadCrumbs */}
//                     <Breadcrumbs
//                       titlePath="/sales_order"
//                       title="SO"
//                       breadcrumbItem="Create SO"
//                     />
//             <Paper sx={{ p: 3, borderRadius: 2 }}>
//               <Grid container spacing={2}>
//                 {/* Customer Details */}
//                 <Grid item xs={12} md={6}>
//                   <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
//                     <Autocomplete
//                       fullWidth
//                       size="small"
//                       options={customerList}
//                       getOptionLabel={(option) => option.name}
//                       value={customerList.find(c => c.name === customer.name) || null}
//                       onChange={(_, newValue) => {
//                         if (newValue) {
//                           setCustomer(newValue);
//                         } else {
//                           setCustomer({ name: '', phone: '', balance: '', address: '' });
//                         }
//                       }}
//                       renderInput={(params) => (
//                         <TextField
//                           {...params}
//                           required
//                           label="Customer"
//                           placeholder="Select or type customer name"
//                         />
//                       )}
//                     />
//                     {/* <Typography
//                 variant="body2"
//                 color="text.secondary"
//                 sx={{
//                   whiteSpace: 'nowrap',
//                   bgcolor: 'background.paper',
//                   px: 1,
//                   py: 0.5,
//                   borderRadius: 1,
//                   border: 1,
//                   borderColor: 'divider'
//                 }}
//               >
//                 BAL: ₹{customer.balance || 0}
//               </Typography> */}
//                   </Box>
//                   <Box sx={{ mt: 1 }}>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       label="Phone No."
//                       value={customer.phone || ''}
//                       onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
//                       InputProps={{
//                         readOnly: Boolean(customer.id),
//                       }}
//                     />
//                   </Box>
//                   <Box sx={{ mt: 1 }}>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       label="Billing Address"
//                       multiline
//                       rows={3}
//                       value={customer.address || ''}
//                       onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
//                       InputProps={{
//                         readOnly: Boolean(customer.id),
//                       }}
//                     />
//                   </Box>
//                 </Grid>

//                 {/* Invoice Details */}
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     fullWidth
//                     size="small"
//                     label="Invoice Number"
//                     value={invoiceDetails.number}
//                     onChange={(e) => setInvoiceDetails({ ...invoiceDetails, number: e.target.value })}
//                   />
//                   <Box sx={{ mt: 1 }}>
//                     {/* <DatePicker
//                 label="Invoice Date"
//                 value={invoiceDetails.date}
//                 onChange={(newValue) => setInvoiceDetails({ ...invoiceDetails, date: newValue })}
//                 slotProps={{ textField: { size: 'small', fullWidth: true } }}
//               /> */}
//                   </Box>
//                   <Box sx={{ mt: 1 }}>
//                     <TextField
//                       fullWidth
//                       size="small"
//                       label="State of Supply"
//                       select
//                       value={invoiceDetails.state}
//                       onChange={(e) => setInvoiceDetails({ ...invoiceDetails, state: e.target.value })}
//                     >
//                       <MenuItem value="">Select</MenuItem>
//                       <MenuItem value="Maharashtra">Maharashtra</MenuItem>
//                       <MenuItem value="Gujarat">Gujarat</MenuItem>
//                       <MenuItem value="Karnataka">Karnataka</MenuItem>
//                     </TextField>
//                   </Box>
//                 </Grid>

//                 {/* Items Table */}
//                 <Grid item xs={12}>
//                   <TableContainer component={Paper} sx={{ mt: 2 }}>
//                     <Table size="small" sx={{
//                       '& .MuiTableCell-root': {
//                         p: isMobile ? 1 : 2,
//                         '&:first-of-type': { pl: isMobile ? 1 : 2 },
//                         '&:last-of-type': { pr: isMobile ? 1 : 2 }
//                       }
//                     }}>
//                       <TableHead>
//                         <TableRow>
//                           <TableCell>#</TableCell>
//                           <TableCell>ITEM</TableCell>
//                           <TableCell>QTY</TableCell>
//                           <TableCell>UNIT</TableCell>
//                           <TableCell>
//                             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                               <Typography>PRICE/UNIT</Typography>
//                               <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>Without tax</Typography>
//                             </Box>
//                           </TableCell>
//                           <TableCell>
//                             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                               <Typography>DISCOUNT</Typography>
//                               <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>%</Typography>
//                             </Box>
//                           </TableCell>
//                           <TableCell>
//                             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                               <Typography>TAX</Typography>
//                               <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>%</Typography>
//                             </Box>
//                           </TableCell>
//                           <TableCell>
//                             <Box sx={{ display: 'flex', alignItems: 'center' }}>
//                               <Typography>AMOUNT</Typography>
//                               <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>₹</Typography>
//                             </Box>
//                           </TableCell>
//                           <TableCell></TableCell>
//                         </TableRow>
//                       </TableHead>
//                       <TableBody>
//                         {items.map((item, index) => (
//                           <TableRow key={item.id}>
//                             <TableCell>{index + 1}</TableCell>
//                             <TableCell>
//                               <Autocomplete
//                                 size="small"
//                                 options={itemList}
//                                 getOptionLabel={(option) => option.name}
//                                 value={itemList.find(i => i.name === item.name) || null}
//                                 onChange={(_, newValue) => {
//                                   if (newValue) {
//                                     handleItemChange(index, 'name', newValue.name);
//                                     handleItemChange(index, 'price', newValue.price);
//                                     handleItemChange(index, 'unit', newValue.unit);
//                                   }
//                                 }}
//                                 renderInput={(params) => (
//                                   <TextField
//                                     {...params}
//                                     placeholder="Select or type item name"
//                                   />
//                                 )}
//                               />
//                             </TableCell>
//                             <TableCell>
//                               <TextField
//                                 size="small"
//                                 fullWidth
//                                 type="number"
//                                 value={item.qty}
//                                 onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
//                               />
//                             </TableCell>
//                             <TableCell>
//                               <TextField
//                                 size="small"
//                                 fullWidth
//                                 select
//                                 value={item.unit}
//                                 onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
//                               >
//                                 {units.map((unit) => (
//                                   <MenuItem key={unit} value={unit}>{unit}</MenuItem>
//                                 ))}
//                               </TextField>
//                             </TableCell>
//                             <TableCell>
//                               <TextField
//                                 size="small"
//                                 fullWidth
//                                 type="number"
//                                 value={item.price}
//                                 onChange={(e) => handleItemChange(index, 'price', e.target.value)}
//                               />
//                             </TableCell>
//                             <TableCell>
//                               <TextField
//                                 size="small"
//                                 fullWidth
//                                 type="number"
//                                 value={item.discount}
//                                 onChange={(e) => handleItemChange(index, 'discount', e.target.value)}
//                               />
//                             </TableCell>
//                             <TableCell>
//                               <TextField
//                                 size="small"
//                                 fullWidth
//                                 select
//                                 value={item.tax}
//                                 onChange={(e) => handleItemChange(index, 'tax', e.target.value)}
//                               >
//                                 {taxRates.map((rate) => (
//                                   <MenuItem key={rate} value={rate}>{rate}</MenuItem>
//                                 ))}
//                               </TextField>
//                             </TableCell>
//                             <TableCell>{item.amount.toFixed(2)}</TableCell>
//                             <TableCell>
//                               <IconButton onClick={() => removeItem(index)}>
//                                 <DeleteIcon />
//                               </IconButton>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </TableContainer>
//                   <Button
//                     startIcon={<AddIcon />}
//                     onClick={addItem}
//                     sx={{ mt: 1, textTransform: 'none' }}
//                   >
//                     Add Row
//                   </Button>
//                 </Grid>

//                 {/* Payment Section */}
//                 <Grid item xs={12} sx={{ mt: 2 }}>
//                   <Box sx={{
//                     display: 'flex',
//                     flexDirection: isMobile ? 'column' : 'row',
//                     alignItems: isMobile ? 'stretch' : 'center',
//                     gap: 2
//                   }}>
//                     <Box sx={{ width: isMobile ? '100%' : 200 }}>
//                       <TextField
//                         fullWidth
//                         size="small"
//                         select
//                         label="Payment Type"
//                         value={payment.type}
//                         onChange={(e) => setPayment({ ...payment, type: e.target.value })}
//                       >
//                         {paymentTypes.map((type) => (
//                           <MenuItem key={type} value={type}>{type}</MenuItem>
//                         ))}
//                       </TextField>
//                     </Box>
//                     {/* <Button
//                       size="small"
//                       sx={{ textTransform: 'none' }}
//                       startIcon={<AddIcon />}
//                     >
//                       Add Payment type
//                     </Button> */}
//                   </Box>
//                 </Grid>

//                 {/* Description and Totals Section */}
//                 <Grid container item xs={12} spacing={2}>
//                   {/* Description Box */}
//                   <Grid item xs={12} md={6}>
//                     <Box sx={{
//                       display: 'flex',
//                       flexDirection: 'column',
//                       gap: 2,
//                       p: 2,
//                       bgcolor: 'background.paper',
//                       borderRadius: 1,
//                       border: 1,
//                       borderColor: 'divider',
//                       height: '100%'
//                     }}>
//                       <Typography variant="h6" sx={{ fontWeight: 500, color: 'primary.main' }}>
//                         Description
//                       </Typography>
//                       <TextField
//                         fullWidth
//                         multiline
//                         rows={4}
//                         placeholder="Add any additional notes or details here"
//                         size="small"
//                       />
//                     </Box>
//                   </Grid>

//                   {/* Totals Box */}
//                   <Grid item xs={12} md={6}>
//                     <Box sx={{
//                       display: 'flex',
//                       flexDirection: 'column',
//                       gap: 2,
//                       alignItems: isMobile ? 'stretch' : 'flex-end',
//                       p: 2,
//                       bgcolor: 'background.paper',
//                       borderRadius: 1,
//                       border: 1,
//                       borderColor: 'divider'
//                     }}>
//                       <Typography variant="h6" sx={{ fontWeight: 500, color: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
//                         Total: ₹{totalAmount.toFixed(2)}
//                         <Tooltip title="The total amount includes all items with their quantities, prices, discounts, and applicable taxes" arrow placement="right">
//                           <InfoIcon fontSize="small" color="action" />
//                         </Tooltip>
//                       </Typography>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <FormControlLabel
//                           control={
//                             <Checkbox
//                               checked={payment.roundOff > 0}
//                               onChange={(e) => setPayment({ ...payment, roundOff: e.target.checked ? 0.07 : 0 })}
//                             />
//                           }
//                           label="Round off"
//                         />
//                         <Tooltip title="Rounds the total amount to the nearest whole number for easier calculations" arrow placement="right">
//                           <InfoIcon fontSize="small" color="action" />
//                         </Tooltip>
//                       </Box>
//                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                         <Typography>Received:</Typography>
//                         <TextField
//                           size="small"
//                           type="number"
//                           value={payment.received}
//                           onChange={(e) => setPayment({ ...payment, received: parseFloat(e.target.value) || 0 })}
//                           sx={{ width: 120 }}
//                         />
//                       </Box>
//                       <Typography variant="h6" color={balance > 0 ? 'error' : 'success.main'}>
//                         Balance: ₹{balance.toFixed(2)}
//                       </Typography>
//                     </Box>
//                   </Grid>

//                   {/* Action Buttons */}
//                   <Grid item xs={12}>
//                     <Box sx={{
//                       display: 'flex',
//                       justifyContent: isMobile ? 'center' : 'flex-end',
//                       gap: 2,
//                       mt: 2
//                     }}>
//                       <Box sx={{ display: 'flex', gap: 1 }}>
//                         {/* <Button
//                   variant="outlined"
//                   //color="primary"
//                   endIcon={<ArrowDropDownIcon />}
//                   onClick={() => console.log('Generate e-invoice')}
//                   sx={{ textTransform: 'none' }}
//                 >
//                   Generate e-invoice
//                 </Button> */}
//                         <Button
//                           variant="contained"
//                           //color="primary"
//                           onClick={() => console.log('Save')}
//                           sx={{ textTransform: 'none' }}
//                         >
//                           Save
//                         </Button>
//                       </Box>
//                     </Box>
//                   </Grid>
//                 </Grid>
//               </Grid>
//             </Paper>
         
//         </div>
//       </div>
//     </React.Fragment>
//   );
// };

// export default CreateSalesOrder;